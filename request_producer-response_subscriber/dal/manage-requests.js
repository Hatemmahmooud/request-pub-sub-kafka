var requestUtil = require("./utils/request-util");

module.exports = {
    addRequestToDatabase: function (url, type, correlationId, callback) {
        var requestToBeAdded = {
            url,
            correlationId,
            type,
            status: "pending",
            responseData: ""
        }
        requestUtil.create(requestToBeAdded, (err, result) => {
            return callback(err, result);
        });
    },
    getRequestStatus: function (correlationId, callback) {
        requestUtil.getById(correlationId, (err, result) => {
            return callback(err, result);
        })
    },
    updateRequestStatus: function (correlationId, callback) {
        requestUtil.update(correlationId, (err, result) => {
            return callback(err, result);
        })
    }

}