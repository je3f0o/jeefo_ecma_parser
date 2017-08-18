/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
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

var generic_initializer = require("../generic_initializer"),
	VariableDeclaration = require("../declarations/variable_declaration").Constructor,

ForInStatement = function (left, right) {
	this.initialize();
	this.left  = left;
	this.right = right;
},

ForStatement = function () {};

ForStatement.prototype = {
	type       : "ForStatement",
	precedence : 31,
	initialize : generic_initializer,
	statement_denotation : function (scope) {
		var self     = this,
			start    = scope.current_token.start,
			streamer = scope.tokenizer.streamer, cursor;

		scope.advance('(');
		cursor = streamer.get_cursor();

		scope.advance();
		if (scope.current_expression && scope.current_expression.type === "VariableDeclaration") {
			var left = new VariableDeclaration(scope.current_expression.start);
			left.initialize(scope.current_token);

			scope.advance();
			if (scope.current_expression.type === "Identifier") {
				left.declare(scope.current_expression);
			
				scope.advance_binary();
				if (scope.current_expression && scope.current_expression.type === "InExpression") {
					scope.advance();
					var right = scope.expression(0);

					self = new ForInStatement(left, right);
				} else if (scope.current_expression.operator === '=') {
					streamer.cursor = cursor;
					scope.advance();
					self.init = scope.current_expression.statement_denotation(scope);
				} else {
					scope.current_token.error_unexpected_token();
				}
			} else {
				scope.current_token.error_unexpected_token();
			}
		} else if (scope.current_token.value === ';') {
			self.init = null;
		} else {
			self.init = scope.expression(0);
		}

		if (scope.current_token.value === ';') {
			scope.advance();

			if (scope.current_token.value === ';') {
				self.test = null;
			} else {
				self.test = scope.expression(0);
			}

			scope.advance();

			if (scope.current_token.delimiter === ')') {
				self.update = null;
			} else {
				self.update = scope.expression(0);
			}
		} else if (self.init && self.init.type === "InExpression") {
			self = new ForInStatement(self.init.left, self.init.right);
		} else if (self.type !== "ForInStatement") {
			scope.current_token.error_unexpected_token();
		}

		if (scope.current_token.value === ')') {
			scope.advance();
		}

		self.statement = scope.current_expression.statement_denotation(scope);

		self.start = start;
		self.end   = scope.current_token.end;

		return self;
	}
};

ForInStatement.prototype = {
	type       : "ForInStatement",
	precedence : 31,
	initialize : generic_initializer,
};

module.exports = {
	is          : function (token) { return token.name === "for"; },
	token_type  : "Identifier",
	Constructor : ForStatement
};
