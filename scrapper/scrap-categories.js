const puppeteer = require('puppeteer');
const logger = require('../server/config/logger');

const getCategories = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  logger.info(`Url: ${url}`);
  await page.goto(url);
  // await page.goto("https://www.alkosto.com/");
  let urls = await page.evaluate(() => {
    let results = [];
    let items = document.querySelectorAll('div.subcategories--item--label');
    items.forEach((item) => {
      results.push({
        url: item.children[0].getAttribute('href'),
        text: item.children[0].getAttribute('Title'),
      });
    });
    return results;
  });

  await browser.close();
  return urls;
};

module.exports = {
  getCategories,
};
