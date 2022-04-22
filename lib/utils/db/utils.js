const CountCaches = {};

/**
 * Bu fonsiyon JSON.parse işlemi sırasıda kullanılmaktadır.
 * 
 * Mor paketi ile dışarıdan gelen Date sorgularını Js Date objesine çevirmek için kullanılmaktadır.
 * Ex: createdAt : { $gte: 'Date(2022-03-24T11:28:41.095Z)' } || createdAt : { $gte: 'Date(1648121345027)' } || createdAt : { $gte: '2022-03-24T11:28:41.095Z' }  
 * 
 * Ayrıca "__REGEXP" prefix ile string'e çevrilmiş regex ifadelerini tekrardan obje haline getirmek için kullanılmaktadır.
 * 
 * @param {*} key 
 * @param {*} value 
 * @returns 
 */
function reviver(key, value) {
  let stringDate = null;
  if (typeof value === 'string') {

    stringDate = /^Date\(([^>]+)\)/.exec(value)?.[1] || null;

    if (!stringDate) {
      stringDate = /\d{4}(.\d{2}){2}(\s|T)(\d{2}.){2}\d{2}.\d{3}Z/g.exec(value)?.[0] || null;
    }

    if (stringDate) {
      return new Date(isNaN(stringDate) ? stringDate : +stringDate);
    }
  }

  if (value?.toString().indexOf("__REGEXP ") == 0) {
    var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
    return new RegExp(m[1], m[2] || "");
  }

  return value;
}

/**
 * Obje içerisinde ki regex değerleri normal şartlarda toString karşılığı olmadığında 
 * JSON.stringify işlemi sırasında regex ifadelerinin başına "__REGEXP" prefix'i eklenerek
 * string değere çevrilir.
 * 
 * @param {*} key 
 * @param {*} value 
 * @returns 
 */
function replacer(key, value) {
  if (value instanceof RegExp) {
    return ("__REGEXP " + value.toString());
  }

  return value;
}

/**
 * Belirlenen obje içerisinde ki inner alanları silmek için kullanılmaktadır.
 * Ex: obj = {
 *    a: {
 *      b: '',
 *      c: '',
 *    }
 * }
 * 
 * deleteByPath(obj, 'a.c');
 * 
 * @param {*} object 
 * @param {*} path 
 * @returns 
 */
function deleteByPath(object, path) {
  let currentObject = object;
  const parts = path.split(".");
  const last = parts.pop();
  for (const part of parts) {
    currentObject = currentObject[part]
    if (!currentObject) {
      return
    }
  }
  delete currentObject[last];
}

/**
 * Verilen string değer için uniq bir hash değeri oluştur.
 * 
 * @param {*} str 
 * @returns 
 */
const hashString = function (str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Count Caches Updated
 * 5 dakikada bir ön belleğe alınmış sorguların countları tekrardan hesaplar.
 */
Meteor.setInterval(function () {
  Object.keys(CountCaches).forEach(function (hash) {
    const countCache = CountCaches[hash];
    countCache.count = countCache.cursor.count();
  });
}, 1000 * 60 * 5); // 5 minutes

/**
 * Check Caches Query
 * 10 dakikada bir ön belleğe alınmış sorguların son isteklerinin 30 dk önce ise ön bellekten kaldırır.
 */
Meteor.setInterval(function () {
  Object.keys(CountCaches).forEach(function (hash) {
    const countCache = CountCaches[hash];

    // Caches 1 saat önce mi oluşturuldu ise Caches den kaldırılır.
    if ((new Date() - countCache.cacheAt) > (1000 * 60 * 30)) {
      delete CountCaches[hash];
    }
  });
}, 1000 * 60 * 10); // 10 minutes

export { CountCaches, reviver, replacer, deleteByPath, hashString };