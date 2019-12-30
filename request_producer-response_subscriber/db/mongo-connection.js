var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var config = require("../config");
mongoose.set("useCreateIndex", true);

var mongoConnection;
var retries = 0;

function connectionWithRetry(callback) {
    if (mongoConnection) return callback(false, mongoConnection);

    mongoose
        .createConnection(config.mongoHost, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(connection => {
            mongoConnection = connection;
            return connectionWithRetry(callback);
        })
        .catch(err => {
            if (err.name === "MongoTimeoutError") { // Catch if mongo service is down
                setTimeout(() => {
                    if (retries > config.mongoConnectionMaxRetries) { // Failed to connect to mongo after several retries.
                        return callback(err, null); // Stop retrying
                    }
                    retries++;
                    console.log(err);
                    console.log("Error while connecting to database , Retrying again");
                    connectionWithRetry(callback);
                }, config.mongoReconnectInterval);
            }
            else {
                console.log(err);
                return callback(err, null);
            }

        });
}



module.exports = {
    connectToMongo: callback => {
        connectionWithRetry((err, conn) => {
            return callback(err, conn);
        });
    }
};