/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : in_expression.js
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

var InExpression = function () {};
InExpression.prototype = require("./binary").make("InExpression", 11);

module.exports = {
	is          : function (token) { return token.name === "in"; },
	token_type  : "Identifier",
	Constructor : InExpression
};
