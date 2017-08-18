/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : declarations.js
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

var declarations = [
	"comment",
	"delimiter",
	"identifier",
	"variable_declaration"
];

module.exports = function (symbol_table) {
	var container = symbol_table.symbols.others;

	declarations.forEach(declaration => {
		declaration = require(`./declarations/${ declaration }`);

		symbol_table.register(container, declaration.token_type, {
			is          : declaration.is,
			Constructor : declaration.Constructor,
		});
	});
};
