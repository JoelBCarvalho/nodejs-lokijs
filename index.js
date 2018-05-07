var fs = require('fs');
var dotenv = require('dotenv');
var env = process.env.NODE_ENV || 'development';
var logDir = process.env.LOG_DIR || 'logs';
var fileDir = process.env.FILE_DIR || 'files';
var dbDir = process.env.DB_DIR || 'db';

if (env === 'development') {
  if (fs.existsSync('.env')) dotenv.load();
}

if (!fs.existsSync(logDir)){
  fs.mkdirSync(logDir);
}

if (!fs.existsSync(fileDir)){
  fs.mkdirSync(fileDir);
}

if (!fs.existsSync(dbDir)){
  fs.mkdirSync(dbDir);
}

var app = require('./src');

app();
