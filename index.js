/**
 * SLAs
 * @description Service Level Agreement monitor for ExpressJS 
 * @author Fido <fidencio.garrido@gmail.com>
 */ 
 
'use strict';

var _ = require("lodash");

/**
 * Returns process time
 */
function ptime(){
    let t = process.hrtime();
    return t[0] * 1000000 + t[1] / 1000;
}

function SLAS(options){
    let defOptions = {
        logError: true,
        sla: 1000,
        cb: function(time){}
    },
    _options = (typeof options === "object") ? _.assign(defOptions, options) : defOptions;
    
    return function(req, res, next){
        var start = ptime();
        res.on("finish",function(){
            var diff = (ptime() - start) / 1000;
            if(diff>_options.sla){
                if (typeof _options.cb === "function")
                    process.nextTick( _options.cb, diff );
                if (_options.logError)
                    console.error(`ERROR: SLA error, expected <${_options.sla} ms, took ${diff.toFixed(2)} ms`);
            }
        });
        next();
    };
}

module.exports = SLAS;