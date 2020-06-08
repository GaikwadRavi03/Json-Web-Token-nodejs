const mongoose = require('mongoose')
const dbConfig = require('./db.config')

mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('successfully connected with data');
}).catch((err) => {
    console.log('not connect DB', err);
    process.exit();
})