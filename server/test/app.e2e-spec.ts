import * as dotenv from 'dotenv';

dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const testUserID: string = 'b8a543cc-c27e-49ee-9470-17fdb253828b';
  const testTaskID: string = 'fbc236ee-1d40-4d90-995d-ebe97ff01ca3';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('UserController (e2e)', ()=> {
    it('/user (GET)', () => {
      return request(app.getHttpServer())
        .get('/user')
        .expect(200)
        .expect([]);
    });

    it('/user (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send({
          id: testUserID,
          username: 'testuser',
          password: 'Password123/',
          email: 'test@gmail.com'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.username).toEqual('testuser');
      expect(res.body.password).toEqual('Password123/');
      expect(res.body.email).toEqual('test@gmail.com');
    });

    it(`/user/:id (GET)`, async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/${testUserID}`);
      
      expect(res.status).toBe(200);
      expect(res.body.username).toEqual('testuser');
      expect(res.body.password).toEqual('Password123/');
      expect(res.body.email).toEqual('test@gmail.com');
    });

    it('/user (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it(`/user/:id (PATCH)`, async () => {
      const res = await request(app.getHttpServer())
        .patch(`/user/${testUserID}`)
        .send({
          username: 'updatedtestuser',
          password: 'NewPassword123/',
          email: 'newemail@gmail.com'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.username).toEqual('updatedtestuser');
      expect(res.body.password).toEqual('NewPassword123/');
      expect(res.body.email).toEqual('newemail@gmail.com');
    });

    it(`/user/:id (DELETE)`, async () => {
      const res = await request(app.getHttpServer())
        .delete(`/user/${testUserID}`);
      
      expect(res.status).toBe(200);
      expect(res.body.affected).toBe(1);
    });

    it('/user (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('TaskContoller (e2e)', ()=> {
    it('/task (GET)', () => {
      return request(app.getHttpServer())
        .get('/task')
        .expect(200)
        .expect([]);
    });

    it('/task (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post('/task')
        .send({
          id: testTaskID,
          author: testUserID,
          priority: 0,
          dependencies: ['324fffed'],
          status: 0,
          title: 'title!',
          description: 'description.'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.author).toEqual(testUserID);
      expect(res.body.priority).toEqual(0);
      expect(res.body.dependencies).toHaveLength(1);
      expect(res.body.status).toEqual(0);
      expect(res.body.title).toEqual('title!');
      expect(res.body.description).toEqual('description.');
    });

    it(`/task/:id (GET)`, async () => {
      const res = await request(app.getHttpServer())
        .get(`/task/${testTaskID}`);
      
      expect(res.status).toBe(200);
      expect(res.body.author).toEqual(testUserID);
      expect(res.body.priority).toEqual(0);
      expect(res.body.dependencies).toHaveLength(1);
      expect(res.body.status).toEqual(0);
      expect(res.body.title).toEqual('title!');
      expect(res.body.description).toEqual('description.');
    });

    it('/task (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/task');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it(`/task/author/:id (GET)`, async () => {
      const res = await request(app.getHttpServer())
        .get(`/task/author/${testUserID}`);
      
      console.log(res.body);

      expect(res.status).toBe(200);
      expect(res.body[0].author).toEqual(testUserID);
    });

    it(`/task/:id (PATCH)`, async () => {
      const res = await request(app.getHttpServer())
        .patch(`/task/${testTaskID}`)
        .send({
          author: testUserID,
          priority: 1,
          dependencies: ['9f8hyj9o8y', 'ant324ui9'],
          status: 2,
          title: 'new title!',
          description: 'updated description.'
        });
      
      console.log(res.body);

      expect(res.status).toBe(200);
      expect(res.body.author).toEqual(testUserID);
      expect(res.body.priority).toEqual(1);
      expect(res.body.dependencies).toHaveLength(2);
      expect(res.body.status).toEqual(2);
      expect(res.body.title).toEqual('new title!');
      expect(res.body.description).toEqual('updated description.');
    });

    it(`/task/:id (DELETE)`, async () => {
      const res = await request(app.getHttpServer())
        .delete(`/task/${testTaskID}`);
      
      console.log(res.body);
      
      expect(res.status).toBe(200);
      expect(res.body.affected).toBe(1);
    });

    it('/task (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/task');
      
      console.log(res.body);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});
