/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : number_literal.js
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

var NumberLiteral = function () {};
NumberLiteral.prototype = {
	type       : "NumberLiteral",
	precedence : 31,
	initialize : function (token) {
		this.type  = this.type;
		this.value = token.value;
		this.start = token.start;
		this.end   = token.end;
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports =  {
	token_type  : "Number",
	Constructor : NumberLiteral
};
