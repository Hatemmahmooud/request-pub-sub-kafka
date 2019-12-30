var express = require('express');
var router = express.Router();
var uuidV4 = require("uuid/v4");
var pushRequestToKafka = require("../request-producer");
var requestDal = require("../dal/manage-requests");


/* GET user by id. */
router.get('/get-user-details/:id', function (req, res, next) {
  var uuid = uuidV4();
  requestDal.addRequestToDatabase(req.originalUrl, req.method, uuid, (err, result) => {
    if (err) {
      res.status(500).send(JSON.stringify({
        error: "Internal server error, please try again later"
      }));
      return;
    }
    res.status(200).send(JSON.stringify({
      correlationId: uuid
    }));
    var requestPayLoad = {
      url: req.originalUrl,
      type: req.method,
      correlationId: uuid
    }
    pushRequestToKafka(requestPayLoad, (result => {
      console.log(result);
    }));
  });
});

module.exports = router;
