'use strict';

var server = require("./server"),
    request = require("supertest"),
    assert = require("chai").assert,
    port = 3001,
    app;

describe("Using default server with default settings", function(){
    before(function(){
        app = server( port );    
    });
    
    after(function(){
       app.close(); 
    });
    
    describe("Starting server", function(){
        it("Should succeed", function(done){
            request(app).get("/success").expect(200);
            done();
        });
    });
});

describe("Using default server with callback settings", function(done){
    before(function(){
        let settings = {
            sla: 1000,
            cb: function(time){
                assert.equal(true,false, `Callback should not be executed in a normal call, executed after ${time} ms`);
                done();
            }
        };
        app = server( port, settings );    
    });
    
    after(function(){
      app.close(); 
    });
    
    describe("Starting server", function(){
        it("Should not apply callback", function(done){
            request(app).get("/success").expect(200).end(function(req, res){
                done();
            });
        });
    });
});


describe("Using default server with callback settings, callback should be executed", function(complete){
    var executed = false;
    
    before(function(){
        let settings = {
            sla: 90,
            logError: false,
            cb: function(time){
                console.log("Callback executed as expected");
                executed = true;
            }
        };
        app = server( port, settings );    
    });
    
    after(function(){
      app.close(); 
    });
    
    describe("Starting server", function(){
        it("Should not apply callback", function(done){
            request(app).get("/slow").expect(200).end(function(req, res){
                setTimeout(function(){
                    assert.equal(executed, true, "Callback is expected to be executed");
                }, 10);
                done();
            });
        });
    });
});