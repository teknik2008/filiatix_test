const Router = require('koa-router');
const router = new Router();
const handlers = require('./handlers');

// router.get('/url',handlers.testGet)
// router.post('/submit',handlers.createNewShortUrl)// создание сокращенной ссылки в бд

// router.get('/:url',handlers.getFullUrlFromShort)



// var fs = require('fs')
// , util = require('util')
const stream = require('stream')
const fs = require('fs')
const es = require('event-stream');



function saveFileToDb(filePath) {
    return new Promise((resolve, reject) => {
        var s = fs.createReadStream(filePath)
            .pipe(es.split())
            .pipe(es.mapSync(async function (line) {

                s.pause();
                console.log('--------' + line)

                // resume the readstream, possibly from a callback
                setTimeout(s.resume, 100);
            })
                .on('error', function (err) {
                    console.log('Error while reading file.', err);
                    reject();
                })
                .on('end', function () {
                    console.log('Read entire file.')
                    resolve();
                })
            );
    })
}


router.get('/', async (ctx) => {
    ctx.body = '345345345'
})





router.post('/', async (ctx) => {
    // let form = ctx.request.body;
    let file = ctx.request.body.files.fileToUpload;
    let path=file.path;
    await saveFileToDb(path)
    console.log(path)
    // console.log(typeof file)

    ctx.body = 'file'
})
module.exports = router;