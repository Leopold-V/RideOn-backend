import { dogRepository } from '../models/dog.model.js';
import { createDogValidator, updateDogValidator } from '../validators/dog.validator.js';

const createDog = async (req, res) => {
  const { error } = createDogValidator(req.body);
  if (error) {
    res.status(400).send({ error: true, message: error.message });
  } else {
    try {
      const dog = await dogRepository.createAndSave({
        ...req.body,
        dangerosity: +req.body.dangerosity,
        location: { longitude: +req.body.longitude, latitude: +req.body.latitude },
      });
      res.status(201).send({ error: false, dog: dog, message: 'Dog successfully created!' });
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  }
};

const getDog = async (req, res) => {
  try {
    const dog = await dogRepository.fetch(req.params.id);
    console.log(dog);
    if (dog.species) {
      res.send({ error: false, dog: dog, message: 'Dog found!' });
    } else {
      res.status(404).send({ error: true, message: 'Dog not found!' });
    }
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
};

const updateDog = async (req, res) => {
  const newdog = req.body;
  const { error } = updateDogValidator(newdog);
  if (error) {
    res.status(400).send({ error: true, message: error.message });
  } else {
    try {
      const dog = await dogRepository.fetch(req.params.id);
      if (dog.species) {
        dog.species = newdog.species ?? dog.species;
        const longitude = newdog.longitude ?? dog.location.longitude;
        const latitude = newdog.latitude ?? dog.location.latitude;
        dog.location = { longitude: +longitude, latitude: +latitude };
        dog.dangerosity = +newdog.dangerosity ?? dog.dangerosity;
        dog.description = newdog.description ?? dog.description;
        await dogRepository.save(dog);
        res.send({ error: false, dog: dog, message: 'dog updated!' });
      } else {
        res.status(404).send({ error: true, message: 'dog not found!' });
      }
    } catch (e) {
      res.status(500).send({ error: true, message: e.message });
    }
  }
};

const deleteDog = async (req, res) => {
  try {
    await dogRepository.remove(req.params.id);
    res.send({ error: false, message: 'Dog deleted!' });
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
};

const getAllDogs = async (req, res) => {
  try {
    const dogs = await dogRepository.search().return.all();
    res.send({ error: false, dogs: dogs, message: 'Dogs found!' });
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
};

export default { createDog, getAllDogs, getDog, updateDog, deleteDog };
