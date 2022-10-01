import express from 'express';
import { verifyJWT } from '../../middlewares.js';
import dogController from '../controllers/dog.controller.js';

const router = express.Router();

// => Temporary removed verifyJWT middleware for testing convenience.
router.get('/all', dogController.getAllDogs);
router.get('/:id', dogController.getDog);
router.put('/create', dogController.createDog);
router.post('/:id', dogController.updateDog);
router.delete('/:id', dogController.deleteDog);

export default router;
