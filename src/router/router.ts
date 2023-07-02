import { IncomingMessage, ServerResponse } from 'http';
import { Controller } from '../controllers/controller';
import { parseUrl } from '../helpers/parseUrl';

export async function router(req: IncomingMessage, res: ServerResponse) {
  let pathUrl = [];
  let id = '';
  if (req.url) {
    pathUrl = parseUrl(req.url);
    id = pathUrl[2];
  }
  if (req.method === 'GET' && req.url === '/api/users') {
    await Controller.getAllUser(req, res);
  } else if (req.method === 'GET' && req.url === `/api/users/${id}` && id) {
    await Controller.getUserById(req, res, id);
  } else if (req.method === 'POST' && req.url === '/api/users') {
    await Controller.createNewUser(req, res);
  } else if (req.method === 'PUT' && req.url === `/api/users/${id}` && id) {
    await Controller.updateUser(req, res, id);
  } else if (req.method === 'DELETE' && req.url === `/api/users/${id}` && id) {
    await Controller.deleteUser(req, res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}
