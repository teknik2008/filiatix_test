const fs = require('fs')
const es = require('event-stream');
const db = require("libs/db")
/**
 * Поиск числа из строки, вер
 * 
 * @author teknik2008
 * @param {string} numStr - строка похожая на число
 * @param {number} defaultVal - число по улочанию, в случае если нет валиной строки
 * @returns {number} 
 */
function paserNumber(numStr,defaultVal){
    let number=+numStr;
    return isNaN(number)?defaultVal:number;
}


function getLimitOffsetFromQueryStr(query){
    let {limit,offset}=query;
    limit=paserNumber(limit,10);
    offset=paserNumber(offset,0);
    return {limit,offset}
}

/**
 * Построчное чтение файла и запись в бд
 * 
 * @author teknik2008
 * @param {string} filePath - путь к файлу в бд 
 * @param {string} filename - имя файла
 * @returns 
 */
function saveFileToDb(filePath, filename) {
    return new Promise(async (resolve, reject) => {
        let create = Math.ceil(Date.now() / 1000)
        let lines = 0;
        let filesInsertData = { name: filename, created_at: create }
        let filesSql = 'INSERT INTO files SET ?';
        let fileId = false;
        try {
            let state = await db.query(filesSql, filesInsertData);
            fileId = state.insertId
        } catch (e) {
            reject(e);
        }
        var stream = fs.createReadStream(filePath)
            .pipe(es.split())
            .pipe(es.mapSync(async function (line) {
                let re = /[A-z]/
                if (re.test(line)) {
                    return;
                }
                stream.pause();
                let infoInsertData = { line: line, file: fileId };
                let infoSql = 'INSERT INTO info SET ?';
                try {
                    await db.query(infoSql, infoInsertData);
                } catch (e) {
                    reject(e);
                }
                lines++;
                stream.resume()
            })
                .on('error', function (err) {
                    reject();
                })
                .on('end', function () {
                    resolve(lines);
                })
            );
    })
}
/**
 * Обработчик сохранения данных из файла в бд
 */
exports.saveFileDataToDb = async (ctx) => {
    if (!('files' in ctx.request.body) &&
        !('fileToUpload' in ctx.request.body.files)) {
        ctx.status = 400
        ctx.body = {
            success: false, error: {
                msg: 'Файл не найден'
            }
        }
    }
    let file = ctx.request.body.files.fileToUpload;
    let path = file.path;
    let name = file.name;
    try{
        let lines=await saveFileToDb(path, name)

    }catch(e){
        ctx.status = 400
        ctx.body = {
            success: false, error: {
                msg: 'Ошибка сохранения файла'
            }
        }
    }
    console.log(lines)
    // db.
    // console.log(typeof file)

    ctx.body = 'file'
}


exports.getFilesList = async ctx=>{
    let qs=ctx.getQuery();
    let query=qs.query||{};
    let {limit,offset}=getLimitOffsetFromQueryStr(query);
    let sqlTemplate='SELECT id,name,created_at FROM files ORDER BY created_at LIMIT ? OFFSET ?';
    let dataSelect=[limit,offset];
    let result = await db.query(sqlTemplate,dataSelect);
    ctx.body=result
}

exports.getInfoList = async ctx=>{
    let qs=ctx.getQuery();
    let {query={}}=qs;
    let {limit,offset}=getLimitOffsetFromQueryStr(query);
    let {where={}}=query;
    let {file:fileId=''}=where;
    let sqlTemplate=`SELECT info.id as id,info.line as line,files.name as name,files.created_at as created_at 
    FROM info LEFT JOIN files ON info.file=files.id 
    ${fileId?'where files.id=:fileId':''}
    ORDER BY created_at LIMIT :limit OFFSET :offset`;
    let dataSelect={fileId,limit,offset};
    let result = await db.query(sqlTemplate,dataSelect);
    ctx.body=result
}