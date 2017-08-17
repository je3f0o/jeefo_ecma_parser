/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement.js
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

var ReturnStatement = function () {};
ReturnStatement.prototype = {
	type                 : "ReturnStatement",
	precedence           : 31,
	initialize           : require("../generic_initializer"),
	statement_denotation : require("../denotations/argument_statement_denotation"),
};

module.exports = {
	is          : function (token) { return token.name === "return"; },
	token_type  : "Identifier",
	Constructor : ReturnStatement
};
