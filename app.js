const express = require('express')
const app = express()
require('./config/db.connection')
const Person = require('./model/Person')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const crypto = require('crypto')
var key = "password";
var algo = "aes256"
const jwt = require('jsonwebtoken')
jwtKey = 'jwt'

app.post('/register', jsonParser, (req, res) => {
    var cipher = crypto.createCipher(algo, key);
    var encrepted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
    const data = new Person({
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        password: encrepted
    })

    data.save().then((result) => {
        jwt.sign({ result }, jwtKey, { expiresIn: '300s' }, (err, token) => {
            res.status(201).json({ token })
        })
    }).catch((err) => {
        res.status(400).json(err)
    })
});

app.post('/login', jsonParser, (req, res) => {
    Person.findOne({ email: req.body.email }).then((result) => {
        var decipher = crypto.createDecipher(algo, key);
        var decryptedPass = decipher.update(result.password, 'hex', 'utf8') + decipher.final('utf8');
        if (decryptedPass == req.body.password) {
            jwt.sign({ result }, jwtKey, { expiresIn: '300s' }, (err, token) => {
                res.status(200).json({ token })
            })
        }
    }).catch((err) => {
        res.status(400).json(err)
    })
});

app.get('/users', verifyToken, (req, res) => {
    Person.find().then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        res.status(400).json(err)
    })
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        console.log('bearer : ', bearer[1]);
        req.token = bearer[1];
        jwt.verify(req.token, jwtKey, (err, authData) => {
            if (err) {
                res.json({ result: err })
            } else {
                next();
            }
        })
    } else {
        res.send({ "result": "Token not provided" })
    }
}

app.listen(1000)