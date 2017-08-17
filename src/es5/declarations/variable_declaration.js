/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration.js
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

var VariableDeclarator = function (token) {
	this.type  = this.type;
	this.id    = token;
	this.init  = null;
	this.start = token.start;
};
VariableDeclarator.prototype.type = "VariableDeclarator";

var VariableDeclaration = function () {};
VariableDeclaration.prototype = {
	type       : "VariableDeclaration",
	precedence : 31,
	initialize : function (token) {
		this.type         = this.type;
		this.declarations = [];
		this.ASI          = true;
		this.start        = token.start;
	},
	statement_denotation : function (scope) {
		// init
		scope.advance();
		var declarator;

		while (scope.current_expression) {
			while (scope.current_expression.type === "Comment") {
				this.declarations.push(scope.current_expression);
				scope.advance();
			}

			if (scope.current_expression.type === "Identifier") {
				declarator = this.declare(scope.current_expression);
			} else {
				scope.current_token.error();
			}

			scope.advance_binary();
			if (scope.current_token && scope.current_expression.operator === '=') {
				scope.advance();
				declarator.init = scope.expression(COMMA_PRECEDENCE);
			}
			declarator.end = declarator.init ? declarator.init.end : declarator.id.end;
			//console.log("VARIABLE DECLARATOR", declarator);

			if (scope.current_token) {
				switch (scope.current_token.delimiter) {
					case ',' :
						scope.advance();
						break;
					case ';' :
						this.ASI = false;
						this.end = scope.current_token.end;
						return this;
					default:
						if (declarator.end.column === 0) {
							this.end = declarator.end;
							scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
							return this;
						} else {
							console.log("unexpected end of var", scope.current_token);
							console.log("---------------");
							console.log(declarator);
							console.log("---------------");
							console.log(declarator.init);
							console.log("---------------");
							scope.current_token.error_unexpected_token();
						}
				}
			}
		}

		this.end = declarator.end;
		return this;
	},

	declare : function (token) {
		token = new VariableDeclarator(token);
		this.declarations.push(token);
		return token;
	}
};

module.exports = {
	is          : function (token) { return token.name === "var"; },
	token_type  : "Identifier",
	Constructor : VariableDeclaration
};
