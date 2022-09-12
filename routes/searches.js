const { Router } = require('express');
const { check } = require('express-validator');

const { search } = require('../controllers/searches');


const router = Router();

router.get('/:collection/:term', search);



module.exports = router;