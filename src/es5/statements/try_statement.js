/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement.js
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

var COMMA_PRECEDENCE = 1;

var generic_initializer = require("../generic_initializer");

var CatchClause = function () {
	this.initialize();
};
CatchClause.prototype = {
	type       : "CatchClause",
	precedence : 31,
	initialize : generic_initializer
};

var TryStatement = function () {};
TryStatement.prototype = {
	type                 : "TryStatement",
	precedence           : 31,
	initialize           : generic_initializer,
	statement_denotation : function (scope) {
		var	start    = scope.current_token.start,
			streamer = scope.tokenizer.streamer, token, cursor;

		scope.advance('{');
		this.block = scope.current_expression.statement_denotation(scope);

		scope.advance();
		if (scope.current_expression.name === "catch") {
			this.handler = this._catch(scope);
			token        = scope.current_token;
			cursor       = streamer.get_cursor();
			scope.advance();
		} else {
			this.handler = null;
		}

		if (scope.current_token && scope.current_token.name === "finally") {
			scope.advance('{');
			this.finalizer = scope.current_expression.statement_denotation(scope);
		} else if (token) {
			this.finalizer      = null;
			streamer.cursor     = cursor;
			scope.current_token = token;
		} else {
			console.error("Missing catch or finally after try");
		}

		this.start = start;
		this.end   = (this.finalizer || this.handler).end;

		return this;
	},
	_catch : function (scope) {
		var _catch = new CatchClause(),
			start  = scope.current_expression.start;

		scope.advance('(');

		scope.advance();
		_catch.param = scope.expression(COMMA_PRECEDENCE);

		if (scope.current_token.value === ')') {
			scope.advance('{');
			_catch.body  = scope.current_expression.statement_denotation(scope);
			_catch.start = start;
			_catch.end   = _catch.body.end;
		}

		return _catch;
	}
};

module.exports = {
	is          : function (token) { return token.name === "try"; },
	token_type  : "Identifier",
	Constructor : TryStatement
};
