/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiters.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var delimiter = function (container, character) {
	container[character] = { precedence : 0, character : character };
};

module.exports = function (symbol_table) {
	var container = symbol_table.symbols.delimiters;

	delimiter(container, ':');
	delimiter(container, ')');
	delimiter(container, ']');
	delimiter(container, '}');
};
