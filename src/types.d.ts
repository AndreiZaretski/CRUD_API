export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface UserDataRequest {
  username: string;
  age: number;
  hobbies: string[];
}
