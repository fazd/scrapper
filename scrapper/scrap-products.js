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
  const total = await page.evaluate(() => {
    const data = document.querySelector('span.js-search-count');
    const res = data.getAttribute('data-count');
    return res;
  });
  console.log(total);
  let evaluated = 0;
  let paging = 1;
  let totalProducts = [];
  while (evaluated < total) {
    evaluated += pageSize;
    const params = `?page=${paging}&pageSize=${pageSize}&sort=${sortValue}`;
    const newUrl = url + params;
    const newPage = await browser.newPage();
    await newPage.goto(newUrl);
    let products = await newPage.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll('.product__list--item');
      for (let element of items) {
        let elementChildren = element.children;
        if (elementChildren[0] && elementChildren[2]) {
          const imageUrl = elementChildren[0]
            ?.querySelectorAll('.js-product-click-datalayer')[2]
            ?.children[0].getAttribute('data-src');

          const imageElement = elementChildren[0].children[0];
          const productUrl = imageElement.getAttribute('href');
          const productTitle = imageElement.getAttribute('title');

          const price = elementChildren[2].querySelector('.price').innerText;

          results.push({
            productTitle,
            productUrl,
            imageUrl,
            price,
          });
        }
      }
      return results;

      // items.forEach((element) => {
      //   let elementChildren = element.children;
      //   if (elementChildren[0]) {
      //     const imageElement = elementChildren[0].children[0];
      //     const productUrl = imageElement.getAttribute('href');
      //     const productTitle = imageElement.getAttribute('href');
      //     results.push({
      //       productTitle,
      //       productUrl,
      //     });
      //   }
      // });
      // return results;
    });
    await newPage.close();
    paging++;
    console.log('PRODUCTS', products);
    totalProducts = [...totalProducts, ...products];
  }

  // let urls = await page.evaluate(() => {
  //   let results = [];
  //   let items = document.querySelectorAll('div.subcategories--item--label');
  //   items.forEach((item) => {
  //     results.push({
  //       url: item.children[0].getAttribute('href'),
  //       text: item.children[0].getAttribute('Title'),
  //     });
  //   });
  //   return results;
  // });

  await browser.close();
  // urls.forEach((el) => {
  //   console.log(`${el.text} : ${el.url}\n`);
  // });
  // console.log('length', urls.length);
  // return urls;
  return totalProducts;
};

module.exports = {
  getProducts,
};
