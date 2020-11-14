const mongoose = require('mongoose');
const questionsSchema = require("./question.js");
const Schema = mongoose.Schema;

var responseSchema = new Schema({
    answer: String,
    question: {type: Schema.Types.ObjectId, ref: 'questionSchema'}
});

module.exports = mongoose.model("Response" , responseSchema);