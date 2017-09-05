var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');

var lineNr = 0;

var s = fs.createReadStream('test.txt')
    .pipe(es.split())
    .pipe(es.mapSync(async function (line) {

        // pause the readstream
        s.pause();

        lineNr += 1;
        // https://github.com/teknik2008/filiatix_test.git
        // process line here and call s.resume() when rdy
        // function below was for logging memory usage
        // logMemoryUsage(lineNr);
        console.log('--------' + line)

        // resume the readstream, possibly from a callback
        setTimeout(s.resume, 1000);
    })
        .on('error', function (err) {
            console.log('Error while reading file.', err);
        })
        .on('end', function () {
            console.log('Read entire file.')
        })
    );