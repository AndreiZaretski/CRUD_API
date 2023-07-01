import { ServerResponse, IncomingMessage } from 'http';
import { myBoDyParser } from '../helpers/bodyParser';
import { UserDataRequest, User } from '../types';
import { HelpController } from './helpController';

export class Controller {
  static async getAllUser(req: IncomingMessage, res: ServerResponse) {
    const allUsers = await HelpController.getAllUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(allUsers));
  }
  static createNewUser(req: IncomingMessage, res: ServerResponse) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, age, hobbies } = myBoDyParser(body);
        if (username && age && hobbies && Array.isArray(hobbies)) {
          const data: UserDataRequest = {
            username,
            age,
            hobbies,
          };
          const user: User = HelpController.createUser(data);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Request body does not contain required fields');
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write((error as Error).message);
        res.end('Invalid request body');
      }
    });
  }
}
