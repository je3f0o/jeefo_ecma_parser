/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : javascript_tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2017-05-03
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

var jeefo = require("jeefo");
require("jeefo_tokenizer")(jeefo);
console.log("ZZZZZZZZZZ");

/* global */
/* exported */
/* exported */

//ignore:end
var app      = jeefo.module("jeefo_javascript_parser", ["jeefo_tokenizer"]),
	LANGUAGE = "javascript";

// Regions {{{1
app.namespace("javascript.es5_regions", ["tokenizer.Region"], function (Region) {
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
		type        : "String",
		name        : "Double quote string",
		start       : '"',
		escape_char : '\\',
		end         : '"',
	});
	javascript_regions.register({
		type        : "String",
		name        : "Single quote string",
		start       : "'",
		escape_char : '\\',
		end         : "'",
	});
	javascript_regions.register({
		type      : "TemplateLiteral quasi string",
		start     : null,
		end       : '${',
		until     : true,
		contained : true,
	});
	javascript_regions.register({
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
	});
	javascript_regions.register({
		type        : "TemplateLiteral",
		start       : '`',
		escape_char : '\\',
		end         : '`',
		contains : [
			{ type : "TemplateLiteral quasi string" } ,
			{ type : "TemplateLiteral expression"   } ,
		],
		keepend : true
	});

	// Parenthesis {{{2
	javascript_regions.register({
		type  : "Parenthesis",
		name  : "Parenthesis",
		start : '(',
		end   : ')',
		contains : [
			{ type : "Block"           } ,
			{ type : "Array"           } ,
			{ type : "String"          } ,
			{ type : "RegExp"          } ,
			{ type : "Comment"         } ,
			{ type : "Parenthesis"     } ,
			{ type : "TemplateLiteral" } ,
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

	// Block {{{2
	javascript_regions.register({
		type  : "Block",
		name  : "Block",
		start : '{',
		end   : '}',
		contains : [
			{ type : "Block"           } ,
			{ type : "Array"           } ,
			{ type : "String"          } ,
			{ type : "RegExp"          } ,
			{ type : "Comment"         } ,
			{ type : "Parenthesis"     } ,
			{ type : "TemplateLiteral" } ,
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

app.namespace("javascript.tokenizer", [
	"tokenizer.TokenParser",
	"javascript.es5_regions"
], function (TokenParser, jeefo_js_regions) {
	return function (source) {
		var tokenizer = new TokenParser(LANGUAGE, jeefo_js_regions);
		return tokenizer.parse(source);
	};
});

//ignore:start
module.exports = jeefo;
//ignore:end
