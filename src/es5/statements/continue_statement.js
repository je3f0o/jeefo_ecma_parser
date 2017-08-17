/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : continue_statement.js
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

var ContinueStatement = function () {};
ContinueStatement.prototype = {
	type                 : "ContinueStatement",
	precedence           : 31,
	initialize           : require("../generic_initializer"),
	statement_denotation : require("../denotations/label_statement_denotation")
};

module.exports = {
	is          : function (token) { return token.name === "continue"; },
	token_type  : "Identifier",
	Constructor : ContinueStatement
};
