@examples
=========

[![Dependency Status](https://david-dm.org/fru/jsdoc-at-examples.png?theme=shields.io)](https://david-dm.org/fru/jsdoc-at-examples)

Use the @examples JSDoc tag to write small and wonderfully concise tests, just above your code. Simple examples are worth a thousand words so here goes:

```javascript
/**
 * @examples
 * isInteger(5)     // true
 * isInteger(5.0)   // true
 * isInteger(-5)    // true
 * isInteger(3.14)  // false
 * isInteger('foo') // false
 * isInteger(NaN)   // false
 */
function isInteger(x) {
  return x === Math.floor(x);
}
```

The best part is, now you can actually test that these examples hold true. This is especially great with regular expressions:

```javascript
(function(){

  /**
   * XSD shema type xsd:gYearMonth
   * @expose gYearMonth
   * @examples
   * gYearMonth.test('1989-05')    // true
   * gYearMonth.test('2099-10')    // true
   * gYearMonth.test('2000-01-01') // false
   * gYearMonth.test('99-01')      // false
   * gYearMonth.test('2100-01')    // false
   */
  var gYearMonth = /^(19|20)\d\d-(0[1-9]|1[012])$/;

})();
```

The @expose JSDoc tag adds gYearMonth to the global scope after it is declared. Without @expose the test would fail because gYearMonth is undefined. 

The next example illustrates that any javascript object can be used as an expected values and equality is checked using a recursive `deepEquals` approach. When an exception is expected use `throws`.

```javascript
/**
 * JavaScript edge cases: undefined
 * @examples
 *
 * // foobar is never defined
 *
 * if(foobar)done() // throws
 * typeof foobar    // "undefined"
 * {wrap: foobar}   // {wrap: void 0}
 *
 */
```

For more examples and features have a look at the sample folder. Please submit an [issue](https://github.com/fru/jsdoc-at-examples/issues) if you encounter any trouble.

FAQ
---

**How should use this library?**

Everybody that wants to add the @examples syntax to there testing workflow or tool should have a look. If you would like to discuss the integration into your tool, please feel free to contact me. 

**Does this generate JSDoc project documentation?**

No it does not. For this use e.g. [grunt-jsdoc](https://github.com/krampstudio/grunt-jsdoc). Also have a look at the sample folder where grunt-jsdoc is used as well.

**This looks a lot like [autodoc](https://github.com/dtao/autodoc). Why not just use autodoc or fork it?**

I really liked the idea of autodoc, but not that test runs are mixed into the documentation. Also in my opinion the goal to be a full blown JSDoc suit adds a lot of unnecessary weight and clutter. So this project treats @examples tests like real tests and a seperate JSDoc parser can be used to generate the documentation. 


