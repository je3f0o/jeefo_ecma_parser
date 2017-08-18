/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_expression.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var FunctionExpression = function () {};
FunctionExpression.prototype = {
	type       : "FunctionExpression",
	precedence : 31,
	initialize : function (token, scope) {
		this.type = this.type;

		scope.advance_binary();
		if (scope.current_token.type === "Identifier") {
			this.id = scope.current_token;
			scope.advance_binary('(');
		} else {
			this.id = null;
		}

		if (scope.current_token.value === '(') {
			this.parameters = scope.current_expression.get_params(scope);
		} else {
			scope.current_token.error_unexpected_token();
		}

		scope.advance();
		if (scope.current_token.delimiter === '{') {
			this.body  = scope.current_expression.statement_denotation(scope);
			this.start = token.start;
			this.end   = this.body.end;
		} else {
			scope.current_token.error_unexpected_token();
		}

		//console.log(`[${ this.type }]`, this, scope.current_expression);

		return this;
	},
	statement_denotation : function () {
		this.type = "FunctionDeclaration";
		return this;
	}
};

module.exports = {
	is          : function (token) { return token.name === "function"; },
	token_type  : "Identifier",
	Constructor : FunctionExpression
};
