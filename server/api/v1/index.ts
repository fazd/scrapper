const router = require('express').Router();

const scrapper = require('./scrapper/routes');
const category = require('./categories/routes');
const historyPrice = require('./history-price/routes');
const product = require('./products/routes');


router.use('/scrapper', scrapper);
router.use('/category', category);
router.use('/product', product);
router.use('/history-price', historyPrice);


module.exports = router;
