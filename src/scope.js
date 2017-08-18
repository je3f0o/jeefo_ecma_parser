/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : scope.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Scope = function (symbol_table, tokenizer) {
	this.tokenizer    = tokenizer;
	this.symbol_table = symbol_table;
};

Scope.prototype = {
	parse : function () {
		var statements = [];

		for (this.advance(); this.current_expression; this.advance()) {
			statements.push(this.current_expression.statement_denotation(this));
		}

		return statements;
	},

	// Advance {{{1
	advance : function (expected_token_property, expected_token_value) {
		this.current_token = this.tokenizer.next();

		if (this.current_token) {

			this.current_expression = this.symbol_table.resolve_delimiter(this) ||
				this.symbol_table.resolve_expression(this);
				
			if (expected_token_value) {
				if (expected_token_value !== this.current_token[expected_token_property]) {
					console.log("EXPECT TOKEN VALUE", expected_token_value, this.current_token);
					this.current_token.error_unexpected_token();
				}
			} else if (expected_token_property && expected_token_property !== this.current_token.value) {
				console.log("EXPECT TOKEN VALUE", expected_token_property, this.current_token);
				this.current_token.error_unexpected_token();
			}
		} else {
			this.current_expression = null;
		}
	},

	// Advance binary {{{1
	advance_binary : function () {
		this.current_token = this.tokenizer.next();

		if (this.current_token) {
			this.current_expression = this.symbol_table.resolve_delimiter(this) ||
				this.symbol_table.resolve_binary_expression(this);
		} else {
			this.current_expression = null;
		}
	},
	// }}}1

	expression : function (right_precedence) {
		var left = this.current_expression;
		if (left.null_denotation) {
			left = left.null_denotation(this);
		}

		if (this.current_expression && ! this.current_expression.left_denotation &&
			this.current_expression.precedence > right_precedence) {
			this.advance_binary();
		}

		while (this.current_expression && right_precedence < this.current_expression.precedence) {
			left = this.current_expression.left_denotation(left, this);
		}

		return left;
	},
};

module.exports = Scope;
