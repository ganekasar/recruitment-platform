var mongoose = require("mongoose");
const Schema = mongoose.Schema;
var test;

var testSchema = new Schema({
    name: String,
    candidates : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Candidate"
        }
    ]
});

module.exports = test = mongoose.model("Test" , testSchema);
