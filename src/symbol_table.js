/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : symbol_table.js
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

var assign = require("jeefo_utils/object/assign"),
	create_object = Object.create,

sort_handler = function (a, b) {
	return a.Constructor.prototype.precedence - b.Constructor.prototype.precedence;
},

resolve = function (symbols, scope) {
	symbols = symbols[scope.current_token.type];

	if (! symbols) {
		return;
	}

	var i = symbols.length;
	while (i--) {
		if (symbols[i].is && ! symbols[i].is(scope.current_token, scope)) {
			continue;
		}

		var token = new symbols[i].Constructor();
		token.initialize(scope.current_token, scope);

		return token;
	}
},

register = function (container, token_type, handler) {
	if (container[token_type]) {
		container[token_type].push(handler);
		container[token_type].sort(sort_handler);
	} else {
		container[token_type] = [handler];
	}

	return this;
};

module.exports = function (language, symbol_types) {
	var SymbolTable = function () {
		this.symbols = {};

		var i = symbol_types.length;
		while (i--) {
			this.symbols[symbol_types[i]] = create_object(null);
		}
	};

	assign(SymbolTable.prototype, {
		language : language,
		clone    : function () {
			var i            = symbol_types.length,
				symbol_table = new SymbolTable(language, symbol_types);

			while (i--) {
				assign(symbol_table.symbols[symbol_types[i]], this.symbols[symbol_types[i]]);
			}

			return symbol_table;
		},
		resolve  : resolve,
		register : register,
	});

	return SymbolTable;
};
