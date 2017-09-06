const Router = require('koa-router');
const router = new Router();
const handlers = require('./handlers');

router.post('/',handlers.saveFileDataToDb)
router.get('/files',handlers.getFilesList)
router.get('/info',handlers.getInfoList)
module.exports = router;