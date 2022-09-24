import express from 'express';
import { verifyJWT } from '../../middlewares.js';
import userController from '../controllers/user.controllers.js';

const router = express.Router();

router.post('/auth', userController.isUserAuth);
router.get('/all', userController.getAllUsers); // => Temporary removed verifyJWT middleware for testing convenience.
router.get('/:id', verifyJWT, userController.getUser);
router.put('/signup', userController.createUser);
router.post('/login', userController.login);
router.post('/:id', verifyJWT, userController.updateUser);
router.delete('/:id', userController.deleteUser); // => Only for testing convenience.

export default router;
