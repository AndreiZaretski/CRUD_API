import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { User, UserDataRequest } from '../types';

export class HelpController {
  static async getArrayFromDb() {
    return Array.from(db.values());
  }

  static async getUserFromDbById(id: string) {
    return db.get(id);
  }

  static addUserOnDb(data: UserDataRequest): User {
    const id = uuidv4();
    //if (typeof data.age === 'number') {
    const user: User = {
      id,
      username: data.username,
      age: data.age,
      hobbies: data.hobbies,
    };

    db.set(id, user);
    return user;
    //}
  }

  static checkUserExistInDb(id: string) {
    return db.has(id);
  }

  static updateUserInDb(data: UserDataRequest, id: string) {
    const updateUserData: User = {
      id,
      username: data.username,
      age: data.age,
      hobbies: data.hobbies,
    };
    db.set(id, updateUserData);
    return updateUserData;
  }

  static deleteUserFromDB(id: string) {
    db.delete(id);
  }
}
