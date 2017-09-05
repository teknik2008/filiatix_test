'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports._meta = {
  "version": 1
};


/* Promise-based version */
exports.up = function (db) {
  return db.createTable('files', {
    id: { type: 'int', primaryKey: true, autoIncrement:true},
    name:{ type:'char',length:50,notNull :true},
    created_at:{type:'int',notNull :true}
  });
};

exports.down = function (db) {
  return db.dropTable('files');
};