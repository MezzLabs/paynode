var qs = require('querystring'),
    crypto = require('crypto'),
    sys = require('sys'),
    https_module = require('https')
    
function GatewayClient(opts, authInfo){
  verifyRequiredArguments(opts);
  var https = https_module;
  var options = {
      host: opts.host,
      port: 443,
      method: 'POST',
      headers: {
        'Host': opts.host,
        'Content-Type': opts.contentType
      }
  }
  if (authInfo) {
      options.cert = authInfo.cert
      options.key = authInfo.key
  }
    
  this.request = function(request, callback){
    var requestString = qs.stringify(request)
    options.headers['Content-Length'] = requestString.length
    var req = https.request(options, function(res){
      res.on('data', function(data){
        callback(opts.responseParser.parseResponse(request, data.toString()))
      })
    })
    req.end(requestString)
  }
}

exports.GatewayClient = GatewayClient

function verifyRequiredArguments(opts){
  var required = ['host', 'path', 'contentType', 'responseParser']
  if(!opts) throw new Error("Required fields missing. Need an option containing configuration details.")
  var missingFields = required.filter(function(s){ return !(s in opts) || !opts[s]})
  if(missingFields.length > 0){
    throw new Error("GatewayClient ctor is missing required fields " + missingFields.join(','))
  }
}

