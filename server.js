
const commandLineArgs = require('command-line-args')
var restify = require('restify');
var cluster = require('cluster');


const optionDefinitions = [
  { name: 'port', alias: 'p', type: Number },
  { name: 'clustering', alias: 'e', type: Boolean },
  { name: 'cpu', alias: 'c', type: Number }
]

const options = commandLineArgs(optionDefinitions)
console.log(options)

var CLUSTERING = options.clustering || false
var PORT= options.port || 3001
var CPU= options.cpu || require('os').cpus().length

console.log('CLUSTERING: '+ (CLUSTERING ? 'ENABLED' : 'DISABLED') )
// Code to run if we're in the master process
var reqNum = 0;

if (CLUSTERING && cluster.isMaster) {

    console.log('CPU USED: '+ CPU)
    for (var i = 0; i < CPU; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {

    function respond(req, res, next) {
        console.log('reqNum ',reqNum);
        reqNum++;
      res.send('hello ');
      next();
    }

    var server = restify.createServer();
    server.get('/', respond);
    server.head('/', respond);

    server.listen(PORT, function() {
      console.log('%s listening at %s', server.name, server.url);
    });

}
