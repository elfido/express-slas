/**
 * SLAs
 * @description Service Level Agreement monitor for ExpressJS 
 * @author Fido <fidencio.garrido@gmail.com>
 */ 
 
"use strict";

/**
 * Returns process time
 */
function ptime(t){
    let diff = process.hrtime(t);
    return diff[0] + diff[1] / 1000000;
}

/**
 * Options:
 * @param logError boolean
 * @param sla time in milliseconds
 * @param disableFor time in seconds
 * @cb callback
 */
function SLAS(options){
    
    let defOptions = {
        logError: true,
        sla: 1000,
        disableFor: 10,
        cb() {}
    },
    paused = false,
    _options = (typeof options === "object") ? Object.assign(defOptions, options) : defOptions;
    
    return function(req, res, next){
        if (!paused){
            var start = process.hrtime();
            res.on("finish",function(){
                var diff = ptime(start);
                if(diff>_options.sla){
                    if (typeof _options.cb === "function"){
                        process.nextTick( _options.cb, diff );
                    }
                    if (_options.logError){
                        console.error(`ERROR: SLA error, expected <${_options.sla} ms, took ${diff.toFixed(2)} ms`);
                    }
                    if (!isNaN(_options.disableFor) && _options.disableFor>0){
                        paused = true;
                        setTimeout( function(){
                            paused = false;
                        }, (_options.disableFor * 1000));
                    }
                }
            });
        }
        next();
    };
}

module.exports = SLAS;