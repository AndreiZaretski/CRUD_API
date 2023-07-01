export interface User {
  id: string;
  username: string;
  age: string | number;
  hobbies: string[];
}

interface UserDataRequest {
  username: string;
  age: number | string;
  hobbies: string[];
}
