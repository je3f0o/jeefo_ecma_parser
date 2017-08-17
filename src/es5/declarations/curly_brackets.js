/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : curly_brackets.js
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

var expression_statement = require("../denotations/expression_statement_denotation");

var Property = function (key, value) {
	this.type  = this.type;
	this.key   = key;
	this.value = value;
	this.start = key.start;
	this.end   = value.end;
};
Property.prototype.type = "Property";
var COMMA_PRECEDENCE = 1;

var CurlyBrackets = function () {};
CurlyBrackets.prototype = {
	type       : "CurlyBrackets",
	precedence : 31,
	initialize : function (token, scope) {
		var streamer = scope.tokenizer.streamer,
			cursor   = streamer.get_cursor();

		scope.advance();
		
		if (scope.current_token.delimiter !== '}') {
			if (scope.current_expression && scope.current_expression.type === "Comment") {
				scope.advance();
				
				while (scope.current_expression && scope.current_expression.type === "Comment") {
					scope.advance();
				}
			} else {
				scope.advance();
			}

			while (scope.current_expression && scope.current_expression.type === "Comment") {
				scope.advance();
			}

			if (scope.current_token.value === ':') {
				streamer.cursor     = cursor;
				scope.current_token = token;

				this.type = "ObjectLiteral";
				return;
			}
		}

		this.type           = this.type;
		streamer.cursor     = cursor;
		scope.current_token = token;
	},
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

		if (this.type === "CurlyBrackets") {
			this.type = "ObjectLiteral";
		}

		this.start = start;
		this.end   = scope.current_token.end;

		scope.current_expression = this;

		return this;
	},
	statement : function (scope) {
		this.type = "BlockStatement";

		var i= 0, body = this.body = [];

		this.start = scope.current_token.start;

		for (scope.advance(); scope.current_expression && scope.current_expression.statement_denotation; scope.advance()) {
			body[i++] = scope.current_expression.statement_denotation(scope);
		}

		if (scope.current_token.delimiter === '}') {
			this.end = scope.current_token.end;
		} else {
			scope.current_token.error_unexpected_token();
		}

		return this;
	},
	statement_denotation : function (scope) {
		if (this.type === "ObjectLiteral") {
			return expression_statement(scope);
		}
		return this.statement(scope);
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === '{'; },
	token_type  : "Delimiter",
	Constructor : CurlyBrackets
};
