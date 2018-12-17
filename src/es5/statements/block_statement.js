/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement.js
* Created at  : 2017-08-18
* Updated at  : 2018-01-15
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var BlockStatement = function (start) {
	this.initialize();
	this.body  = [];
	this.start = start;
};
BlockStatement.prototype = {
	type       : "BlockStatement",
	precedence : 31,
	initialize : require("../generic_initializer"),
	statement_denotation : function (scope) {
		var i = 0, body = this.body;

		for (scope.advance(); scope.current_expression && scope.current_expression.statement_denotation; scope.advance()) {
			body[i++] = scope.current_expression.statement_denotation(scope);
		}

		if (! scope.current_token) {
			this.message    = "Unexpected end of file.";
			this.lineNumber = this.start.line;
			throw this;
		} else if (scope.current_token.delimiter === '}') {
			this.end = scope.current_token.end;
		} else {
			scope.current_token.error_unexpected_token();
		}

		return this;
	}
};

module.exports = BlockStatement;
