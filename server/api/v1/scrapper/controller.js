const { getCategories } = require('../../../../scrapper/scrap-categories');
const { getProducts } = require('../../../../scrapper/scrap-products');

exports.scrapCategories = async (req, res, next) => {
  const { body = {} } = req;
  const { url } = body;
  const data = await getCategories(url);
  res.send({
    success: true,
    data,
  });
};

exports.scrapProducts = async (req, res, next) => {
  const { body = {} } = req;
  const { url, categorie } = body;
  const data = await getProducts(url, categorie);
  res.send({
    success: true,
    data,
    meta: {
      length: data.length,
    },
  });
};
