const Router = require('koa-router');
const router = new Router();
const handlers = require('./handlers');

// router.get('/url',handlers.testGet)
// router.post('/submit',handlers.createNewShortUrl)// создание сокращенной ссылки в бд

// router.get('/:url',handlers.getFullUrlFromShort)



// var fs = require('fs')
// , util = require('util')
// const stream = require('stream')


router.get('/', async (ctx) => {
    ctx.body = '345345345'
});


router.post('/',handlers.saveFileDataToDb)
router.get('/files',handlers.getFilesList)
router.get('/info',handlers.getInfoList)
module.exports = router;