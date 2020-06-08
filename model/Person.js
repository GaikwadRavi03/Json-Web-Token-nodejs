const mongoose = require('mongoose')
const mongoSchema = mongoose.Schema;

const personSchema = new mongoSchema({
    id: Number,
    name: String,
    address: String,
    email: String,
    password: String
});

module.exports = mongoose.model('persons', personSchema);