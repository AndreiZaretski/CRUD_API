import { IncomingMessage, ServerResponse } from 'http';
import { Controller } from '../controllers/controller';

export function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET' && req.url === '/api/users') {
    Controller.getAllUser(req, res);
  } else if (req.method === 'POST' && req.url === '/api/users') {
    Controller.createNewUser(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}
