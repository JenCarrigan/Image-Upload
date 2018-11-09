import mongoose from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server';
import supertest from 'supertest';

let mongoServer;

/** 
 * @server 
 * @returns function that expects an express server
 */
export default (server) => supertest(server);

/**
 * Typically used in Jest beforeAll hook
 */
export const startDB = async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();

  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true
  };

  await mongoose.connect(mongoUri, mongooseOptions, (err) => {
    if (err) console.error(err);
  });
};

/**
 * Typically used in Jest afterAll hook
 */
export const stopDB = () => {
  mongoose.disconnect();
  mongoServer.stop();
};