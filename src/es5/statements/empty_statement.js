/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : empty_statement.js
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

var EmptyStatement = function () {};
EmptyStatement.prototype = {
	type                 : "Empty",
	initialize           : require("../generic_initializer"),
	statement_denotation : function (scope) {
		this.start = scope.current_token.start;
		this.end   = scope.current_token.end;

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === ';'; },
	token_type  : "Delimiter",
	Constructor : EmptyStatement
};
