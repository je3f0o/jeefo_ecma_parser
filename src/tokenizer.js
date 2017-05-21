/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2017-05-14
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

var jeefo = require("jeefo/dist/jeefo.node").create();
jeefo.use(require("jeefo_core"));
jeefo.use(require("jeefo_tokenizer"));

/* global */
/* exported */
/* exported */

//ignore:end
var app      = jeefo.module("jeefo_javascript_parser", ["jeefo_tokenizer"]),
	LANGUAGE = "javascript";

// Regions {{{1
app.namespace("javascript.es5_tokenizer", ["tokenizer.Tokenizer"], function (Tokenizer) {
	var javascript_tokenizer = new Tokenizer(LANGUAGE);

	// Comment {{{2
	javascript_tokenizer.regions.register({
		type  : "Comment",
		name  : "Inline comment",
		start : "//",
		end   : "\n",
	}).
	register({
		type  : "Comment",
		name  : "Multi line comment",
		start : "/*",
		end   : "*/",
	}).

	// String {{{2
	register({
		type        : "String",
		name        : "Double quote string",
		start       : '"',
		escape_char : '\\',
		end         : '"',
	}).
	register({
		type        : "String",
		name        : "Single quote string",
		start       : "'",
		escape_char : '\\',
		end         : "'",
	}).
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
	}).

	// Parenthesis {{{2
	register({
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
	}).

	// Array {{{2
	register({
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
	}).

	// Block {{{2
	register({
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
	}).

	// RegExp {{{2
	register({
		type        : "RegExp",
		name        : "RegExp",
		start       : '/',
		escape_char : '\\',
		end         : '/',
	});
	// }}}2

	return javascript_tokenizer;
});
// }}}1

//ignore:start
module.exports = jeefo;
//ignore:end
