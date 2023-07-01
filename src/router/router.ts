import { IncomingMessage, ServerResponse } from 'http';
import { Controller } from '../controllers/controller';
import { parseUrl } from '../helpers/parseUrl';

export function router(req: IncomingMessage, res: ServerResponse) {
  let pathUrl = [];
  let id = '';
  if (req.url) {
    pathUrl = parseUrl(req.url);
    id = pathUrl[2];
  }
  if (req.method === 'GET' && req.url === '/api/users') {
    Controller.getAllUser(req, res);
  } else if (req.method === 'GET' && req.url === `/api/users/${id}` && id) {
    Controller.getUserById(req, res, id);
  } else if (req.method === 'POST' && req.url === '/api/users') {
    Controller.createNewUser(req, res);
  } else if (req.method === 'PUT' && req.url === `/api/users/${id}` && id) {
    Controller.updateUser(req, res, id);
  } else if (req.method === 'DELETE' && req.url === `/api/users/${id}` && id) {
    Controller.deleteUser(req, res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}
