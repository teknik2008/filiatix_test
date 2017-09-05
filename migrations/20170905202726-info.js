'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports._meta = {
  "version": 1
};


/* Promise-based version */
exports.up = function (db) {
  return db.createTable('info', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    line: { type: 'text', notNull: true },
    file: {
      type: 'int',
      notNull: true,
      foreignKey:{
        name:'info_files_fk',
        table: 'files',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
  });
};

exports.down = function (db) {
  return db.dropTable('info')
};
