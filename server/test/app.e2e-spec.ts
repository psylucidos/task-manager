import * as dotenv from 'dotenv';

dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
    let createdUserID: Number;

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
});
