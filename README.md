# CRUD_API
Instruction

1. git clone https://github.com/AndreiZaretski/CRUD_API.git
2. navigate to the newly created folder 
   cd `CRUD_API`
2. npm i

## Run

`npm run start:dev` application is run in development mode

`npm run start:prod` application is run in production mode

`npm run start:multi` application is run load balancer in the Development mode

## Tests

`npm run test` - Run tests when the server is running

## Requests 

`GET api/users` is used to get all persons 
`GET api/users/{userId}`
`POST api/users` is used to create record about new user and store it in database

   write in body in JSON format folowing data
    ```
    {
      id: string;
      username: string;
      age: number;
      hobbies: string[];
    }
    ```
`PUT api/users/{userId}` is used to update existing user
   
   write in body in JSON format folowing data
    ```
    {
      id: string;
      username: string;
      age: number;
      hobbies: string[];
    }
    ```
`DELETE api/users/{userId}` is used to delete existing user from database