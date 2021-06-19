const router = require('express').Router();

const controller = require('./controller');

router.route('/categories').post(controller.scrapCategories);
router.route('/products').post(controller.scrapProducts);

module.exports = router;
