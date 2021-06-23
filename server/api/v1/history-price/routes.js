const router = require('express').Router({
  mergeParams: true,
});
const controller = require('./controller');

router.param('id', controller.id);

router.route('/')
  .get(controller.parentId, controller.all)
  .post(controller.parentId, controller.create);


router.route('/:id')
  .get(controller.id, controller.parentId, controller.read)
  .put(controller.id, controller.parentId, controller.update)
  .delete(controller.id, controller.parentId, controller.delete)


module.exports = router;
