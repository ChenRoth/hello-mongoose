var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/helloMongoose';

// NOTE: this is an async operation
mongoose.connect(URL, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/', async (_, res) => {
    const users = await User.find().exec();
    res.send(users);
});

module.exports = router;
