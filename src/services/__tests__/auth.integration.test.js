const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

require('dotenv').config();

console.log('JWT_SECRET =', process.env.JWT_SECRET);
console.log('CLIENT_URL =', process.env.CLIENT_URL);

const app = require('../../app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({}); // reset state between tests
  }
});

describe('Auth flow', () => {
  const testUser = { name: 'Test User', email: 'test@example.com', password: 'password123' };

  it('registers a new user and returns a token cookie', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.password).toBeUndefined(); // never leak the hash
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects registering the same email twice', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(400);
  });

  it('logs in with correct credentials and rejects incorrect ones', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const goodLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(goodLogin.status).toBe(200);

    const badLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(badLogin.status).toBe(401);
  });

  it('blocks access to a protected route without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('allows access to a protected route with a valid token cookie', async () => {
    const registerRes = await request(app).post('/api/auth/register').send(testUser);
    const cookie = registerRes.headers['set-cookie'];

    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.user.email).toBe(testUser.email);
  });
});