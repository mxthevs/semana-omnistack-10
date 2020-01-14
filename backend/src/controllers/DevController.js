const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index, show, store, update, destroy

module.exports = {
  async index (req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store (req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if(!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const { name = login, avatar_url, bio } = response.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,   
      });
    }
  
    return res.json(dev);
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, avatar_url, bio, latitude, longitude, techs } = req.body;

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const dev = await Dev.findOne({ _id: id });

    dev.name = name;
    dev.avatar_url = avatar_url;
    dev.bio = bio;
    dev.techs = techsArray;
    dev.location = location;

    await dev.save();
    
    return res.json(dev);
  },
  
  async destroy (req, res) {
    const { id } = req.params;

    await Dev.deleteOne({ _id: id });

    return res.json({ message: 'Usuário deletado com sucesso.'});
  }
}