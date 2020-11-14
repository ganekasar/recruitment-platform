<<<<<<< HEAD
const mongoose = require('mongoose');
const questionsSchema = require("./question.js");
const Schema = mongoose.Schema;

=======

var mongoose              = require("mongoose");
var questionsSchema       = require("./question");
const Schema = mongoose.Schema;


>>>>>>> 7897805478a409cf81b537cdc53df0e6e87161de
var responseSchema = new Schema({
    answer: String,
    question: {type: Schema.Types.ObjectId, ref: 'questionSchema'}
});

<<<<<<< HEAD
module.exports = mongoose.model("Response" , responseSchema);
=======

module.exports = mongoose.model("Response" , responseSchema);
>>>>>>> 7897805478a409cf81b537cdc53df0e6e87161de
