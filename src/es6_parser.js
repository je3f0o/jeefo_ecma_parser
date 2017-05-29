/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_parser.js
* Created at  : 2017-05-23
* Updated at  : 2017-05-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

var jeefo    = require("./es5_parser"),
	_package = require("../package"),
	app      = jeefo.module(_package.name);

/* globals */
/* exported */

// ignore:end

// ES6 parser {{{1
app.namespace("javascript.ES6_parser", [
	"javascript.ES5_parser",
], function (parser) {

	parser = parser.copy();

	var is_named = function (value) {
		return function (token, tokens, index) {
			if (token.value === value) {
				if (tokens[index + 1] && tokens[index + 1].start.index === token.end.index) {
					switch (tokens[index + 1].type) {
						case "Number" :
							return false;
						case "SpecialCharacter" :
							if (tokens[index + 1].value !== '_' && tokens[index + 1].value !== '$') {
								token.op    = token.value;
								token.index = index;
								return true;
							}
							return false;
					}
				}
				token.op    = token.value;
				token.index = index;
				return true;
			}
		};
	};

	parser.symbols.
	// Template literal {{{2
	literal("SpecialCharacter", {
		is : function (token) { return token.value === '`'; },
		protos : {
			type       : "Template",
			precedence : 21,
			initialize : function (tokens, index, scope) {
				this.type  = this.type;
				this.start = scope.current_token.start;

				var i = index + 1, j = 0, last_index = i, body = this.body = [], expression;

				while (tokens[i]) {
					if (tokens[i].value === '\\') {
						i += 2;
						continue;
					}

					if (tokens[i].value           === '$' &&
						tokens[i + 1].value       === '{' &&
						tokens[i + 1].start.index === tokens[i].end.index) {

						if (i > last_index) {
							body[j++] = new this.TemplateLiteralString(
								tokens[last_index].start,
								tokens[i - 1].end,
								scope.code.substr(
									tokens[last_index].start.index,
									tokens[i].start.index - tokens[last_index].start.index
								)
							);
						}

						scope.token_index = i + 1;
						scope.advance();

						expression = scope.expression(0);

						if (scope.current_token.value === '}') {
							body[j++] = new this.TemplateLiteralExpression(
								tokens[i].start,
								tokens[scope.token_index].end,
								expression
							);
							i = last_index = scope.token_index + 1;
						}
					}

					if (tokens[i].value === '`') {
						if (i > last_index) {
							body[j++] = new this.TemplateLiteralString(
								tokens[last_index].start,
								tokens[i - 1].end,
								scope.code.substr(
									tokens[last_index].start.index,
									tokens[i].start.index - tokens[last_index].start.index
								)
							);
						}

						scope.token_index = i;
						break;
					}

					++i;
				}

				this.end = tokens[scope.token_index].end;
			},
			on_register : function (handler) {
				handler.TemplateLiteralString = function (start, end, value) {
					this.type  = this.type;
					this.value = value;
					this.start = start;
					this.end   = end;
				};
				handler.TemplateLiteralString.prototype.type = "TemplateLiteralString";

				handler.TemplateLiteralExpression = function (start, end, expression) {
					this.type       = this.type;
					this.expression = expression;
					this.start      = start;
					this.end        = end;
				};
				handler.TemplateLiteralExpression.prototype.type = "TemplateLiteralExpression";
			},
		}
	}).

	// Export default {{{2
	statement("Identifier", {
		is     : is_named("export"),
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
						if (scope.current_token.value === ';') {
							this.start = start;
							this.end   = this.declaration.end;
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
	var filename = path.join(__dirname, "./parser.js");
	source       = fs.readFileSync(filename, "utf8");
	/*
	source = `
	var core_module = jeefo.module("jeefo_core", []),
	CAMEL_CASE_REGEXP = /[A-Z]/g,
	dash_case = function (str) {
		return str.replace(CAMEL_CASE_REGEXP, function (letter, pos) {
			return (pos ? '-' : '') + letter.toLowerCase();
		});
	},
	snake_case = function (str) {
		return str.replace(CAMEL_CASE_REGEXP, function (letter, pos) {
			return (pos ? '_' : '') + letter.toLowerCase();
		});
	};
	delete ZZ.ff;
	typeof x;
	return zzz;
	throw z,a,b;
	function fn (param1, param2) {}
	continue LABEL;
	break LABEL;
	switch (tokens[i].type) {
		case "Number":
		case "Identifier":
			if (tokens[i - 1].end.index === tokens[i].start.index) {
				this.name += tokens[i].value;
			} else {
				break LOOP;
			}
			break;
		case "SpecialCharacter":
			switch (tokens[i].value) {
				case '$':
				case '_':
					if (tokens[i - 1].end.index === tokens[i].start.index) {
						this.name += tokens[i].value;
					} else {
						break LOOP;
					}
					break;
				default:
					break LOOP;
			}
			break;
		default:
			break LOOP;
	}
	try {
		return zzz;
	} catch (e) {
		return error;
	} finally {
		return final;
	}
	for (var i = 0; i < 5; ++i) {
		zz = as, gg = aa;
	}
	for (var a in b) {
		zz = as, gg = aa;
	}
	{
		var a = c + b.c * d - f, z = rr; 
	}
	while (zzz) {}
	if (true) {
		;
	} else if (qqq) {
		var z = h;
	} else {
		var zzz = zzz;
	}
	z = aa || bb && cc;
	z in f;
	z instanceof f;
	f ** f;
	++a;
	a--;
	new Fn(1.2E2,2,3);
	PP.define("IS_NULL", function (x) { return x === null;   }, true);
	instance.define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);
	instance.define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);
	export default function () {}
	export default a = 2;
	searchables.push({
		type          : header.type,
		model         : header.model,\n` +
"		attrs         : { ngIf : \`configs.${ header.model }.is_renderable\` }," + `
		is_searchable : index > 0,
	});
`;
source += "namespace = namespace ? z ? `Hello??${ namespace }` : f : part;";
*/

try {
	var r = p.parse(source);
	print(r[10]);
} catch(e) {
	console.log(e);
	console.log(e.stack);
}

	//print(r[0].declarations[2].init.body.body[0].argument.arguments[1].body.body[0].argument);
	//print(r[9].statement.body[0]);
	//print(r[12].expression.arguments[2].body.body[0].declarations[0].init.body.body[3]);
	//print(r[25]);
	//print(r[26].declaration);
	//print(r[27].expression.right.consequent.consequent);

	//process.exit();
});

}
// }}}1

module.exports = jeefo;

// ignore:end
