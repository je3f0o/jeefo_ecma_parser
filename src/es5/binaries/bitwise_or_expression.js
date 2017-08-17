/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : bitwise_or_expression.js
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

var BitwiseOrExpression = function () {};
BitwiseOrExpression.prototype = require("./binary").make("BitwiseOrExpression", 7);

module.exports = {
	is          : function (token) { return token.operator === '|'; },
	token_type  : "Operator",
	Constructor : BitwiseOrExpression
};
