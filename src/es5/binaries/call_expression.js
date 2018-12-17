/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : call_expression.js
* Created at  : 2017-08-16
* Updated at  : 2018-12-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var COMMA_PRECEDENCE = 1;

var CallExpression = function () {};
CallExpression.prototype = {
	type       : "CallExpression",
	precedence : 18,
	initialize : require("../generic_initializer"),

	get_arguments : function (scope, call) {
		var i = 0, args = call["arguments"];

		scope.advance();

		LOOP:
		while (scope.current_token && scope.current_token.delimiter !== ')') {
			args[i++] = scope.expression(COMMA_PRECEDENCE);

			if (! scope.current_token) {
				console.error("Unexpected end");
			}
			if (scope.current_token.delimiter !== ',' && scope.current_token.delimiter !== ')') {
				scope.advance();
			}

			switch (scope.current_token.delimiter) {
				case ',' :
					scope.advance();
					break;
				case ')' :
					break LOOP;
				default:
					console.log(args, scope.current_expression);
					scope.current_token.error_unexpected_token();
			}
		}

		call.end = scope.current_token.end;
		//console.log(`[${ call.type }]`, call);
	},

	get_params : function (scope) {
		var i = 0, params = [];

		scope.advance();

		while (scope.current_expression && scope.current_expression.type === "Comment") {
			scope.advance();
		}

		while (scope.current_token && scope.current_token.delimiter !== ')') {
			if (scope.current_expression.type === "Identifier") {
				params[i++] = scope.current_expression;
				scope.advance();
			} else {
				scope.current_token.error_unexpected_token();
			}

			if (! scope.current_token) {
				console.error("Unexpected end");
			}

			while (scope.current_expression && scope.current_expression.type === "Comment") {
				scope.advance();
			}

			switch (scope.current_token.delimiter) {
				case ')' :
					return params;
				case ',' :
					scope.advance();
					break;
				default:
					scope.current_token.error_unexpected_token();
			}

			while (scope.current_expression && scope.current_expression.type === "Comment") {
				scope.advance();
			}
		}

		return params;
	},

	left_denotation : function (left, scope) {
		switch (left.type) {
			case "Identifier" :
			case "CallExpression" :
			case "MemberExpression" :
			case "FunctionExpression" :
				this.callee       = left;
				this["arguments"] = [];
				this.start        = left.start;

				this.get_arguments(scope, this);

				scope.advance_binary();
				return this;

			case "NewExpression" :
				this.get_arguments(scope, left);
				scope.advance();
				return left;

			case "GroupingExpression" :
				console.log("WHAAAAAAAAAAAAAAAT ??????");
				return left;
		}

		console.log(left, scope.current_token);

		scope.current_token.error_unexpected_token();
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === '('; },
	token_type  : "Delimiter",
	Constructor : CallExpression
};
