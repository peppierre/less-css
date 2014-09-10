QUnit.module('', {});
QUnit.test('isInteger(5) // true', function (assert) {
    assert.deepEqual(eval('isInteger(5)'), true);
});
QUnit.test('isInteger(5.0) // true', function (assert) {
    assert.deepEqual(eval('isInteger(5.0)'), true);
});
QUnit.test('isInteger(-5) // true', function (assert) {
    assert.deepEqual(eval('isInteger(-5)'), true);
});
QUnit.test('isInteger(3.14) // false', function (assert) {
    assert.deepEqual(eval('isInteger(3.14)'), false);
});
QUnit.test('isInteger(\'foo\') // false', function (assert) {
    assert.deepEqual(eval('isInteger(\'foo\')'), false);
});
QUnit.test('isInteger(NaN) // false', function (assert) {
    assert.deepEqual(eval('isInteger(NaN)'), false);
});
QUnit.module('', {});
QUnit.test('if(foobar)done() // throws', function (assert) {
    assert.throws(function () {
        eval('if(foobar)done()');
    });
});
QUnit.test('typeof foobar // \'t..."\'', function (assert) {
    assert.deepEqual(eval('typeof foobar'), 't..."');
});
QUnit.test('{wrap: foobar} // {wrap: void 0}', function (assert) {
    assert.deepEqual(eval('{wrap: foobar}'), { wrap: void 0 });
});
QUnit.module('', {});
QUnit.test('gYearMonth.test(\'1989-05\') // true', function (assert) {
    assert.deepEqual(eval('gYearMonth.test(\'1989-05\')'), true);
});
QUnit.test('gYearMonth.test(\'2099-10\') // true', function (assert) {
    assert.deepEqual(eval('gYearMonth.test(\'2099-10\')'), true);
});
QUnit.test('gYearMonth.test(\'2000-01-01\') // false', function (assert) {
    assert.deepEqual(eval('gYearMonth.test(\'2000-01-01\')'), false);
});
QUnit.test('gYearMonth.test(\'99-01\') // false', function (assert) {
    assert.deepEqual(eval('gYearMonth.test(\'99-01\')'), false);
});
QUnit.test('gYearMonth.test(\'2100-01\') // false', function (assert) {
    assert.deepEqual(eval('gYearMonth.test(\'2100-01\')'), false);
});