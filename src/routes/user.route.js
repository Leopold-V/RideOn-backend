import express from 'express';
import userController from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/signup', userController.createUser);
router.post('/login', userController.login);
router.post('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
