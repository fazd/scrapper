const router = require('express').Router();

const scrapper = require('./scrapper/routes');

router.use('/scrapper', scrapper);

module.exports = router;
