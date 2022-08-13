import { userRepository } from '../models/user.model.js';
import { createUserValidator } from '../validators/user.validator.js';
import { passwordHash } from '../utils/passwordHash.js';

const createUser = async (req, res) => {
  console.log(req.body);
  const { error } = createUserValidator(req.body);
  if (error) {
    res.status(404).send({ message: 'User not valid!' });
  } else {
    const newPassword = await passwordHash(req.body.password);
    const user = await userRepository.createAndSave({...req.body, password: newPassword, friendslist: [],  isOnline: false});
    res.send(user);
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

export default { createUser, getUser, updateUser, deleteUser, getAllUsers };
