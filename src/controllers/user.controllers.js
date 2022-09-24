import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../models/user.model.js';
import { createUserValidator, loginUserValidator } from '../validators/user.validator.js';
import { passwordHash } from '../utils/passwordHash.js';

const createUser = async (req, res) => {
  const { error } = createUserValidator(req.body);
  if (error) {
    res.status(400).send({ error: true, message: 'User not valid!' });
  } else {
    try {
      let user = await userRepository.search().where('email').equals(req.body.email).return.first();
      if (!user) {
        const newPassword = await passwordHash(req.body.password);
        user = await userRepository.createAndSave({
          ...req.body,
          password: newPassword,
          friendslist: [],
          isOnline: false,
        });
        res.status(201).send({ error: false, user: user, message: 'User created!' });
      } else {
        res.status(404).send({ error: true, message: 'An account for this email already exists!' });
      }
    } catch (e) {
      res.status(500).send({ error: true, message: e.message });
    }
  }
};

const login = async (req, res) => {
  const { error } = loginUserValidator(req.body.email, req.body.password);
  if (error) {
    res.status(400).send({ error: true, message: 'Email or password invalid!' });
  } else {
    try {
      const user = await userRepository
        .search()
        .where('email')
        .equals(req.body.email)
        .return.first();
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (error) {
            res.status(500).send({ error: true, message: 'Error encountered!' });
          } else {
            if (result) {
              const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
              res.send({ error: false, token: token, message: 'Login successful!', user: user });
            } else {
              res.status(400).send({ error: true, message: 'Password incorrect!' });
            }
          }
        });
      } else {
        res.status(400).send({ error: true, message: 'Email incorrect!' });
      }
    } catch (e) {
      res.status(500).send({ error: true, message: e.message });
    }
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userRepository.fetch(req.params.id);
    if (user.firstname) {
      res.send({ error: false, user: user, message: 'User found!' });
    } else {
      res.status(404).send({ error: true, message: 'User not found!' });
    }
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userRepository.fetch(req.params.id);
    if (user.firstname) {
      const newUser = req.body;
      user.firstname = newUser.firstname ?? null;
      user.lastname = newUser.lastname ?? null;
      user.email = newUser.email ?? null;
      user.isOnline = newUser.isOnline ?? null;
      user.friendslist = newUser.friendslist ?? null;
      await userRepository.save(user);
      res.send({ error: false, user: user, message: 'User updated!' });
    } else {
      res.status(404).send({ error: true, message: 'User not found!' });
    }
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userRepository.remove(req.params.id);
    res.send({ error: false, message: 'User deleted!' });
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.search().return.all();
    res.send({ error: false, users: users, message: 'Users found!' });
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
};

const isUserAuth = (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send({ error: true, isAuth: false, message: 'Unanthenticated user' });
  }
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    console.log(decoded);
    if (err) {
      return res
        .status(401)
        .send({ error: true, isAuth: false, message: 'Failed to authenticate with this token.' });
    }
    return res.send({
      error: false,
      isAuth: true,
      user: decoded.user,
      message: 'User is authenticated!',
    });
  });
};

export default { createUser, login, getUser, updateUser, deleteUser, getAllUsers, isUserAuth };
