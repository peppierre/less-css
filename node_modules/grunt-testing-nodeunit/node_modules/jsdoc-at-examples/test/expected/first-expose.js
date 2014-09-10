function isInteger(x) {
    return x === Math.floor(x);
}
(function () {
    var gYearMonth = /^(19|20)\d\d-(0[1-9]|1[012])$/;
    Function('try{this.gYearMonth=gYearMonth;}catch(e){};')();
}());