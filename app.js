const express = require("express");
const cluster = require("cluster");
const os = require("os");
const app = express();

const numCpu = os.cpus().length;

app.get("/", (req, res) => {
  for (let i = 0; i < 1e8; i++) {
    // some long running task
  }
  res.send(`Hello :) ${process.pid}`);
  cluster.worker.kill()
});

if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} kill`);
      cluster.fork()
  })
} else {
  app.listen(9000, () => console.log(`Server ${process.pid} on port 9000`));
}

// app.listen(9000, () => console.log('Running on port 9000'))
