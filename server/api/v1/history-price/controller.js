const { Model, fields, references } = require('./model');
const dayjs = require('dayjs');
const {
  paginationParseParams,
  sortParseParams,
  sortCompactToStr,
  populateToObject,
} = require('../../../utils');
const { Model: Product } = require('../products/model');


const referencesNames = Object.getOwnPropertyNames(references);

exports.id = async (req, res, next, id) => {
  const populate = referencesNames.join(' ');

  try {
    const doc = await Model.findById(id).populate(populate).exec();
    if (!doc) {
      const message = `${Model.modelName} not found`;
      next({
        message,
        statusCode: 404,
        level: 'warn',
      });
    } else {
      req.doc = doc;
      next();
    }
  } catch (error) {
    next(new Error(error));
  }
};

exports.parentId = async (req, res, next) => {
  const populate = referencesNames.join(' ');
  const { productUrl } = req.body;
  console.log("Llega", productUrl);
  try {
    const doc = await Product.findOne({ link: productUrl }).populate(populate).exec();
    if (!doc) {
      const message = `${Model.modelName} not found`;
      next({
        message,
        statusCode: 404,
        level: 'warn'
      });
    } else {
      req.doc = doc;
      next();
    }
  } catch (error) {
    next(new Error(error));
  }
};

exports.create = async (req, res, next) => {
  const { body = {}, decoded = {} } = req;
  const document = new Model(body);

  try {
    const doc = await document.save();
    res.status(201);
    res.json({
      sucess: true,
      data: doc,
    });
  } catch (error) {
    next(new Error(error));
  }
};


exports.createRecord = async (data) => {
  if (!data.date) {
    data.date = dayjs(Date.now());
  }
  const document = new Model(data);

  try {
    const doc = await document.save();
    return doc;
  } catch (error) {
    console.log(error);
  }
};


exports.all = async (req, res, next) => {
  const { query, params = {}, doc = {} } = req;

  const { limit, page, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);
  const populate = populateToObject(referencesNames,);
  const { id } = doc;
  const filter = {}
  if (id) {
    filter.productId = id;
  }
  const all = Model.find(filter)
    .sort(sortCompactToStr(sortBy, direction))
    .skip(skip)
    .limit(limit)
  const count = Model.countDocuments(filter);

  try {
    const data = await Promise.all([all.exec(), count.exec()]);
    const [docs, total] = data;
    const pages = Math.ceil(total / limit);
    res.json({
      sucess: true,
      data: docs,
      product: doc,
      meta: {
        limit,
        skip,
        total,
        page,
        pages,
        sortBy,
        direction,
      },
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.read = async (req, res, next) => {
  const { doc = {} } = req;

  res.json({
    sucess: true,
    data: doc,
  });
};


exports.update = async (req, res, next) => {
  const { doc = {}, body = {} } = req;

  Object.assign(doc, body);

  try {
    const updated = await doc.save();
    res.json({
      sucess: true,
      data: updated,
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.delete = async (req, res, next) => {
  const { doc = {} } = req;

  try {
    const removed = await doc.remove();
    res.json({
      sucess: true,
      data: removed,
    });
  } catch (error) {
    next(new Error(error));
  }
};
