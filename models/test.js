var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var test;

var testSchema = new Schema({
    name: String
});

module.exports = test = mongoose.model("Test" , testSchema);
