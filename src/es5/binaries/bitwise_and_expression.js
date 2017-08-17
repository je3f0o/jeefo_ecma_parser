/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : bitwise_and_expression.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var BitwiseAndExpression = function () {};
BitwiseAndExpression.prototype = require("./binary").make("BitwiseAndExpression", 9);

module.exports = {
	is          : function (token) { return token.operator === '&'; },
	token_type  : "Operator",
	Constructor : BitwiseAndExpression
};
