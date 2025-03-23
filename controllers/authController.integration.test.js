import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  registerController,
  loginController,
  forgotPasswordController,
} from './authController.js';
import userModel from '../models/userModel.js'; // ensure the correct path
import dotenv from 'dotenv';
dotenv.config();

// Set up a minimal Express app and register routes.
const app = express();
app.use(bodyParser.json());

app.post('/api/auth/register', registerController);
app.post('/api/auth/login', loginController);
app.post('/api/auth/forgot-password', forgotPasswordController);

let mongoServer;

// Connect to an in-memory MongoDB instance before tests.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean up database between tests.
afterEach(async () => {
  await userModel.deleteMany();
});

// Disconnect and stop the in-memory MongoDB instance after all tests.
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Controller Integration Tests', () => {
  const userData = {
    name: 'IntegrationTestName',
    email: 'integrationtest@email.com',
    password: 'password123',
    phone: '1234567890',
    address: 'Singapore',
    DOB: '2000-01-01',
    answer: 'Soccer',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    // console.log(res.body.message);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should not register a user with an already registered email', async () => {
    // First registration
    await request(app).post('/api/auth/register').send(userData);

    // Try registering the same email again.
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);
    // console.log(res.body.message);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already registered/i);
  }, 10000);

  it('should login an existing user', async () => {
    // Register the user first.
    await request(app).post('/api/auth/register').send(userData);

    // Attempt login.
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password });

    console.log(res.body.message);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
  });

  it('should not login with an incorrect password', async () => {
    await request(app).post('/api/auth/register').send(userData);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' });

    console.log(res.body.message);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid password/i);
  });

  it('should reset password', async () => {
    //Register first
    await request(app).post('/api/auth/register').send(userData);
    const forgotPasswordPayload = {
      email: userData.email,
      answer: userData.answer,
      newPassword: 'newPassword123'
    };
  
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send(forgotPasswordPayload);
  
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Password Reset Successfully/i);
  });

  it('should not reset password for non-existent email', async () => {
    //Register first
    await request(app).post('/api/auth/register').send(userData);
    const forgotPasswordPayload = {
      email: 'invalidemail@gmail.com',
      answer: userData.answer,
      newPassword: 'newPassword123'
    };
  
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send(forgotPasswordPayload);
  
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Wrong Email or Answer/i);
  });

  it('should not reset password for wrong password', async () => {
    //Register first
    await request(app).post('/api/auth/register').send(userData);
    const forgotPasswordPayload = {
      email: userData.email,
      answer: 'random answer',
      newPassword: 'newPassword123'
    };
  
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send(forgotPasswordPayload);
  
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Wrong Email or Answer/i);
  });
});
  