/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : javascript_symbol_table.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var assign      = require("jeefo_utils/object/assign"),
	SymbolTable = require("./symbol_table");

var JavascriptSymbolTable = new SymbolTable("Javascript", ["delimiters", "binaries", "others"]);

assign(JavascriptSymbolTable.prototype, {
	delimiter : function (character) {
		this.symbols.delimiters[character] = { precedence : 0, character : character };
		return this;
	},
	is_delimiter : function (value) {
		return this.symbols.delimiters[value] !== void 0;
	},

	literal : function (token_type, handler) {
		handler.protos.precedence = 31;
		return this.register(this.symbols.others, token_type, handler, "Literal");
	},
	statement : function (token_type, handler) {
		return this.register(this.symbols.others, token_type, handler, "Statement");
	},
	unary_expression : function (token_type, handler) {
		return this.register(this.symbols.others, token_type, handler, "Expression");
	},
	binary_expression : function (token_type, handler) {
		return this.register(this.symbols.binaries, token_type, handler, handler.suffix === void 0 ? "Expression" : handler.suffix);
	},
	declaration : function (token_type, handler) {
		return this.register(this.symbols.others, token_type, handler);
	},

	resolve_delimiter : function (scope) {
		return this.symbols.delimiters[scope.current_token.delimiter];
	},
	resolve_expression : function (scope) {
		return this.resolve(this.symbols.others, scope);
	},
	resolve_binary_expression : function (scope) {
		return this.resolve(this.symbols.binaries, scope);
	},
});

module.exports = JavascriptSymbolTable;
