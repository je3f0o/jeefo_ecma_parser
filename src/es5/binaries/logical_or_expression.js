/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : logical_or_expressions.js
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

var LogicalOrExpression = function () {};
LogicalOrExpression.prototype = require("./binary").make("LogicalOrExpression", 5);

module.exports = {
	is          : function (token) { return token.operator === "||"; },
	token_type  : "Operator",
	Constructor : LogicalOrExpression
};
