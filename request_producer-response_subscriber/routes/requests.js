var express = require("express");
var router = express.Router();
var requestsDal = require("../dal/manage-requests");


router.get("/get-request-status/:correlationId", (req, res, next) => {
    requestsDal.getRequestStatus(req.params.correlationId, (err, result) => {
        if (err) res.status(500).send(JSON.stringify(result));
        res.status(200).send(JSON.stringify(result));
    })
})

module.exports = router;