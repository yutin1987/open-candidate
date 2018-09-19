"use strict";

require("babel-polyfill");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _next = _interopRequireDefault(require("next"));

var _glob = _interopRequireDefault(require("glob"));

var _helmet = _interopRequireDefault(require("helmet"));

var _compression = _interopRequireDefault(require("compression"));

var _sync = _interopRequireDefault(require("csv-parse/lib/sync"));

var _graphqlTower = require("graphql-tower");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.NODE_PORT || process.env.PORT || 8080;

_momentTimezone.default.tz.setDefault('Asia/Taipei');

var dev = process.env.NODE_ENV !== 'production';
var app = (0, _next.default)({
  dev: dev,
  dir: './web/',
  conf: {
    poweredByHeader: false
  }
});
var handle = app.getRequestHandler();
var player = new Map();
app.prepare().then(function () {
  var server = express();
  server.get('*', function (req, res) {
    return handle(req, res);
  });
  server.listen(port, function (err) {
    if (err) throw err;
    console.log("> Ready on http://localhost:".concat(PORT));
  });
});