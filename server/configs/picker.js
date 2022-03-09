const bodyParser = require('body-parser');

Picker.middleware(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Origin');

  if(req.method === 'OPTIONS') {
    return res.end();
  }

  return next();
});

Picker.middleware(bodyParser.json({
  verify: function (req, res, buf) {
    req.rawBody = buf
  }
}));

Picker.middleware(bodyParser.urlencoded({ extended: true }));