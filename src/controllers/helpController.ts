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

  static async addUserOnDb(data: UserDataRequest) {
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

  static async checkUserExistInDb(id: string) {
    return db.has(id);
  }

  static async updateUserInDb(data: UserDataRequest, id: string) {
    const updateUserData: User = {
      id,
      username: data.username,
      age: data.age,
      hobbies: data.hobbies,
    };
    db.set(id, updateUserData);
    return updateUserData;
  }

  static async deleteUserFromDB(id: string) {
    db.delete(id);
  }

  static replaceDB(newDB: Map<string, User>) {
    db.clear();
    for (const [id, user] of newDB.entries()) {
      db.set(id, user);
    }
  }
}
