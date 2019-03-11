/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-11
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.3
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum        = require("../enums/states_enum"),
      precedence_enum    = require("../enums/precedence_enum"),
      SymbolDefinition   = require("@jeefo/parser/src/symbol_definition"),
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

/* {{{1 crap
var generic_initializer = require("../generic_initializer"),
	VariableDeclaration = require("../declarations/variable_declaration").Constructor,

ForInStatement = function (left, right) {
	this.initialize();
	this.left  = left;
	this.right = right;
},

ForStatement = function () {};

ForStatement.prototype = {
	type       : "For statement",
	precedence : 31,

	initialize : generic_initializer,
	statement_denotation : function (scope) {
		var self     = this,
			start    = scope.current_token.start,
			streamer = scope.tokenizer.streamer, cursor;

		scope.advance('(');
		cursor = streamer.get_cursor();

		scope.advance();
		if (scope.current_expression && scope.current_expression.type === "VariableDeclaration") {
			var left = new VariableDeclaration(scope.current_expression.start);
			left.initialize(scope.current_token);

			scope.advance();
			if (scope.current_expression.type === "Identifier") {
				left.declare(scope.current_expression);
			
				scope.advance_binary();
				if (scope.current_expression && scope.current_expression.type === "InExpression") {
					scope.advance();
					var right = scope.expression(0);

					self = new ForInStatement(left, right);
				} else if (scope.current_expression.operator === '=') {
					streamer.cursor = cursor;
					scope.advance();
					self.init = scope.current_expression.statement_denotation(scope);
				} else {
					scope.current_token.error_unexpected_token();
				}
			} else {
				scope.current_token.error_unexpected_token();
			}
		} else if (scope.current_token.value === ';') {
			self.init = null;
		} else {
			self.init = scope.expression(0);
		}

		if (scope.current_token.value === ';') {
			scope.advance();

			if (scope.current_token.value === ';') {
				self.test = null;
			} else {
				self.test = scope.expression(0);
			}

			scope.advance();

			if (scope.current_token.delimiter === ')') {
				self.update = null;
			} else {
				self.update = scope.expression(0);
			}
		} else if (self.init && self.init.type === "InExpression") {
			self = new ForInStatement(self.init.left, self.init.right);
		} else if (self.type !== "ForInStatement") {
			scope.current_token.error_unexpected_token();
		}

		if (scope.current_token.value === ')') {
			scope.advance();
		}

		self.statement = scope.current_expression.statement_denotation(scope);

		self.start = start;
		self.end   = scope.current_token.end;

		return self;
	}
};

ForInStatement.prototype = {
	type       : "ForInStatement",
	precedence : 31,
	initialize : generic_initializer,
};
}}}1 */

const _for_expression = new SymbolDefinition({
    id         : "For expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (symbol, current_token, parser) => {
        let init = null, condition = null, update = null;

        if (parser.next_token !== ';') {
            init = parser.get_next_symbol(precedence_enum.TERMINATION);
        }

        parser.expect(';', parser => parser.next_token.value === ';');
        parser.prepare_next_state("expression", true);
        condition = parser.get_next_symbol(precedence_enum.TERMINATION);

        parser.expect(';', parser => parser.next_token.value === ';');
        parser.prepare_next_state("expression", true);
        update = parser.get_next_symbol(precedence_enum.TERMINATION);

        symbol.init      = init;
        symbol.condition = condition;
        symbol.update    = update;
    }
});

function get_for_in_expression (identifier, parser) {
    
}

function get_for_expression (parser) {
    parser.prepare_next_state("expression", true);

    let has_var    = parser.next_token.value === "var",
        identifier = null;

    if (has_var) {
        parser.prepare_next_state("expression", true);
    }

    if (parser.next_symbol_definition.id === "Identifier") {
        identifier = parser.next_symbol_definition.generate_new_symbol(parser);
        parser.prepare_next_state("expression", true);

        if (parser.next_token.value === "in") {
            return get_for_in_expression(identifier, parser);
        }
    }

    const for_expression = _for_expression.generate_new_symbol(parser);

    parser.expect(')', parser => parser.next_token.value === ')');
    for_expression.end = parser.next_token.end;

    return for_expression;
}

module.exports = {
    id         : "For statement",
    type       : "Statement",
	precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state(null, true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const expression = get_for_expression(parser);

        console.log("HERE");
        console.log(expression);
        process.exit();

        parser.prepare_next_state(null, true);
        const statement  = parser.get_next_symbol(precedence_enum.TERMINATION);

        symbol.expression  = expression;
        symbol.statement   = statement;
        symbol.pre_comment = pre_comment;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = statement.end;
    }
};
