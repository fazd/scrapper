const router = require('express').Router();

const controller = require('./controller');
const historyPriceController = require('../history-price/controller');

router.param('id', controller.id);

router.route('/').post(controller.create).get(controller.all);

router.use('/:productId/prices', historyPriceController);


router
  .route('/:id')
  .put(controller.update)
  .delete(controller.delete)
  .get(controller.read);

module.exports = router;
