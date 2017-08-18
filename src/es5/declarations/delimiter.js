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

var EmptyStatement = require("../statements/empty_statement");

var Delimiter = function () {};
Delimiter.prototype = {
	type       : "Delimiter",
	initialize : function () {
		this.type      = this.type;
		this.delimiter = ';';
	},
	statement_denotation : function (scope) {
		return new EmptyStatement(scope.current_token);
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === ';'; },
	token_type  : "Delimiter",
	Constructor : Delimiter
};
