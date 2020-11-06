const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://orionis:8iwFARZZJk7lTwtq@cluster0.1yzy7.mongodb.net/threaderdb?retryWrites=true&w=majority'

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

mongoose.connection.once("open", function () {
  console.log("** MongoDB database connection established successfully **");
});