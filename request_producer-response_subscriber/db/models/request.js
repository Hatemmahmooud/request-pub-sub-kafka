var connectToMongo = require("../mongo-connection").connectToMongo;
var Schema = require("mongoose").Schema;

// Create the request schema
let requestSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true

    },
    correlationId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    responseData: {
        type: String
    }

});

bindModel = (callback) => {
    connectToMongo((err, mongoose) => {
        if (err)
            return callback(true, err);
        requestModel = mongoose.model('request', requestSchema);
        return callback(false, requestModel);
    })
};


module.exports = bindModel;