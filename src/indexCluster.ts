import http from 'http';
import cluster, { Worker } from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import { router } from './router/router';
import { HelpController } from './controllers/helpController';
import { User } from './types';

dotenv.config();

const port = Number(process.env.PORT) || 4000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  const workers: Array<Worker> = [];
  for (let i = 0; i < numCPUs - 1; i++) {
    const worker = cluster.fork();

    workers.push(worker);
  }

  let currentWorker = 0;
  const server = http.createServer(async (req, res) => {
    currentWorker = (currentWorker + 1) % workers.length;
    const httpRequest = http.request(
      {
        host: '127.0.0.1',
        port: port + currentWorker,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (response) => {
        if (response.statusCode) {
          res.writeHead(response.statusCode, response.headers);
          response.pipe(res);
        }
      },
    );

    req.pipe(httpRequest);
  });

  cluster.on('message', (worker, message) => {
    if (message.type === 'db') {
      console.log(`Master received db update message from worker ${worker.id}`);

      workers.forEach((otherWorker) => {
        if (otherWorker?.id !== worker.id) {
          otherWorker?.send(message);
        }
      });
    }
  });

  server.listen(port, () => {
    console.log(`Load balancer is listening on port ${port}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const workerPort = port + Number(cluster.worker?.id);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  process.on('message', (message: any) => {
    if (message.type === 'db') {
      const newDB: Map<string, User> = new Map(JSON.parse(message.data));
      HelpController.replaceDB(newDB);
    }
  });
  const server = http.createServer(router);

  server.listen(workerPort, () => {
    console.log(`Worker ${process.pid} is listening on port ${workerPort}`);
  });
}
