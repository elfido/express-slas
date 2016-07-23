/**
 * SLAs
 * @description Service Level Agreement monitor for ExpressJS 
 * @author Fido <fidencio.garrido@gmail.com>
 */ 
 
'use strict';

var onHeaders = require("on-headers"),
    _ = require("lodash");

function SLAS(options){
    let defOptions = {
        logError: true,
        sla: 1000,
        cb: function(time){}
    },
    _options = (typeof options === "object") ? _.assign(defOptions, options) : defOptions;
    
    return function(req, res, next){
        var reqStart = new Date();
        onHeaders(res, function onHeaders() {
            var diff = (new Date()) - reqStart;
            if(diff>_options.sla){
                if (typeof _options.cb === "function")
                    process.nextTick( _options.cb, diff );
                if (_options.logError)
                    console.error(`ERROR: SLA error, expected <${_options.sla} ms, took ${diff} ms`);
            }
        });
        next();
    };
}

module.exports = SLAS;