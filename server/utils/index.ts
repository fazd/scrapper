const config = require('../config');

const { pagination, sort, populate } = config;

const paginationParseParams = ({
  limit = pagination.limit,
  page = pagination.page,
  skip = pagination.skip,
}) => ({
  limit: parseInt(limit, 10),
  page: parseInt(page, 10),
  skip: skip ? parseInt(skip, 10) : (page - 1) * limit,
});

const sortParseParams = (
  { sortBy = sort.sortBy.default, direction = sort.direction.default },
  fields
) => {
  const safeList = {
    sortBy: [...Object.getOwnPropertyNames(fields), ...sort.sortBy.fields],
    direction: sort.direction.options,
  };
  return {
    sortBy: safeList.sortBy.includes(sortBy) ? sortBy : sort.sortBy.default,
    direction: safeList.direction.includes(direction)
      ? direction
      : sort.direction.default,
  };
};

const sortCompactToStr = (sortBy, direction) => {
  const dir = direction === sort.direction.default ? '-' : '';
  return `${dir}${sortBy}`;
};

const filterByNested = (params, referencesNames) => {
  const paramNames = Object.getOwnPropertyNames(params);
  const populateNames = referencesNames.filter(
    (item) => !paramsNames.includes(item)
  );
  return {
    filters: params,
    populate: populateNames.join(' '),
  };
};

const populateToObject = (populateNames, virtuals = {}) => {
  const virtualsNames = Object.getOwnPropertyNames(virtuals);
  return populateNames.map((item) => {
    let options = {};
    if (virtualsNames.includes(item)) {
      options = {
        limit: populate.virtuals.limit,
        sort: sortCompactToStr(
          populate.virtuals.sort,
          populate.virtuals.direction
        ),
      };
    }
    return {
      path: item,
      options,
    };
  });
};

const normalizeUrl = (url) => {
  let normalize = '';
  if (url.startsWith('https://www.')) {
    normalize = url;
  } else if (url.startsWith('http://www.')) {
    normalize = 'https' + url.substr(4);
  } else if (url.startsWith('https://')) {
    normalize = 'https://www.' + url.substr(8);
  } else if (url.startsWith('http://')) {
    normalize = 'https://www.' + url.substr(7);
  } else {
    normalize = 'https://www.' + url;
  }
  return normalize;
}


const parseUrl = (url, baseUrl) => {
  let result = '';
  if (url) {
    if (url.startsWith('https://') || url.startsWith('http')) {
      result = url;
    }
    result = baseUrl + url;
  }
  result = normalizeUrl(result);
  return result;
};

module.exports = {
  paginationParseParams,
  sortParseParams,
  sortCompactToStr,
  filterByNested,
  populateToObject,
  parseUrl,
};
