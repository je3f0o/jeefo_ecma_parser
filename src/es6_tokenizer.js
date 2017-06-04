/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_tokenizer.js
* Created at  : 2017-05-23
* Updated at  : 2017-06-05
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
	var es6_tokenizer = es5_tokenizer.copy();
	
	// TemplateLiteral {{{2
	es6_tokenizer.register({
		is     : function (character) { return character === '`'; },
		protos : {
			type       : "BackTick",
			precedence : 1,
			initialize : function (character, streamer) {
				this.type  = this.type;
				this.start = streamer.get_cursor();
				this.end   = streamer.end_cursor();
			},
		},
	}).
	
	// Arrow function punctuator {{{2
	register({
		is : function (character, streamer) {
			return character === '=' && streamer.peek(streamer.cursor.index + 1) === '>';
		},
		protos : {
			type       : "ArrowFunctionPunctuator",
			precedence : 21,
			initialize : function (character, streamer) {
				this.type     = this.type;
				this.operator = this.value = "=>";
				this.start    = streamer.get_cursor();

				streamer.move_right(1);
				this.end = streamer.end_cursor();
			},
		},
	});
	// }}}2

	return es6_tokenizer;
});
// }}}1

// ignore:start
module.exports = jeefo;
// ignore:end
