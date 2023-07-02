import { ServerResponse, IncomingMessage } from 'http';
import { myBoDyParser } from '../helpers/bodyParser';
import { UserDataRequest, User } from '../types';
import { HelpController } from './helpController';
import { validate as checkId } from 'uuid';
import { sendError } from '../helpers/sendError';
import { responseMessages } from '../helpers/messages';

export class Controller {
  static async getAllUser(req: IncomingMessage, res: ServerResponse) {
    try {
      const allUsers = await HelpController.getArrayFromDb();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(allUsers));
    } catch (err) {
      sendError(res, 500, responseMessages.errorServer);
    }
  }

  static async getUserById(req: IncomingMessage, res: ServerResponse, id: string) {
    try {
      if (checkId(id)) {
        const userById = await HelpController.getUserFromDbById(id);
        if (userById) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(userById));
        } else {
          sendError(res, 404, `User with id ${id} not found`);
        }
      } else {
        sendError(res, 400, responseMessages.errorValidate);
      }
    } catch (err) {
      sendError(res, 500, responseMessages.errorServer);
    }
  }

  static async createNewUser(req: IncomingMessage, res: ServerResponse) {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const { username, age, hobbies } = myBoDyParser(body);
          if (
            username &&
            age &&
            hobbies &&
            Array.isArray(hobbies) &&
            hobbies.every((item) => typeof item === 'string')
          ) {
            const data: UserDataRequest = {
              username,
              age,
              hobbies,
            };
            const user: User = HelpController.addUserOnDb(data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
          } else {
            sendError(res, 400, responseMessages.nonRequiredBodyFields);
          }
        } catch (err) {
          sendError(res, 400, responseMessages.invalidBody);
        }
      });
    } catch (err) {
      sendError(res, 500, responseMessages.errorServer);
    }
  }

  static async updateUser(req: IncomingMessage, res: ServerResponse, id: string) {
    try {
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
              if (
                username &&
                age &&
                hobbies &&
                Array.isArray(hobbies) &&
                hobbies.every((item) => typeof item === 'string')
              ) {
                const data: UserDataRequest = {
                  username,
                  age,
                  hobbies,
                };
                const user: User = HelpController.updateUserInDb(data, id);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
              } else {
                sendError(res, 400, responseMessages.nonRequiredBodyFields);
              }
            } catch (error) {
              sendError(res, 400, responseMessages.invalidBody);
            }
          });
        } else {
          sendError(res, 404, `User with id ${id} not found`);
        }
      } else {
        sendError(res, 400, responseMessages.errorValidate);
      }
    } catch (err) {
      sendError(res, 500, responseMessages.errorServer);
    }
  }

  static async deleteUser(req: IncomingMessage, res: ServerResponse, id: string) {
    try {
      if (checkId(id)) {
        const isUserExist = HelpController.checkUserExistInDb(id);
        if (isUserExist) {
          HelpController.deleteUserFromDB(id);
          res.writeHead(204, { 'Content-Type': 'text/plain' });
          res.end();
        } else {
          sendError(res, 404, `User with id ${id} not found`);
        }
      } else {
        sendError(res, 400, responseMessages.errorValidate);
      }
    } catch (err) {
      sendError(res, 500, responseMessages.errorServer);
    }
  }
}
