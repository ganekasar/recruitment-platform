<<<<<<< HEAD
const mongoose = require('mongoose');
const testSchema = require("./test");
const Schema = mongoose.Schema;
var question;

const questionSchema = new Schema({
=======

var mongoose              = require("mongoose");
var testSchema            = require("./test");
const Schema              = mongoose.Schema;
var question;

var questionSchema = new Schema({
>>>>>>> 7897805478a409cf81b537cdc53df0e6e87161de
    test: {type: Schema.Types.ObjectId, ref: 'testSchema'},
    question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String
});

<<<<<<< HEAD
module.exports = question = mongoose.model("Question" , questionSchema);
=======

module.exports = question = mongoose.model("Question" , questionSchema);
>>>>>>> 7897805478a409cf81b537cdc53df0e6e87161de
