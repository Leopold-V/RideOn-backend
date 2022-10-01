import { Entity, Schema } from 'redis-om';
import client from '../../client.js';

class Dog extends Entity {}

const dogSchema = new Schema(Dog, {
  species: { type: 'string' },
  location: { type: 'point' },
  dangerosity: { type: 'number' },
  description: { type: 'text' },
});

export const dogRepository = client.fetchRepository(dogSchema);

await dogRepository.createIndex();
