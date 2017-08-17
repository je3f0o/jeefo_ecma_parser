/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : switch_statement.js
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
SwitchCase = function () {
	this.initialize();
},
DefaultCase = function () {
	this.initialize();
	this.statements = [];
},
SwitchStatement = function () {};

SwitchCase.prototype = {
	type       : "SwitchCase",
	initialize : generic_initializer
};
DefaultCase.prototype = {
	type       : "DefaultCase",
	initialize : generic_initializer
};

SwitchStatement.prototype = {
	type                 : "SwitchStatement",
	precedence           : 31,
	initialize           : generic_initializer,
	statement_denotation : function (scope) {
		var start = scope.current_token.start;

		scope.advance('(');
		scope.advance();
		this.discriminant = scope.expression(0);

		if (scope.current_token.delimiter === ')') {
			scope.advance('{');
			this.cases = [];
			this.parse_cases(scope, this.cases);
		} else {
			scope.current_token.error_unexpected_token();
		}

		this.start = start;
		this.end   = scope.current_token.end;

		return this;
	},
	parse_cases : function (scope, cases) {
		var _case, start;

		scope.advance();

		while (scope.current_token.delimiter !== '}') {
			start = scope.current_token.start;

			while (scope.current_expression.type === "Comment") {
				cases.push(scope.current_expression);
				scope.advance();
			}

			switch (scope.current_expression.name) {
				case "case" :
					_case = new SwitchCase();
					scope.advance();
					_case.test = scope.expression(0);

					if (scope.current_token.delimiter !== ':') {
						scope.current_token.error_unexpected_token();
					}
					break;
				case "default" :
					_case = new DefaultCase();
					scope.advance(':');
					break;
				default:
				console.log(scope.current_token);
					scope.current_token.error();
			}

			_case.statements = [];
			_case.start      = start;
			_case.end        = scope.current_token.end;

			scope.advance();
			while (scope.current_expression) {
				if (! scope.current_expression               ||
					scope.current_token.delimiter === '}'    ||
					scope.current_expression.name === "case" ||
					scope.current_expression.name === "default") {
					break;
				}

				_case.statements.push(scope.current_expression.statement_denotation(scope));
				scope.advance();
			}

			if (_case.statements.length) {
				_case.end = _case.statements[_case.statements.length - 1].end;
			}

			cases.push(_case);
		}
	}
};

module.exports = {
	is          : function (token) { return token.name === "switch"; },
	token_type  : "Identifier",
	Constructor : SwitchStatement
};
