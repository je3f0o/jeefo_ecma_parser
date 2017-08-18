/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier.js
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

var LabelledStatement    = require("../statements/labelled_statement"),
	expression_statement = require("../denotations/expression_statement_denotation");

var Identifier = function () {};
Identifier.prototype = {
	type       : "Identifier",
	precedence : 2,
	initialize : function (token) {
		this.type  = this.type;
		this.name  = token.name;
		this.start = token.start;
		this.end   = token.end;

		this.precedence = 21;
	},
	statement_denotation : function (scope) {
		var	tokenizer = scope.tokenizer,
			cursor    = tokenizer.streamer.get_cursor(),
			next      = tokenizer.next();

		while (next && next.type === "Comment") {
			next = tokenizer.next();
		}

		// Labeled statement {{{1
		if (next && next.delimiter === ':') {
			var labelled_statement = new LabelledStatement(scope.current_expression);

			scope.advance();
			labelled_statement.statement = scope.current_expression.statement_denotation(scope);

			labelled_statement.start = labelled_statement.label.start;
			labelled_statement.end   = labelled_statement.statement.end;

			return labelled_statement;
		}
		// }}}1

		// Expression statement
		tokenizer.streamer.cursor = cursor;
		return expression_statement(scope);
	}
};

module.exports = {
	token_type  : "Identifier",
	Constructor : Identifier
};
