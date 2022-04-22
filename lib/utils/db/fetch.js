import { CountCaches, reviver, replacer, hashString } from './utils';

Fetch = function (_collection, _query, _options, wrapperFieldName = 'data', paginationLimit = true) {
  const result = {
    options: {
      pagination: {},
      sorting: {}
    }
  };

  result[wrapperFieldName] = [];

  let query = _query;
  let cursor = null;
  let count = 0;

  if (_options?.filtering) {
    const filterQuery = Object.keys(_options.filtering).reduce(function (obj, key) {

      if (typeof _options.filtering[key] === 'object') {
        obj[key] = JSON.parse(JSON.stringify(_options.filtering[key], replacer), reviver);
      } else if (typeof _options.filtering[key] === 'boolean') {
        obj[key] = _options.filtering[key];
      } else {
        obj[key] = {
          $regex: `${_options.filtering[key]}`,
          $options: 'i'
        };
      }

      return obj;
    }, {});

    query = { ...filterQuery, ...query };
  }

  if (_options?.searching) {
    const $or = []
    Object.keys(_options.searching).reduce(function (obj, key) {
      let _obj = {};

      _obj[key] = {
        $regex: `${_options.searching[key]}`,
        $options: 'i'
      };
      $or.push(_obj);
    }, {});

    if ($or.length > 0) {
      query = { ...{ $or: $or }, ...query };
    }
  }

  const options = {};

  let hash = hashString(JSON.stringify([_collection._name, query], replacer));
  const countCache = CountCaches[hash];

  if (countCache) {
    cursor = countCache.cursor;
    count = countCache.count;
  } else {
    cursor = _collection.find(query);
    count = cursor.count();

    CountCaches[hash] = {
      cursor: cursor,
      count: count,
      cacheAt: new Date()
    }
  }

  result.options.pagination.currentPage = 1;
  result.options.pagination.pageItems = count;
  result.options.pagination.totalCount = count;

  if (_options?.pagination) {
    const pageItems = _options.pagination.pageItems > 100 ? 100 : _options.pagination.pageItems;
    options.skip = (_options.pagination.currentPage - 1) * pageItems;
    options.limit = pageItems;
    const totalPages = Math.ceil(result.options.pagination.totalCount / pageItems)
    result.options.pagination.currentPage = _options.pagination.currentPage > totalPages ? 1 : _options.pagination.currentPage;
    result.options.pagination.pageItems = pageItems;
  } else {
    if (paginationLimit) {
      options.skip = 0;
      options.limit = 20;
      result.options.pagination.pageItems = 20;
    }
  }

  result.options.pagination.totalPages = Math.ceil(result.options.pagination.totalCount / result.options.pagination.pageItems);

  if (_options?.sorting) {
    options.sort = {};
    options.sort[_options.sorting.sortField] = _options.sorting.sortOrder === 'asc' ? 1 : -1;
    result.options.sorting = _options.sorting;
  }

  if (_options?.fields) {
    options.fields = _options.fields;
  }

  result[wrapperFieldName] = _collection.find(query, options).fetch();

  return result;
};