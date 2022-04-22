import { CountCaches, reviver, replacer, deleteByPath, hashString } from './utils';

FetchByIndex = function (_collection, _query, _options, _index, wrapperFieldName = 'data', paginationLimit = true) {
  const result = {
    options: {
      pagination: {},
      sorting: {}
    }
  };

  result[wrapperFieldName] = [];

  let query = _query;
  let cursor = null;
  let keyword = null;
  let count = 0;

  if (_options?.filtering) {
    keyword = _options.filtering.keyword;

    const filterQuery = Object.keys(_options.filtering).reduce(function (obj, key) {
      if (key === 'keyword') {
        return obj;
      }

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

  const options = {
    props: {}
  };

  let hash = '';

  if (keyword && _index) {
    options.props.query = query;
    delete options.fields;

    hash = hashString(JSON.stringify([_index.config.name, keyword, options], replacer));
    const countCache = CountCaches[hash];

    if (countCache) {
      cursor = countCache.cursor;
      count = countCache.count;
    } else {
      cursor = _index.search(keyword, options);
      count = cursor.count();

      CountCaches[hash] = {
        cursor: cursor,
        count: count,
        cacheAt: new Date()
      }
    }
  } else {
    hash = hashString(JSON.stringify([_collection._name, query], replacer));
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

  if (!keyword && _options?.fields) {
    options.fields = _options.fields;
  }

  if (keyword && _index) {
    options.props.query = query;

    if (options.sort) {
      options.props.sort = options.sort;
      delete options.sort;
    }

    result[wrapperFieldName] = _index.search(keyword, options).fetch();

    if (_options?.fields) {
      Object.keys(_options.fields).forEach(key => {
        result[wrapperFieldName] = result[wrapperFieldName].map(field => {
          deleteByPath(field, key);
          return field;
        })
      });
    }

  } else {
    result[wrapperFieldName] = _collection.find(query, options).fetch();
  }

  return result;
}