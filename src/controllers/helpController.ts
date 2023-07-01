import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { User, UserDataRequest } from '../types';

export class HelpController {
  static async getAllUsers() {
    return Array.from(db.values());
  }

  static createUser(data: UserDataRequest): User {
    const id = uuidv4();
    const user: User = {
      id,
      username: data.username,
      age: data.age,
      hobbies: data.hobbies,
    };
    db.set(id, user);
    return user;
  }
}
