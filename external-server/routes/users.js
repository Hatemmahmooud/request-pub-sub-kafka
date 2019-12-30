var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/get-user-details/:id', function (req, res, next) {
  setTimeout(() => {
    res.status(200).send(JSON.stringify({
      name: "Ahmed",
      type: "I am a user",
      id: "1234556"
    }));
  }, 12000);
});

module.exports = router;
