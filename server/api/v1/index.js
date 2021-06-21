const router = require('express').Router();

const scrapper = require('./scrapper/routes');
const category = require('./categories/routes');

router.use('/scrapper', scrapper);
router.use('/category', category);

module.exports = router;
