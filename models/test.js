<<<<<<< HEAD
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var test;

const testSchema = new Schema({
    name: String
});

module.exports = test = mongoose.model("Test" , testSchema);
=======
var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var test;

var testSchema = new Schema({
    name: String
});

module.exports = test = mongoose.model("Test" , testSchema);
>>>>>>> 7897805478a409cf81b537cdc53df0e6e87161de
