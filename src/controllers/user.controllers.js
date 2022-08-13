import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../models/user.model.js';
import { createUserValidator, loginUserValidator } from '../validators/user.validator.js';
import { passwordHash } from '../utils/passwordHash.js';

const createUser = async (req, res) => {
  const { error } = createUserValidator(req.body);
  if (error) {
    res.status(404).send({ message: 'User not valid!' });
  } else {
    let user = await userRepository.search().where('email').equals(req.body.email).return.first();
    if (!user) {
      const newPassword = await passwordHash(req.body.password);
      user = await userRepository.createAndSave({
        ...req.body,
        password: newPassword,
        friendslist: [],
        isOnline: false,
      });
      res.send(user);
    } else {
      res.send({ message: 'An account for this email already exists!' });
    }
  }
};

const login = async (req, res) => {
  const { error } = loginUserValidator(req.body.email, req.body.password);
  if (error) {
    res.status(404).send({ error: true, message: 'Email or password invalid!' });
  } else {
    const user = await userRepository.search().where('email').equals(req.body.email).return.first();
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (error) {
          res.status(404).send({ error: true, message: 'Error encountered!' });
        } else {
          if (result) {
            const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({ error: false, token: token, message: 'Login successful!' });
          } else {
            res.status(404).send({ error: true, message: 'Password incorrect!' });
          }
        }
      });
    } else {
      res.status(404).send({ error: true, message: 'Email incorrect!' });
    }
  }
};

const getUser = async (req, res) => {
  const user = await userRepository.fetch(req.params.id);
  if (user.firtsname) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User not found!' });
  }
};

const updateUser = async (req, res) => {
  const user = await userRepository.fetch(req.params.id);
  const newUser = req.body;
  user.firstname = newUser.firstname ?? null;
  user.lastname = newUser.lastname ?? null;
  user.email = newUser.email ?? null;
  user.isOnline = newUser.isOnline ?? null;
  user.friendslist = newUser.friendslist ?? null;
  await userRepository.save(user);
  res.send(user);
};

const deleteUser = async (req, res) => {
  await userRepository.remove(req.params.id);
  res.send({ entityId: req.params.id });
};

const getAllUsers = async (req, res) => {
  const users = await userRepository.search().return.all();
  res.send(users);
};

export default { createUser, login, getUser, updateUser, deleteUser, getAllUsers };
