/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_tokenizer.js
* Created at  : 2017-05-23
* Updated at  : 2017-05-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

var jeefo    = require("./es5_tokenizer"),
	_package = require("../package"),
	app      = jeefo.module(_package.name);

/* globals */
/* exported */

// ignore:end

// ES6 Tokenizer {{{1
app.namespace("javascript.es6_tokenizer", ["javascript.es5_tokenizer"], function (es5_tokenizer) {
	var es6_tokenizer = es5_tokenizer.copy(),
		hash          = es6_tokenizer.regions.hash;
	
	es6_tokenizer.language = "ECMA Script 6";
	
	// TODO: think about matchgroup

	es6_tokenizer.regions.
	// TemplateLiteral {{{2
	register({
		type        : "TemplateLiteral quasi string",
		start       : null,
		escape_char : '\\',
		end         : '${',
		until       : true,
		contained   : true,
	}).
	register({
		type  : "TemplateLiteral expression",
		start : "${",
		end   : '}',
		contains : [
			{ type : "Block"       } ,
			{ type : "Array"       } ,
			{ type : "String"      } ,
			{ type : "RegExp"      } ,
			{ type : "Comment"     } ,
			{ type : "Parenthesis" } ,
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%', // operator
					'&', '|', '$', '?', '`',
					'=', '!', '<', '>', '\\',
					':', '.', ',', ';', // delimiters
				]
			},
		]
	}).
	register({
		type  : "TemplateLiteral",
		start : '`',
		end   : '`',
		contains : [
			{ type : "TemplateLiteral quasi string" } ,
			{ type : "TemplateLiteral expression"   } ,
		],
		keepend : true
	});
	// }}}2

	hash['{'][0].contains.push({ type : "TemplateLiteral" });
	hash['('][0].contains.push({ type : "TemplateLiteral" });
	hash['['][0].contains.push({ type : "TemplateLiteral" });

	return es6_tokenizer;
});
// }}}1

// ignore:start
module.exports = jeefo;
// ignore:end
