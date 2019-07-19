var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/helloMongoose';

// NOTE: this is an async operation
mongoose.connect(URL, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: {
        type: String,
        default: function () {
            // if the user's name starts with "r", the default color is "red"
            if (this.name.startsWith('r')) {
                return 'red';
            }
            return 'yellow';
        },
        validate: function (/* color */) {
            return /^(red|yellow|blue)$/i.test(this.color);
        }
    },
    age: { type: Number, required: [true, 'come on dude, we need your age!'] }
});

const User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/', async (_, res) => {
    const users = await User.find().exec();
    res.send(users);
});

router.post('/', async (req, res) => {
    const { age, name, color } = req.body;
    const user = new User({ age, name, color });
    const validationResult = user.validateSync();
    // if (validationResult && Object.keys(validationResult.errors).length) {
    // return res.status(400).send('go home');
    // }
    try {
        await user.save();
        res.send('OK')
    } catch (e) {
        res.status(400).send(e.message);
    }
});

module.exports = router;
