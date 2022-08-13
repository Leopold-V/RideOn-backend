import { Entity, Schema } from 'redis-om';
import client from '../../client.js';

class User extends Entity {}

const userSchema = new Schema(User, {
  firstname: { type: 'string' },
  lastname: { type: 'string' },
  email: { type: 'string' },
  password: { type: 'string' },
  friendslist: { type: 'string[]' },
  isOnline: { type: 'boolean' },
});

export const userRepository = client.fetchRepository(userSchema);

await userRepository.createIndex();
