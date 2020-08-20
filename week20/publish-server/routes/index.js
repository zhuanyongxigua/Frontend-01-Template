var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.post('/wtf', function(req, res, next) {
  console.log('wtf');
  fs.writeFileSync('../server/public/' + req.query.filename, req.body.content);
  res.send('');
  // res.render('index', { title: 'Express' });
});

module.exports = router;
