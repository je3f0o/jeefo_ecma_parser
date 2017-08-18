/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

/**
 * Grammer
 * Source : https://www.ecma-international.org/ecma-262/5.1/#sec-12.4
 * 12.4 - Expression Statement
 * NOTE:
 * An ExpressionStatement cannot start with an opening curly brace because that might
 * make it ambiguous with a Block. Also, an ExpressionStatement cannot start with the
 * function keyword because that might make it ambiguous with a FunctionDeclaration.
 */

// ignore:end

var Property = function (key, value) {
	this.type  = this.type;
	this.key   = key;
	this.value = value;
	this.start = key.start;
	this.end   = value.end;
},
BlockStatement = require("../statements/block_statement");

Property.prototype.type = "Property";
var COMMA_PRECEDENCE = 1;

var ObjectLiteral = function () {};
ObjectLiteral.prototype = {
	type       : "ObjectLiteral",
	precedence : 31,
	initialize : require("../generic_initializer"),
	null_denotation : function (scope) {
		var i = 0, properties = this.properties = [], start = scope.current_token.start, key;

		scope.advance();

		while (scope.current_expression && scope.current_expression.type === "Comment") {
			properties[i++] = scope.current_expression;
			scope.advance();
		}

		while (scope.current_token && scope.current_token.value !== '}') {
			switch (scope.current_expression.type) {
				case "Identifier"    :
				case "NumberLiteral" :
				case "StringLiteral" :
					key = scope.current_expression;
					scope.advance();
					break;
			}

			if (scope.current_token.value === ':') {
				scope.advance();
			} else {
				scope.current_token.error_unexpected_token();
			}

			properties[i++] = new Property(key, scope.expression(COMMA_PRECEDENCE));

			if (scope.current_token.value === ',') {
				scope.advance();
			}

			while (scope.current_expression && scope.current_expression.type === "Comment") {
				properties[i++] = scope.current_expression;
				scope.advance();
			}
		}

		this.start = start;
		this.end   = scope.current_token.end;

		scope.advance();

		return this;
	},
	statement_denotation : function (scope) {
		var block_statement = new BlockStatement(scope.current_token.start);
		return block_statement.statement_denotation(scope);
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === '{'; },
	token_type  : "Delimiter",
	Constructor : ObjectLiteral
};
