var request = require("request");
var config = require("../config");
function callExternalService(requestPayload, callback) {
    var requestToBeSent = buildRequest(requestPayload);
    request[`${requestPayload.type.toLowerCase()}`](requestToBeSent, (err, res, body) => {
        if (err)
            return callback(err, null);
        return callback(err, body);
    });

}

function buildRequest(requestPayload) {
    return config.externalServiceHost + requestPayload.url;

}

module.exports = callExternalService;