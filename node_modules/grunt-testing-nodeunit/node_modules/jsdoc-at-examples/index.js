var Examples = require('./src/public.js');


module.exports = function(instrumenter){
  "use strict";

  var result = new Examples();
  
  // If constructor is passed build instrumenter
  if(typeof instrumenter === 'function'){
    instrumenter = new instrumenter({
      preserveComments: true,
      noCompact: true
    });

    if(!instrumenter.walker.startWalk){
      throw "Invalid istanbul constructor passed as parameter."
    }

    // Intercept default walker with plugin
    var oldStartWalk = instrumenter.walker.startWalk;
    instrumenter.walker.startWalk = function(program){
      oldStartWalk.apply(this, arguments);
      result.instrument(program);
    };

    instrumenter.examples = result;
    return instrumenter;
  }

  return result;
};