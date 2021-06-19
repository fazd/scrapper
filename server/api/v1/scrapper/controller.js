const { getCategories } = require('../../../../scrapper/scrap-categories');

exports.scrapCategories = async (req, res, next) => {
  const { body = {} } = req;
  const { url } = body;
  const data = await getCategories(url);
  res.send({
    success: true,
    data,
  });
};
