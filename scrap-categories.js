const puppeteer = require('puppeteer');
const fs = require('fs');


const getCategories = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.goto("https://www.alkosto.com/");
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
  })

  await browser.close();
  urls.forEach((el) => {
    console.log(`${el.text} : ${el.url}\n`)
  }
  )
  console.log("length", urls.length);
  return urls;
}

module.exports = {
  getCategories,
};