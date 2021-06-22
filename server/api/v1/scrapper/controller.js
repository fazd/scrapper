const { getCategories } = require('../../../../scrapper/scrap-categories');
const { getProducts } = require('../../../../scrapper/scrap-products');
const { saveCategories } = require('../categories/controller');
const { saveProducts } = require('../products/controller');
const { Model } = require('../categories/model');
// const { Model: Product } = require('../products/model');
const logger = require('../../../config/logger');
const { paginationParseParams, sortCompactToStr } = require('../../../utils');

exports.scrapCategories = async (req, res, next) => {
  const { body = {} } = req;
  const { url } = body;
  const data = await getCategories(url);
  await saveCategories(data, url);
  res.send({
    success: true,
    data,
  });
};

exports.scrapProducts = async (req, res, next) => {
  const { body = {} } = req;
  const { url, categorie } = body;
  const data = await getProducts(url, categorie);
  await saveProducts(data, url);
  res.send({
    success: true,
    data,
    meta: {
      length: data.length,
    },
  });
};


exports.scrapAllData = async (req, res, next) => {
  const { body = {} } = req;
  const { url = 'https://alkosto.com' } = body;
  logger.info('Starting Scrap of all data....');
  logger.info(`Step 1. Scrap categories []`);
  try {
    const data = await getCategories(url);
    await saveCategories(data, url);
    logger.info(`Step 1. Scrap categories [OK]`);
  } catch (error) {
    logger.info(`Step 1. Scrap categories [Failed]`);
    next(new Error(error));
  }
  logger.info(`Step 2. Get all categories from the database []`);

  try {
    const totalDocs = await Model.countDocuments().exec();
    const defaultLimit = 100;
    const pages = Math.ceil(totalDocs / defaultLimit);
    let page = 1;
    logger.info(`Step 2.0 There are ${pages} pages in the database...`);
    do {
      logger.info(`Step 2.${page} Processing page: ${page} []`);
      const { limit, skip } = paginationParseParams({ page, limit: defaultLimit })

      const docData = await Model.find({})
        .sort(sortCompactToStr())
        .skip(skip)
        .limit(limit)
        .exec();

      for await (let doc of docData) {
        //console.log("docData:", doc.name);
        logger.info(`Processing Category: ${doc.name} []`);
        const products = await getProducts(url, doc.link);
        await saveProducts(products, url);
        logger.info(`Processing Category: ${doc.name} [OK]`);
      }
      logger.info(`Step 2.${page} Processing page: ${page} [OK]`);
      page++;
    } while (pages >= page);
    logger.info(`Step 2. All prices are stored [OK]`);

    res.send({ success: true });
  } catch (error) {
    logger.info(`Step 2. Get all categories from the database [Failed]`);
    next(new Error(error));
  }





}
