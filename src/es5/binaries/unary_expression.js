/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_expression.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var UnaryExpression = function () {};
UnaryExpression.prototype = {
	type            : "UnaryExpression",
	precedence      : 17,
	initialize      : require("../operator_initialzier"),
	left_denotation : function (left, scope) {
		if (left.start.line !== scope.current_token.start.line) {
			scope.current_token.error();
		}
		this.argument  = left;
		this.is_prefix = false;
		this.start     = left.start;
		this.end       = scope.current_token.end;

		scope.advance_binary();

		//console.log(`[${ this.type }]`, this, scope.current_expression);
		return this;
	},
};

module.exports = {
	token_type : "Operator",

	is : function (token) {
		switch (token.operator) { case '++' : case '--' :
			return true;
		}
	},
	Constructor : UnaryExpression
};
