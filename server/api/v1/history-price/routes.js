const router = require('express').Router({
  mergeParams: true,
});
const controller = require('./controller');

router.param('id', controller.id);

router.route('/').post(controller.parentId, controller.all);

router.route('/avg').post(controller.parentId, controller.getAvg);

router.route('/create').post(controller.parentId, controller.create);

router
  .route('/:id')
  .get(controller.id, controller.parentId, controller.read)
  .put(controller.id, controller.parentId, controller.update)
  .delete(controller.id, controller.parentId, controller.delete);

module.exports = router;
