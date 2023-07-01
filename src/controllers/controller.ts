import { ServerResponse, IncomingMessage } from 'http';
import { myBoDyParser } from '../helpers/bodyParser';
import { UserDataRequest, User } from '../types';
import { HelpController } from './helpController';
import { validate as checkId } from 'uuid';

export class Controller {
  static async getAllUser(req: IncomingMessage, res: ServerResponse) {
    const allUsers = await HelpController.getArrayFromDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(allUsers));
  }

  static async getUserById(req: IncomingMessage, res: ServerResponse, id: string) {
    if (checkId(id)) {
      const userById = await HelpController.getUserFromDbById(id);
      if (userById) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userById));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`User with id ${id} not found`);
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`Is not valid id`);
    }
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
          const user: User = HelpController.addUserOnDb(data);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Request body does not contain required fields');
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        //res.write((error as Error).message);
        res.end('Invalid request body');
      }
    });
  }

  static updateUser(req: IncomingMessage, res: ServerResponse, id: string) {
    if (checkId(id)) {
      const isUserExist = HelpController.checkUserExistInDb(id);
      if (isUserExist) {
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
              const user: User = HelpController.updateUserInDb(data, id);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(user));
            } else {
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end('Request body does not contain required fields');
            }
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            //res.write((error as Error).message);
            res.end('Invalid request body');
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`User with id ${id} not found`);
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`Is not valid id`);
    }
  }

  static deleteUser(req: IncomingMessage, res: ServerResponse, id: string) {
    if (checkId(id)) {
      const isUserExist = HelpController.checkUserExistInDb(id);
      if (isUserExist) {
        HelpController.deleteUserFromDB(id);
        res.writeHead(204, { 'Content-Type': 'text/plain' });
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`User with ${id} not found`);
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`Is not valid id`);
    }
  }
}
