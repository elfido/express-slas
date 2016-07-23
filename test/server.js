/**
 * Used to test default behavior
 */
'use strict';

var express = require("express"),
    slas = require("..");
 
var createServer = function(port, options) {
    let app = express(),
        opts = (typeof options === "object") ? options : {};
    
    app.use(slas(opts));
 
    app.get("/success", function(req, res) {
        res.send("cool");
    });
    
    app.get("/slow", function(req, res){
       setTimeout(function(){
           res.send("not good");
       }, 100); 
    });
 
    return app.listen(port, function(){
        //console.log("Server is running");
    });
};
 
module.exports = createServer;