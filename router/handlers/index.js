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
function paserNumber(numStr, defaultVal) {
    let number = +numStr;
    return isNaN(number) ? defaultVal : number;
}


function getLimitOffsetFromQueryStr(query) {
    let { limit, offset } = query;
    limit = paserNumber(limit, 10);
    offset = paserNumber(offset, 0);
    return { limit, offset }
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
        /**
         * Замыкание на запись имени файла. 
         * 
         * @author teknik2008
         * @param {string} filesSql - шаблон sql
         * @param {object} filesInsertData - данный для шаблона
         * @returns {Promise} - промис, при первом вызове выполнит запись и вернет id, при следующих вызвах будет возвращать только id
         */
        function insertData(filesSql, filesInsertData) {
            let fileId = false
            async function insert() {
                try {
                    let state = await db.query(filesSql, { filesInsertData });
                    fileId = state.insertId
                    return fileId;
                } catch (e) {
                    reject(e);
                }
            }
            return async () => {
                let id=fileId==false?await insert():fileId;
                return id;
            }
        }
        let create = Math.ceil(Date.now() / 1000)
        let lines = 0;
        let filesInsertData = { name: filename, created_at: create }
        let filesSql = 'INSERT INTO files SET :filesInsertData';
        
        let toInsert=insertData(filesSql,filesInsertData);
        var stream = fs.createReadStream(filePath)
            .pipe(es.split())
            .pipe(es.mapSync(async function (line) {
                let re = /[A-z]/
                if ( /[A-z]/.test(line)|| !/[А-яЙй0-9]/.test(line)) {
                    return;
                }
                stream.pause();
                let fileId = await toInsert();
                let infoInsertData = { line: line, file: fileId };
                let infoSql = 'INSERT INTO info SET :infoInsertData';
                try {
                    await db.query(infoSql, { infoInsertData });
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
                    if(lines==0){
                        reject(); 
                    }else{
                        resolve(lines);
                    }
                    // resolve(lines);
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
    try {
        let lines = await saveFileToDb(path, name)
        ctx.body = {
            success: true,
            response: {
                lines
            }
        }
    } catch (e) {
        ctx.status = 400
        ctx.body = {
            success: false, error: {
                msg: 'Ошибка сохранения файла'
            }
        }
    }
    fs.unlink(path,(e)=>{
        console.error(e)
    })

}

/**
 * Обработчик выборки данных о файлах
 */
exports.getFilesList = async ctx => {
    let qs = ctx.getQuery();
    let query = qs.query || {};
    let { limit, offset } = getLimitOffsetFromQueryStr(query);
    let { count: isCont } = query;
    let sqlTemplate = `SELECT id,name,created_at FROM files ORDER BY created_at LIMIT :limit OFFSET :offset`;
    let dataSelect = { limit, offset };
    try {
        let response = {}
        response.files = await db.query(sqlTemplate, dataSelect);
        let count;
        if (isCont == 'true') {
            sqlTemplate = `SELECT count(id) as count FROM files`
            count = await db.query(sqlTemplate);
            response.count = count[0].count
        }
        ctx.resJson(response)

    } catch (e) {
        console.error(e)
        ctx.resJson(false, 'Ошибка')
    }
}
/**
 * Обработчик выборки данных о содержимом файла
 */
exports.getInfoList = async ctx => {
    let qs = ctx.getQuery();
    let { query = {} } = qs;
    let { limit, offset } = getLimitOffsetFromQueryStr(query);
    let { where = {}, count: isCont } = query;
    let { file: fileId = '' } = where;
    let sqlTemplate = `SELECT info.id as id,info.line as line,files.name as name,files.created_at as created_at 
    FROM info LEFT JOIN files ON info.file=files.id 
    ${fileId ? 'where files.id=:fileId' : ''}
    ORDER BY created_at LIMIT :limit OFFSET :offset`;
    let dataSelect = { fileId, limit, offset };
    try {
        let response = {}
        response.files = await db.query(sqlTemplate, dataSelect);
        let count;
        if (isCont == 'true') {
            sqlTemplate = `SELECT count(id) as count FROM info

            ${fileId ? 'where file=:fileId' : ''}`
            count = await db.query(sqlTemplate, dataSelect);
            response.count = count[0].count
        }
        ctx.resJson(response)
    } catch (e) {
        
        ctx.resJson(false, 'Ошибка')
    }
}