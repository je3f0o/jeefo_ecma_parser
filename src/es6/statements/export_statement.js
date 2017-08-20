/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : export_statement.js
* Created at  : 2017-08-19
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var generic_initializer = require("../../es5/generic_initializer");

var ExportDefaultStatement = function () {
	this.initialize();
};
ExportDefaultStatement.prototype = {
	type       : "ExportDefaultStatement",
	precedence : 31,
	initialize : generic_initializer
};

var ExportStatement = function () {};
ExportStatement.prototype = {
	type       : "ExportStatement",
	precedence : 31,
	initialize : generic_initializer,
	statement_denotation : function (scope) {
		var start = scope.current_token.start;

		scope.advance();

		if (scope.current_expression && scope.current_expression.name === "default") {
			var stmt = new ExportDefaultStatement();
			scope.advance();

			if (scope.current_expression) {
				if (scope.current_expression.type === "FunctionExpression") {
					stmt.declaration      = scope.current_expression;
					stmt.declaration.type = "FunctionDeclaration";
					stmt.start            = start;
					stmt.end              = stmt.declaration.end;
					return stmt;
				}

				stmt.declaration = scope.expression(0);
				if (scope.current_token) {
					if (scope.current_token.delimiter === ';') {
						stmt.start = start;
						stmt.end   = scope.current_token.end;
						return stmt;
					} else {
						console.error("INVESTIGATE ME");
					}
				} else {
					stmt.start = start;
					stmt.end   = stmt.declaration.end;
					return stmt;
				}

				scope.current_token.error_unexpected_token();
			} else {
				console.error("ERRRRRRRRRRR export expression");
			}
		}
	}
};

module.exports = {
	is          : function (token) { return token.name === "export"; },
	token_type  : "Identifier",
	Constructor : ExportStatement
};
