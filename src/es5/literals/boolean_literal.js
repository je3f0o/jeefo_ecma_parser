/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : boolean_literal.js
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

var BooleanLiteral = function () {};
BooleanLiteral.prototype = {
	type       : "BooleanLiteral",
	precedence : 31,
	initialize : function (token) {
		this.type  = this.type;
		this.value = token.name;
		this.start = token.start;
		this.end   = token.end;
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports = {
	token_type : "Identifier",

	is : function (token) {
		switch (token.name) { case "true" : case "false" :
			return true;
		}
	},
	Constructor : BooleanLiteral
};
