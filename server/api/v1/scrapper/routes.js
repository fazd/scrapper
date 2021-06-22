const router = require('express').Router();

const controller = require('./controller');

router.route('/categories').post(controller.scrapCategories);
router.route('/products').post(controller.scrapProducts);
router.route('/all').post(controller.scrapAllData);

module.exports = router;
