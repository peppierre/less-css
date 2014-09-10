/**
 * Setup default settings for a specific type of testing framework 
 */
module.exports = function(type){

  if(type === 'qunit'){
    
    this.set('wrap-setup-teardown', 'QUnit.module("", { <%content%> });');
    this.set('wrap-teardowns', 'setup: function(){ <%content%> },');
    this.set('wrap-teardown', '<%content%>;');
    this.set('wrap-setups', 'teardown: function(){ <%content%> },');
    this.set('wrap-setup', '<%content%>;');

    this.set('wrap-deepEqual', 'QUnit.test("<%value%>",function(assert){ <%content%> });');
    this.set('test-deepEqual', 'assert.deepEqual(<%content%>, <%value%>)');

    this.set('wrap-deepEqualAsync', 'QUnit.asyncTest("<%value%>",function(assert){expect(1); <%content%> });');
    this.set('test-deepEqualAsync', 'function done(){       \
      var value = Array.prototype.slice.call(arguments, 0); \
      if(value.length===1)value = value[0];                 \
      if(value.length===0)value = QUnit._result;            \
      assert.deepEqual(value, <%value%>); QUnit.start();    \
    };QUnit._result = <%content%>;');

    this.set('wrap-throws', 'QUnit.test("<%value%>",function(assert){ <%content%> });');
    this.set('test-throws', 'assert.throws(function(){<%content%>;});');

    this.set('wrap-throwsAsync', 'QUnit.test("<%value%>",function(assert){ <%content%> });');
    this.set('test-throwsAsync', 'function done(){assert.ok(false);};assert.throws(function(){<%content%>;});');

  }else{
    throw new Error('Unknown test type. Choose one of qunit.');
  }
};
