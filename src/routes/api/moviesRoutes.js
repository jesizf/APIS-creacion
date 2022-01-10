const express = require('express');
const router = express.Router();
const {list,detail, create} = require('../../controllers/api/moviesController');

router.get('/', list)
        .get('/:id',detail)
        .post('/', create);


module.exports = router;