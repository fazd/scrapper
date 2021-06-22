const { Model, fields } = require('./model');
const { Model: HistoryPrice } = require('../history-price/model');
const { paginationParseParams, parseUrl } = require('../../../utils');
const { sortParseParams, sortCompactToStr } = require('../../../utils');
const { filterByNested } = require('../../../utils');
const logger = require('../../../config/logger');
const { createRecord } = require('../history-price/controller');

exports.id = async (req, res, next, id) => {
  try {
    const doc = await (await Model.findById(id)).exec();
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

exports.create = async (req, res, next) => {
  const { body = {} } = req;
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

exports.all = async (req, res, next) => {
  const { query = {}, params = {} } = req;
  const { limit, page, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);
  const { filters, populate } = filterByNested(params, []);
  const all = Model.find(filters)
    .sort(sortCompactToStr(sortBy, direction))
    .skip(skip)
    .limit(limit)
    .populate(populate);
  const count = Model.countDocuments(filters);

  try {
    const data = await Promise.all([all.exec(), count.exec()]);
    const [docs, total] = data;
    const pages = Math.ceil(total / limit);
    res.json({
      sucess: true,
      data: docs,
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

exports.saveProducts = async (data, baseUrl) => {
  let idx = 1;
  for (let pr of data) {
    const parsedUrl = parseUrl(pr.productUrl, baseUrl);

    const doc = {
      name: pr.productTitle,
      link: parsedUrl,
      imageUrl: parseUrl(pr.imageUrl, baseUrl),
    };
    const document = await Model.findOne({ link: parsedUrl });
    if (document) {
      logger.info(`${idx}. Document found: ${pr.productTitle}`);
      const record = await createRecord({
        productId: document.id,
        price: pr.price
      });
      logger.info(`${idx}. Record created: ${pr.productTitle} : ${record.price}`);

    } else {
      const product = new Model(doc);
      const saveProduct = await product.save();
      const record = await createRecord({
        productId: saveProduct.id,
        price: pr.price,
      });
      logger.info(`${idx}. Record created: ${pr.productTitle} : ${record.price}`);

      logger.info(`${idx}. Document created: ${pr.productTitle}`);
    }
    idx++;
  }
};
