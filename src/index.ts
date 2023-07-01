import http from 'http';
import dotenv from 'dotenv';
import { router } from './router/router';

dotenv.config();

const server = http.createServer(router);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
