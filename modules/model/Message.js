const {
  Schema,
  model
} = require('mongoose')

const MessageSchema = new Schema({
  room: String,
  username: String,
  content: String,
  loggedOn: {
    type: Date,
    default: Date.now
  }
})

const Message = model("Message", MessageSchema)

module.exports = Message