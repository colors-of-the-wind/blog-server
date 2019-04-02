const mongoose = require('mongoose');

const dbPath = require('../config').mongoUrl;
const db = mongoose.connection;
const Schema = mongoose.Schema;

mongoose.connect(dbPath || 'mongodb://localhost/blog')

db.on('error', err => {
    console.error(err);
    process.exit(1);
});

module.exports = Schema;
