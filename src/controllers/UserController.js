const yup = require('yup');
const User = require('../models/User');
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


module.exports = {

  async show(req, res) {
    const { user_id } = req.headers;

    if (!user_id) {
      return res.status(400).json({ error: 'id has not sent' });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ error: 'user does not exist' });
    }
    return res.json(user);
  },

  async store(req, res) {
    const {
      name,
      email,
      nickname,
      country,
      birthday,
      password,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }
    if (!nickname) {
      return res.status(400).json({ error: 'nickname is required' });
    }
    if (!country) {
      return res.status(400).json({ error: 'country is required' });
    }
    if (!birthday) {
      return res.status(400).json({ error: 'birthday is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'password is required' });
    }

    const schema = yup.object().shape({
      name: yup.string().min(1).max(254),
      email: yup.string().matches(emailRegex),
      nickname: yup.string().min(3).max(50),
      country: yup.string().min(2).max(50),
      birthday: yup.date(),
      password: yup.string().min(6).max(32),
    });

    if (!schema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'this is not permited' });
    }

    const userExist = await User.findOne({
      $or: [
        { email },
        { nickname },
      ],
    });

    if (userExist) {
      return res.status(400).json({ error: 'this email or nickname aready exist' });
    }

    const user = await User.create({
      name,
      email,
      nickname,
      country,
      birthday,
      password,
    });
    return res.json(user);
  },
};
