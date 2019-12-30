var bindModel = require("../../db/models/request");

module.exports = {
    create: function (request, callback) {
        bindModel(async (err, requestModel) => {
            if (err)
                return callback(true, err);
            var addedRequest = requestModel(request);
            let result = await addedRequest.save({});
            if (!result)
                return callback(true, "Couldn't insert into database");
            return callback(false, addedRequest);
        })
    },
    getById: function (correlationId, callback) {
        bindModel(async (err, requestModel) => {
            if (err)
                return callback(true, err);
            let result = await requestModel.findOne({
                correlationId
            }, {
                _id: 0,
                status: 1,
                responseData: 1
            });
            return callback(false, result ? result.toObject() : {});
        })
    },
    update: function (request, callback) {
        bindModel(async (err, requestModel) => {
            if (err)
                return callback(true, err);
            const filter = { correlationId: request.correlationId };

            let doc = await requestModel.findOneAndUpdate(filter, request, { new: true, useFindAndModify: false });
            return callback(false, doc);
        })
    }
}