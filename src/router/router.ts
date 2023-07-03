import { IncomingMessage, ServerResponse } from 'http';
import { Controller } from '../controllers/controller';
import { parseUrl } from '../helpers/parseUrl';
import { responseMessages } from '../helpers/messages';
import { sendError } from '../helpers/sendError';

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
    sendError(res, 404, responseMessages.invaldRequest);
  }
}
