//All the middlewares are defined here!!

var Candidate       = require("../models/candidate.js");
var middlewareObj   = {};

middlewareObj.checkIsCompany = function(req, res, next){
    if(req.isAuthenticated())
    {
        if(req.user.isAdmin)
            next();
        else{
            console.log('You are not authorized!');
            res.redirect("back");
        }
            
    }
    else
    {
        console.log('Log in first');
        res.redirect("/studentLogin");
    }
}

module.exports = middlewareObj;