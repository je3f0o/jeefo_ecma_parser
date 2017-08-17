/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2017-05-11
* Updated at  : 2017-08-16
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Scope = require("./scope");

var Parser = function (tokenizer, symbol_table) {
	this.scope = new Scope(symbol_table, tokenizer);
};

Parser.prototype = {
	parse : function (source_code) {
		this.scope.tokenizer.init(source_code);
		return this.scope.parse();
	},
};

module.exports = Parser;
