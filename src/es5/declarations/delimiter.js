/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiter.js
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

var Delimiter = function () {};
Delimiter.prototype = {
	type       : "Delimiter",
	initialize : function () {
		this.type      = this.type;
		this.delimiter = ';';
	},
	statement_denotation : function (scope) {
		this.start = scope.current_token.start;
		this.end   = scope.current_token.end;

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === ';'; },
	token_type  : "Delimiter",
	Constructor : Delimiter
};
