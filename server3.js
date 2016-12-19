const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
var crypto = require('crypto');
var sleep = require('sleep');

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < (numCPUs); i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
      var randSleep = Math.round(10000 + (Math.random() * 10000));
    sleep.usleep(randSleep);

    var numChars = Math.round(5000 + (Math.random() * 5000));
    var randChars = crypto.randomBytes(numChars).toString('hex');

    res.writeHead(200);
    res.end(randChars);
  }).listen(3000);
}
