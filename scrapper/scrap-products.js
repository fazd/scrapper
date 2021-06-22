const puppeteer = require('puppeteer');
const logger = require('../server/config/logger');
const { scrapper } = require('../server/config');

const { pageSize, sortValue } = scrapper;

const getProducts = async (base, _url) => {
  let url;
  if (_url.startsWith('https://') || _url.startsWith('http://')) {
    url = _url;
  } else {
    url = base + _url;
  }
  logger.info(`Url: ${url}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  page.setDefaultNavigationTimeout(100000);

  let total = await page.evaluate(() => {
    const data = document.querySelector('span.js-search-count');
    const res = data?.getAttribute('data-count');
    return res;
  });
  total = total ? total : 0;
  logger.info(`Total products in this category: ${total}\n`);
  let evaluated = 0;
  let paging = 1;
  let totalProducts = [];
  while (evaluated < total) {
    evaluated += pageSize;
    const params = `?page=${paging}&pageSize=${pageSize}&sort=${sortValue}`;
    const newUrl = url + params;
    const newPage = await browser.newPage();
    await newPage.goto(newUrl);
    newPage.setDefaultNavigationTimeout(100000);

    let products = await newPage.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll('.product__list--item');
      for (let element of items) {
        let elementChildren = element.children;
        if (elementChildren[0] && elementChildren[2]) {
          const imageUrl = elementChildren[0]
            ?.querySelectorAll('.js-product-click-datalayer')[2]
            ?.children[0]?.getAttribute('data-src');

          const imageElement = elementChildren[0]?.children[0];
          const productUrl = imageElement?.getAttribute('href');
          const productTitle = imageElement?.getAttribute('title');

          let price = elementChildren[2]?.querySelector('.price')?.innerText;
          price = price.substr(1);
          price = price.replaceAll('.', '');
          price = parseInt(price);
          results.push({
            productTitle,
            productUrl,
            imageUrl,
            price,
          });
        }
      }
      return results;
    });
    await newPage.close();
    totalProducts = [...totalProducts, ...products];
    logger.info(`Page: ${paging} completed\n`);
    paging++;
  }
  await browser.close();

  return totalProducts;
};

module.exports = {
  getProducts,
};
