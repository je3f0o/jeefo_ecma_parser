/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : argument_statement_denotation.js
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

module.exports = function (scope) {
	var start = scope.current_token.start, end = scope.current_token.end;

	scope.advance();
	if (! scope.current_token) {
		this.argument = null;
		this.ASI      = true;
	} else if (end.column === 0 || (scope.current_expression.start && scope.current_expression.start.line > end.line)) {
		this.argument = null;
		this.ASI      = true;
		scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
	} else if (scope.current_token.delimiter === ';') {
		end           = scope.current_token.end;
		this.argument = null;
		this.ASI      = false;
	} else {
		this.argument = scope.expression(0);

		if (! scope.current_token) {
			end      = this.argument.end;
			this.ASI = true;
		} else if (this.argument.end.column === 0 || scope.current_token.start.line > this.argument.end.line) {
			end      = this.argument.end;
			this.ASI = true;
			scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
		} else if (scope.current_token.delimiter === ';') {
			end      = scope.current_token.end;
			this.ASI = false;
		} else {
			scope.current_token.error();
		}
	}

	this.start = start;
	this.end   = end;
	//console.log(`[${ this.type }]`, scope.current_expression, this);

	return this;
};
