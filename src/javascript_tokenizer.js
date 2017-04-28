/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : javascript_tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2017-04-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

var jeefo = require("jeefo_tokenizer");

/* global */
/* exported */
/* exported */

//ignore:end

var js       = jeefo.module("jeefo_javascript_parser", ["jeefo_tokenizer"]),
	LANGUAGE = "javascript";

// Regions {{{1
js.namespace("javascript.es5_regions", ["tokenizer.Region"], function (Region) {
	var javascript_regions = new Region(LANGUAGE);

	// Comment {{{2
	javascript_regions.register({
		type  : "Comment",
		name  : "Inline comment",
		start : "//",
		end   : "\n",
	});
	javascript_regions.register({
		type  : "Comment",
		name  : "Multi line comment",
		start : "/*",
		end   : "*/",
	});

	// String {{{2
	javascript_regions.register({
		type  : "String",
		name  : "Double quote string",
		start : '"',
		skip  : '\\"',
		end   : '"',
	});
	javascript_regions.register({
		type  : "String",
		name  : "Single quote string",
		start : "'",
		skip  : "\\'",
		end   : "'",
	});
	javascript_regions.register({
		type  : "String",
		name  : "Single quote string",
		start : "`",
		skip  : "\\`",
		end   : "`",
	});

	// Parenthesis {{{2
	javascript_regions.register({
		type  : "Parenthesis",
		name  : "Parenthesis",
		start : '(',
		end   : ')',
		contains : [
			{ type : "Block"       },
			{ type : "Array"       },
			{ type : "String"      },
			{ type : "Number"      },
			{ type : "Comment"     },
			{ type : "Parenthesis" },
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%',
					'&', '|', '$', '?', '!', '<', '>', '`',
					'=', // Assignment
					':', '.', ',', ';', // delimiters
				]
			},
		]
	});

	// Array {{{2
	javascript_regions.register({
		type  : "Array",
		name  : "Array literal",
		start : '[',
		end   : ']',
		contains : [
			{ type : "Block"       },
			{ type : "Array"       },
			{ type : "String"      },
			{ type : "Number"      },
			{ type : "Comment"     },
			{ type : "Parenthesis" },
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%', // operator
					'&', '$',
					'=', // Assignment
					':', '.', ',', ';', // delimiters
				]
			},
		]
	});

	// Block {{{2
	javascript_regions.register({
		type  : "Block",
		name  : "Block",
		start : '{',
		end   : '}',
		contains : [
			{ type : "Block"       },
			{ type : "Array"       },
			{ type : "String"      },
			{ type : "Number"      },
			{ type : "Comment"     },
			{ type : "Parenthesis" },
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%', // operator
					'&', '|', '$', '?', '`',
					'=', '!', '<', '>',
					':', '.', ',', ';', // delimiters
				]
			},
		]
	});

	// RegExp {{{2
	javascript_regions.register({
		type  : "RegExp",
		name  : "RegExp",
		start : '/',
		skip  : '\\/',
		end   : '/',
	});
	// }}}2

	return javascript_regions;
});
// }}}1

js.namespace("javascript.tokenizer", [
	"tokenizer.TokenParser",
	"javascript.es5_regions"
], function (TokenParser, jeefo_js_regions) {
	return function (source) {
		var tokenizer = new TokenParser(LANGUAGE, jeefo_js_regions);
		return tokenizer.parse(source);
	};
});

//ignore:start
module.exports = js;
//ignore:end
