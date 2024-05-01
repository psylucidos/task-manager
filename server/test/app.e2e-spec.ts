import * as dotenv from 'dotenv';

dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdUserID: Number;
  let createdTaskID: Number;

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
          username: 'testuser',
          password: 'Password123/',
          email: 'test@gmail.com'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.username).toEqual('testuser');
      expect(res.body.password).toEqual('Password123/');
      expect(res.body.email).toEqual('test@gmail.com');

      createdUserID = res.body.id;
    });

    it(`/user/${createdUserID} (GET)`, async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/${createdUserID}`);
      
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

    it(`/user/${createdUserID} (PATCH)`, async () => {
      const res = await request(app.getHttpServer())
        .patch(`/user/${createdUserID}`)
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

    it(`/user/${createdUserID} (DELETE)`, async () => {
      const res = await request(app.getHttpServer())
        .delete(`/user/${createdUserID}`);
      
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
          author: createdUserID,
          priority: 0,
          dependencies: ['9f8hyj9o8y'],
          status: 0,
          title: 'title!',
          description: 'description.'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.author).toEqual(createdUserID);
      expect(res.body.priority).toEqual(0);
      expect(res.body.dependencies).toHaveLength(1);
      expect(res.body.status).toEqual(0);
      expect(res.body.title).toEqual('title!');
      expect(res.body.description).toEqual('description.');

      createdTaskID = res.body.id;
    });

    it(`/task/${createdTaskID} (GET)`, async () => {
      const res = await request(app.getHttpServer())
        .get(`/task/${createdTaskID}`);
      
      expect(res.status).toBe(200);
      expect(res.body.author).toEqual(createdUserID);
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

    it(`/task/${createdTaskID} (PATCH)`, async () => {
      const res = await request(app.getHttpServer())
        .patch(`/task/${createdTaskID}`)
        .send({
          author: createdUserID,
          priority: 1,
          dependencies: ['9f8hyj9o8y', 'ant324ui9'],
          status: 2,
          title: 'new title!',
          description: 'updated description.'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.author).toEqual(createdUserID);
      expect(res.body.priority).toEqual(1);
      expect(res.body.dependencies).toHaveLength(2);
      expect(res.body.status).toEqual(2);
      expect(res.body.title).toEqual('new title!');
      expect(res.body.description).toEqual('updated description.');
    });

    it(`/task/${createdTaskID} (DELETE)`, async () => {
      const res = await request(app.getHttpServer())
        .delete(`/task/${createdTaskID}`);
      
      expect(res.status).toBe(200);
      expect(res.body.affected).toBe(1);
    });

    it('/task (GET)', async () => {
      const res = await request(app.getHttpServer())
        .get('/task');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});
