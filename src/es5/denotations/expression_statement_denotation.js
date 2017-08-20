/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement_denotation.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var ExpressionStatement = require("../statements/expression_statement");

module.exports = function (scope) {
	var start      = scope.current_token.start,
		expression = scope.expression(0);

	if (! scope.current_token) {
		return new ExpressionStatement(expression, true, start, expression.end);
	} else if (expression.end.column === 0 || scope.current_token.start.line > expression.end.line) {
		scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
		return new ExpressionStatement(expression, true, start, expression.end);
	} else if (scope.current_token.delimiter === ';') {
		return new ExpressionStatement(expression, false, start, scope.current_token.end);
	}

	console.log("ExpressionStatement");
	console.log(expression);
	console.log("--------------------------");
	console.log(scope.current_expression);
	console.log("--------------------------");
	console.log(scope.current_token);
	console.log("--------------------------");
	console.log(scope.tokenizer.streamer.string);
	process.exit();
/*
	*/
	scope.current_token.error_unexpected_token();
};
