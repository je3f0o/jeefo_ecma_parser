/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_literal.js
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

var COMMA_PRECEDENCE = 1;

var ArrayLiteral = function () {};
ArrayLiteral.prototype = {
	type       : "ArrayLiteral",
	precedence : 31,
	initialize : function (token, scope) {
		this.type     = this.type;
		this.elements = [];
		this.start    = token.start;

		var i = 0;

		scope.advance();

		while (scope.current_token && scope.current_token.delimiter !== ']') {
			while (scope.current_expression && scope.current_expression.type === "Comment") {
				this.elements[i++] = scope.current_expression;
				scope.advance();
			}

			if (scope.current_token.delimiter === ',') {
				this.elements[i++] = null;
			} else {
				this.elements[i++] = scope.expression(COMMA_PRECEDENCE);
			}

			if (scope.current_token.delimiter === ',') {
				scope.advance();
			}

			while (scope.current_expression && scope.current_expression.type === "ArrayLiteral") {
				this.elements[i++] = scope.current_expression;
				scope.advance();
				if (scope.current_token.delimiter === ',') {
					scope.advance();
				}
			}
		}

		this.end = scope.current_token.end;
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports = {
	is          : function (token) { return token.delimiter === '['; },
	token_type  : "Delimiter",
	Constructor : ArrayLiteral
};
