/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : logical_and_expression.js
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

var LogicalAndExpression = function () {};
LogicalAndExpression.prototype = require("./binary").make("LogicalAndExpression", 6);

module.exports = {
	is          : function (token) { return token.operator === "&&"; },
	token_type  : "Operator",
	Constructor : LogicalAndExpression
};
