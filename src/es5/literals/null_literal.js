/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : null_literal.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var NullLiteral = function () {};
NullLiteral.prototype = {
	type       : "NullLiteral",
	precedence : 31,
	initialize : function (token) {
		this.type  = this.type;
		this.start = token.start;
		this.end   = token.end;
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports = {
	is          : function (token) { return token.name === "null"; },
	token_type  : "Identifier",
	Constructor : NullLiteral
};
