/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_parser.js
* Created at  : 2017-05-23
* Updated at  : 2017-06-04
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

var jeefo    = require("./es6_tokenizer"),
	_package = require("../package"),
	app      = jeefo.module(_package.name);

require("./es5_parser");

/* globals */
/* exported */

// ignore:end

// ES6 parser {{{1
app.namespace("javascript.ES6_parser", [
	"javascript.ES5_parser",
	"javascript.es6_tokenizer",
], function (parser, tokenizer) {

	parser           = parser.copy();
	parser.tokenizer = tokenizer;

	parser.symbols.
	// Template literal {{{2
	literal("BackTick", {
		protos : {
			type       : "Template",
			precedence : 21,
			initialize : function (token, scope) {
				var	streamer  = scope.tokenizer.streamer,
					character = streamer.next(),
					start     = token.end, i = 0, body = [];

				while (character) {
					if (character === '\\') {
						streamer.next();
						character = streamer.next();
					}

					if (character && character === '$' && streamer.peek(streamer.cursor.index + 1) === '{') {
						if (streamer.cursor.index > start.index) {
							body[i++] = new this.TemplateLiteralString(
								start,
								streamer.get_cursor(),
								streamer.seek(start.index)
							);
						}

						start = streamer.get_cursor();
						streamer.move_right(1);
						scope.advance();

						body[i++] = new this.TemplateLiteralExpression(start, scope.expression(0));

						if (scope.current_token.delimiter === '}') {
							body[i - 1].end = scope.current_token.end;
							character = streamer.next();
							start     = streamer.get_cursor();
						} else {
							throw new Error("WTF");
						}
					}

					if (character === '`') {
						if (streamer.cursor.index > start.index) {
							body[i++] = new this.TemplateLiteralString(
								start,
								streamer.get_cursor(),
								streamer.seek(start.index)
							);
						}

						break;
					}

					character = streamer.next();
				}

				this.type  = this.type;
				this.body  = body;
				this.start = token.start;
				this.end   = streamer.end_cursor();
			},
			on_register : function (handler) {
				handler.TemplateLiteralString = function (start, end, value) {
					this.type  = this.type;
					this.value = value;
					this.start = start;
					this.end   = end;
				};
				handler.TemplateLiteralString.prototype.type = "TemplateLiteralString";

				handler.TemplateLiteralExpression = function (start, expression) {
					this.type       = this.type;
					this.expression = expression;
					this.start      = start;
				};
				handler.TemplateLiteralExpression.prototype.type = "TemplateLiteralExpression";
			},
		}
	}).

	// Export default {{{2
	statement("Identifier", {
		is     : function (token) { return token.value === "export"; },
		protos : {
			type       : "Export",
			precedence : 31,
			initialize : function () {
				this.type = this.type;
			},
			statement_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance();

				if (scope.current_expression && scope.current_expression.name === "default") {
					this.type = "ExportDefaultDeclaration";
					scope.advance();

					if (scope.current_expression) {
						if (scope.current_expression.type === "FunctionExpression") {
							this.declaration      = scope.current_expression;
							this.declaration.type = "FunctionDeclaration";
							this.start            = start;
							this.end              = this.declaration.end;
							return this;
						}

						this.declaration = scope.expression(0);
						if (scope.current_token.delimiter === ';') {
							this.start = start;
							this.end   = scope.current_token.end;
							return this;
						}

						scope.current_token.error_unexpected_token();
					} else {
						console.error("ERRRRRRRRRRR export expression");
					}
				}
			},
		}
	});
	// }}}2

	return parser;
});
// }}}1

// ignore:start
// Debug {{{1
if (require.main === module) {
	
app.run([
	"javascript.ES6_parser",
], function (p) {
	var print_substr = function (token) {
		console.log("-----------------------");
		console.log(source.slice(token.start.index, token.end.index));
		console.log("----------------------------------------");
	};
	var print = function (token) {
		console.log("----------------------------------------");
		console.log(token);
		print_substr(token);
	};

	var source;
	var fs       = require("fs");
	var path     = require("path");
	var filename = path.join(__dirname, "./es6_parser.js");
	source       = fs.readFileSync(filename, "utf8");
	/*
	source = `
	export default function () {}
	export default a = 2;
	searchables.push({
		type          : header.type,
		model         : header.model,
		attrs         : { ngIf : \`configs.\${ header.model }.is_renderable\` },
		is_searchable : index > 0,
	});
	namespace = namespace ? z ? \`Hello??\${ namespace }\` : f : part;
`;
*/

try {
	var r = p.parse(source);
	print(r[3].expression.right.consequent.consequent);
} catch(e) {
	console.log(e);
	console.log(e.stack);
}

	//process.exit();
});

}
// }}}1

module.exports = jeefo;

// ignore:end
