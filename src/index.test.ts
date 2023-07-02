// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import { responseMessages } from './helpers/messages';
import { UserDataRequestTest } from './types';
import { HelpController } from './controllers/helpController';
//import { server } from './index';

const serverUrl = 'http://localhost:4000';

describe('API tests scenario 1', () => {
  const testUser = {
    username: 'Andrei',
    age: 54,
    hobbies: ['hobbi1', 'hobbi2'],
  };

  const responseUser = {
    id: '',
    username: 'Andrei',
    age: 54,
    hobbies: ['hobbi1', 'hobbi2'],
  };

  let userId = '';
  test('Get all records with a GET api/users request', async () => {
    const response = await request(serverUrl).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(await HelpController.getArrayFromDb()));
  });

  test('POST Create a new user', async () => {
    const response = await request(serverUrl).post('/api/users').send(testUser);
    expect(response.status).toBe(201);
    userId = response.body.id;
    responseUser.id = userId;
    expect(response.body).toEqual(responseUser);
  });

  test('GET get user by id', async () => {
    const response = await request(serverUrl).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responseUser);
  });

  test('PUT update user', async () => {
    testUser.username = 'Vaycheslav';
    testUser.age = 99;
    testUser.hobbies = ["I don't have hobbie"];

    responseUser.username = 'Vaycheslav';
    responseUser.age = 99;
    responseUser.hobbies = ["I don't have hobbie"];
    const response = await request(serverUrl).put(`/api/users/${userId}`).send(testUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responseUser);
  });

  test('DELETE user', async () => {
    const response = await request(serverUrl).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });

  test('GET get user by id after delete', async () => {
    const response = await request(serverUrl).get(`/api/users/${userId}`);
    expect(response.status).toBe(404);
    expect(response.text).toEqual(`User with id ${userId} not found`);
    expect(response.body).toEqual({});
  });
});

describe('API tests scenario 2 for invalid input', () => {
  const testUser2: UserDataRequestTest = {
    username: 'Aslan',
    age: '45',
    hobbies: ['Hockey', 'Music'],
  };

  const responseUser2 = {
    id: '',
    username: 'Aslan',
    age: 45,
    hobbies: ['Hockey', 'Music'],
  };

  let userId2 = '';
  test('Get all records with a GET api/user invalid path', async () => {
    const response = await request(serverUrl).get('/api/user');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
    expect(response.text).toEqual(responseMessages.invaldRequest);
  });

  test('POST Try create a new user with invalid body', async () => {
    const response = await request(serverUrl).post('/api/users').send(testUser2);
    expect(response.status).toBe(400);
    expect(response.text).toEqual(responseMessages.nonRequiredBodyFields);
  });

  test('POST Try create a new user with correct body', async () => {
    testUser2.age = 45;
    const response = await request(serverUrl).post('/api/users').send(testUser2);
    expect(response.status).toBe(201);
    userId2 = response.body.id;
    responseUser2.id = userId2;
    expect(response.body).toEqual(responseUser2);
  });

  test('GET get user by id with wrong id', async () => {
    const wrongId = userId2.slice(-1);
    const response = await request(serverUrl).get(`/api/users/${wrongId}`);
    expect(response.status).toBe(400);
    expect(response.text).toEqual(responseMessages.errorValidate);
  });

  test('PUT update user with empty body', async () => {
    const response = await request(serverUrl).put(`/api/users/${userId2}`).send();
    expect(response.status).toBe(400);
    expect(response.text).toEqual(responseMessages.invalidBody);
  });

  test('DELETE user with wrong ID and delete with right ID again', async () => {
    const wrongId = userId2.slice(-1);
    let response = await request(serverUrl).delete(`/api/users/${wrongId}`);
    expect(response.status).toBe(400);
    expect(response.text).toEqual(responseMessages.errorValidate);
    response = await request(serverUrl).delete(`/api/users/${userId2}`);
    expect(response.status).toBe(204);
  });
});

describe('API tests scenario 3 with invalid input and others variable', () => {
  const testUser3 = {
    username: 'Muhamed',
  };

  const testUser4 = {
    age: 45,
  };

  const testUser5 = {
    username: 'Muhamed',
    age: 45,
    hobbies: ['Hobbie1', 'Hobbie4'],
  };

  const responseUser3 = {
    id: '',
    username: 'Muhamed',
    age: 45,
    hobbies: ['Hobbie1', 'Hobbie4'],
  };

  let userId3 = '';
  test('Get all records with a GET api/user check isArray', async () => {
    const response = await request(serverUrl).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('POST Try create a new user with wrong data', async () => {
    const response = await request(serverUrl).post('/api/users').send(testUser3);
    expect(response.status).toBe(400);
    expect(response.text).toEqual(responseMessages.nonRequiredBodyFields);
  });

  test('POST Try create a new user with a wrong path', async () => {
    const response = await request(serverUrl).post('/api/usersu').send(testUser3);
    expect(response.status).toBe(404);
    expect(response.text).toEqual(responseMessages.invaldRequest);
  });

  test('PUT Try update user with a wrong path', async () => {
    const response = await request(serverUrl).put('/api/users').send(testUser3);
    expect(response.status).toBe(404);
    expect(response.text).toEqual(responseMessages.invaldRequest);
  });

  test('PUT Try update user with a wrong ID', async () => {
    const response = await request(serverUrl).put('/api/users/wrongID').send(testUser3);
    expect(response.status).toBe(400);
    expect(response.text).toEqual(responseMessages.errorValidate);
  });

  test('POST Create a new user with correct body for tests', async () => {
    const response = await request(serverUrl).post('/api/users').send(testUser5);
    expect(response.status).toBe(201);
    userId3 = response.body.id;
    responseUser3.id = userId3;
    expect(response.body).toEqual(responseUser3);
  });

  test('GET get user by id with wrong path', async () => {
    const response = await request(serverUrl).get(`/api/users/${userId3}/path`);
    expect(response.status).toBe(404);
    expect(response.text).toEqual(responseMessages.invaldRequest);
  });

  test('PUT update user with wrong data', async () => {
    const response = await request(serverUrl).put(`/api/users/${userId3}`).send(testUser4);
    expect(response.status).toBe(400);
    expect(response.text).toEqual(responseMessages.nonRequiredBodyFields);
  });

  test('DELETE user with wrong ID and delete with right ID again', async () => {
    //const wrongId = userId2.slice(-1);
    let response = await request(serverUrl).delete(`/api/users/${userId3}/wrongPass`);
    expect(response.status).toBe(404);
    expect(response.text).toEqual(responseMessages.invaldRequest);
    response = await request(serverUrl).delete(`/api/users/${userId3}`);
    expect(response.status).toBe(204);
  });

  test('GET get user by id after delete with wrong path', async () => {
    const response = await request(serverUrl).get(`/api/users/${userId3}`);
    expect(response.status).toBe(404);
    expect(response.text).toEqual(`User with id ${userId3} not found`);
  });
});
