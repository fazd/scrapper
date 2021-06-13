const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.alkosto.com';

const getCategories = async () => {
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

async function main() {
  let categories = await getCategories();
  categories = categories.map((cat) => {
    if (cat.url.startsWith('/')) {
      return {
        text: cat.text,
        url: url + cat.url,
      }
    }
    return cat;
  });
  const file = fs.createWriteStream('data.txt');
  file.on('error', function (err) { /* error handling */ });
  categories.forEach(function (v) { file.write(`${v.text} : ${v.url} \n`) });
  file.end();

}

main();