require('dotenv').config();

import supergoose, { startDB, stopDB } from '../../supergoose.js';
import { app } from '../../../src/app.js';
import User from '../../../src/models/users.js';

const mockRequest = supergoose(app);

beforeAll(startDB);
afterAll(stopDB);
beforeEach(async () => {
  await User.deleteMany({});
});

describe('/upload route', () => {
  it('should sign in', async () => {
    const userInfo = {
      username: 'foo',
      password: 'bar',
    };

    let response = await mockRequest.post('/signup').send(userInfo);
    const token = response.text;
    response = await mockRequest.post('/signin').auth(token, {type:'bearer'});

    expect(response.text).toBe(token);
  });

  it('should upload a file', async () => {
    const userInfo = {
      username: 'foo',
      password: 'bar',
    };

    let response = await mockRequest.post('/signup').send(userInfo);
    const token = response.text;
    response = await mockRequest.post('/signin').auth(token, {type:'bearer'});
    let pic = await mockRequest.post('/upload').auth(token, {type:'bearer'}).attach('img', `${__dirname}/asset/ohlawd.jpg`);
    expect(pic.status).toBe(200);
  });

  it('should delete a file', async () => {
    const userInfo = {
      username: 'foo',
      password: 'bar',
    };

    let response = await mockRequest.post('/signup').send(userInfo);
    const token = response.text;
    response = await mockRequest.post('/signin').auth(token, {type:'bearer'});
    let pic = await mockRequest.post('/upload').auth(token, {type:'bearer'}).attach('img', `${__dirname}/asset/ohlawd.jpg`);
    let obj = JSON.parse(pic.text);
    let deleted = await mockRequest.delete(`/delete-image/${obj.images[0]._id}`).auth(token, {type:'bearer'});
    expect(deleted.status).toBe(204);
  });
});