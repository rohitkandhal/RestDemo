var MongoClient = require('mongodb').MongoClient;

var appDB = null;   // Reusable database connection once connected

function DbHelper() { }

// Add static methods so that other files can use like db.connect()
DbHelper.connect = function (url, done) {
    // Connect to existing db connection if exists
    if (appDB) {
        return done();
    }
  
    // Create a new db connection
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return done(err);
        }

        appDB = db;
        done();
    });
}

DbHelper.get = function () {
    return appDB;
}

DbHelper.close = function (done) {
    // close any existing db connection
    if (appDB) {
        appDB.close(function (err, result) {
            appDB = null;

            done(err);
        });
    }
}

module.exports = DbHelper;