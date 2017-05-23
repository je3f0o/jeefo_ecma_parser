/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_parser.js
* Created at  : 2017-05-23
* Updated at  : 2017-05-23
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

	parser = parser.copy();
	parser.tokenizer = tokenizer;

	parser.symbols.
	// Template literal {{{2
	literal_expression("TemplateLiteral", {
		protos : {
			type       : "Template",
			precedence : 21,
			initialize : function (tokens, index, scope) {
				this.type  = this.type;
				this.value = tokens[index].value;
				this.body  = scope.$new(tokens[index].children);
				this.start = tokens[index].start;
				this.end   = tokens[index].end;
			},
			null_denotation : function () {
				var body       = new Array(this.body.tokens.length),
					body_scope = this.body;

				for (var i = 0; i < body.length; ++i) {
					body_scope.advance();
					body[i] = body_scope.current_expression;
				}
				this.body = body;

				return this;
			},
		}
	}).

	declaration_expression("TemplateLiteral expression", {
		protos : {
			type       : "TemplateLiteral",
			precedence : 21,
			initialize : function (tokens, index, scope) {
				this.type       = this.type;
				this.expression = scope.$new(tokens[index].children);

				this.expression.advance();
				this.expression = this.expression.expression(0);

				this.start      = tokens[index].start;
				this.end        = tokens[index].end;
			},
		}
	}).

	declaration_expression("TemplateLiteral quasi string", {
		suffix : false,
		protos : {
			type       : "TemplateLiteralString",
			precedence : 21,
			initialize : function (tokens, index) {
				this.type  = this.type;
				this.value = tokens[index].value;
				this.start = tokens[index].start;
				this.end   = tokens[index].end;
			},
		}
	}).

	// Export default {{{2
	register_constructor("ExportDefaultDeclaration", function (start, end, declaration) {
		this.type        = this.type;
		this.declaration = declaration;
		this.start       = start;
		this.end         = end;
	}).

	register_statement("Identifier", {
		is     : function (token) { return token.name === "export"; },
		protos : {
			type       : "Export",
			initialize : function () {
				this.type = this.type;
			},
			on_register : function (handler, symbols) {
				handler.ExportDefaultDeclaration = symbols.constructors.ExportDefaultDeclaration;
			},
			statement_denotation : function (scope) {
				var start = scope.current_expression.start, declaration;
				scope.advance();

				if (scope.current_expression && scope.current_expression.name === "default") {
					scope.advance();

					if (scope.current_expression) {
						if (scope.current_expression.type === "FunctionExpression") {
							declaration      = scope.current_expression.null_denotation(scope);
							declaration.type = "FunctionDeclaration";
							return new this.ExportDefaultDeclaration(start, declaration.end, declaration);
						}

						declaration = scope.expression(0);
						if (scope.current_expression.type === "Terminator") {
							return new this.ExportDefaultDeclaration(start, scope.current_expression.end, declaration);
						}

						console.error("Unexpected delimiter");
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
*/
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
`;
source += "namespace = namespace ? z ? `${ namespace }.` : f : part;";

	var r = p.parse(source);

	//print(r[0].declarations[2].init.body.body[0].argument.arguments[1].body.body[0].argument);
	//print(r[9].statement.body[0]);
	//print(r[12].expression.arguments[2].body.body[0].declarations[0].init.body.body[3]);
	print(r[25]);
	print(r[26].declaration);

	//console.log(r);

	//process.exit();
});

}
// }}}1

module.exports = jeefo;

// ignore:end
