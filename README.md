[![Build Status](https://travis-ci.org/elfido/express-slas.svg?branch=master)](https://travis-ci.org/elfido/express-slas)
[![Dependencies Status](https://david-dm.org/elfido/express-slas.svg)](https://david-dm.org/elfido/express-slas.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4ef7ee9347094fcd8f8a687ccb26477f)](https://www.codacy.com/app/fidencio-garrido/express-slas?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=elfido/express-slas&amp;utm_campaign=Badge_Grade)
![Node](https://img.shields.io/badge/node-4.0-brightgreen.svg)
[![NPM](https://nodei.co/npm/express-slas.png)](https://nodei.co/npm/express-slas/)

# express-slas
SLA's (Service Level Agreement) handler for Express.JS

## What does it do?
Set a max time for your API and this middleware will report back if the response time goes over it. It does not cancel the request, it just
logs an error by default (using ```console.error```).

You can pass a callback to perform custom actions such as sending notifications to slack / hipchat / JIRA tickets. This callback will be executed
**asynchronously**, you don't have to be worried about it delaying the response even more.

As per Express nature, this middleware will evaluate the time between the time
when the request comest to it and then when the headers are set.

## Usage
Install it:
```sh
npm install -S express-slas
```

Declare it and use it
```javascript
var slas = require("express-slas");
// Assuming 'app' is an express object
app.use(slas());
```
**Note** Don't forget that for more accurate results this middleware should be loaded
before all other middleware (except you really require to load something before i.e. security reasons).


Full example:
```javascript
'use strict';
var express = require("express"),
    app = express(),
    slas = require("express-slas");
    
var monitor = function(t){
    // Notify monitoring system
};

// Setting a SLA of 100ms, disabling default error message and passing a callback
app.use( slas({sla: 100, logError: false, cb: monitor}) );

app.get("/", function(req, res){
    res.send("hello world");
});

app.listen(8080, function(){
   console.log("app started"); 
});
```

## Options

Options are passed in the initialization as an object with the following properties:

### sla (number, default 1000ms, optional)
Time in milliseconds. 

### logError (boolean, default true, optional)
Logs an error message to the console using ```console.error```


### cb (callback, optional)
Custom callback that will be executed asynchronously **after** the response is sent to the client.
This callback is **only executed if the SLA is not met**. It passes the time spent as an argument. 

### ToDo
* Prevent console flood when a service keeps going over the SLA.
* Implement streaming pluings