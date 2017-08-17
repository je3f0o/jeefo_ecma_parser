/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : label_statement_denotation.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
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
	if (! scope.current_expression) {
		this.label = null;
		this.ASI   = true;
	} else if (end.column === 0 || scope.current_token.start.line > end.line) {
		this.label = null;
		this.ASI   = true;
		scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
	} else if (scope.current_token.delimiter === ';') {
		end        = scope.current_token.end;
		this.label = null;
		this.ASI   = false;
	} else if (scope.current_token.type === "Identifier") {
		this.label = scope.current_token;

		scope.advance();

		if (! scope.current_token) {
			end      = this.label.end;
			this.ASI = true;
		} else if (this.label.end.column === 0 || scope.current_token.start.line > this.label.end.line) {
			end      = this.label.end;
			this.ASI = true;
			scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
		} else if (scope.current_token.delimiter === ';') {
			end      = scope.current_token.end;
			this.ASI = false;
		} else {
			scope.current_token.error();
		}
	} else {
		scope.current_token.error();
	}

	this.start = start;
	this.end   = end;
	//console.log(`[${ this.type }]`, scope.current_expression, this);

	return this;
};
