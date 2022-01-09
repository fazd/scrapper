const router = require('express').Router();

const controller = require('./controller');

router.param('id', controller.id);

router.route('/').post(controller.create).get(controller.all);


router.route('/delete').post(controller.remove);

router
  .route('/:id')
  .put(controller.update)
  .delete(controller.delete)
  .get(controller.read);

module.exports = router;
