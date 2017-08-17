/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_parser.js
* Created at  : 2017-05-23
* Updated at  : 2017-08-16
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var Parser           = require("./parser"),
	es6_tokenizer    = require("./es6_tokenizer"),
	es6_symbol_table = require("./es5_symbol_table").clone();

var set_expression_statement = function (handler, symbols) {
	handler.ExpressionStatement  = symbols.constructors.StringLiteral.prototype.ExpressionStatement;
	handler.statement_denotation = symbols.constructors.StringLiteral.prototype.statement_denotation;
};

es6_symbol_table.
// Template literal {{{1
literal("BackTick", {
	protos : {
		type       : "Template",
		precedence : 21,
		initialize : function (token, scope) {
			var	streamer  = scope.tokenizer.streamer,
				character = streamer.next(),
				start     = token.end, i = 0, body = [];

			LOOP:
			while (character) {
				switch (character) {
					case '\\':
						streamer.move_right(1);
						character = streamer.next();
						break;
					case '$' :
						if (streamer.peek(streamer.cursor.index + 1) === '{') {
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
						} else {
							character = streamer.next();
						}
						break;
					case '`':
						if (streamer.cursor.index > start.index) {
							body[i++] = new this.TemplateLiteralString(
								start,
								streamer.get_cursor(),
								streamer.seek(start.index)
							);
						}
						break LOOP;
					default:
						character = streamer.next();
				}
			}

			this.type  = this.type;
			this.body  = body;
			this.start = token.start;
			this.end   = streamer.end_cursor();
		},
		on_register : function (handler, symbols) {
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

			set_expression_statement(handler, symbols);
		},
	}
}).

// Tagged Template literal {{{1
literal("Identifier", {
	is : function (token, scope) {
		return scope.tokenizer.streamer.peek(scope.tokenizer.streamer.cursor.index + 1) === '`';
	},
	protos : {
		type        : "TaggedTemplate",
		precedence  : 21,
		on_register : set_expression_statement,
		initialize  : function (token, scope) {
			this.type = this.type;
			this.tag  = scope.current_token;

			scope.advance();
			this.template = scope.current_expression;
			this.start    = this.tag.start;
			this.end      = this.template.end;
		},
	},
}).

// Arrow Function Expression without parenthesis {{{1
declaration_expression("Identifier", {
	is : function (token, scope) {
		var	tokenizer = scope.tokenizer,
			cursor    = tokenizer.streamer.get_cursor(),
			next      = tokenizer.next(true);

		// TODO: handle comments...

		tokenizer.streamer.cursor = cursor;

		return next && next.operator === "=>";
	},
	protos : {
		type        : "ArrowFunctionExpression",
		precedence  : 21,
		on_register : set_expression_statement,
		initialize  : function (token, scope) {
			//var	tokenizer = scope.tokenizer, next      = tokenizer.next(true);
			// TODO: handle comments...
			//while (next && next.type === "Comment") { next = tokenizer.next(); }

			scope.advance("=>");
			scope.advance('{');

			this.type       = this.type;
			this.parameters = [token];
			this.body       = scope.current_expression.statement(scope);
			this.start      = token.start;
			this.end        = this.body.end;
		},
	},
}).

// Arrow Function Expression with parenthesis {{{1
declaration_expression("Delimiter", {
	is : function (token, scope) {
		if (token.delimiter === '(') {
			var	tokenizer = scope.tokenizer,
				cursor    = tokenizer.streamer.get_cursor(),
				next      = tokenizer.next();

			while (next && next.delimiter !== ')') {
				next = tokenizer.next();
			}

			// TODO: handle comments...

			next                      = tokenizer.next(true);
			tokenizer.streamer.cursor = cursor;

			return next && next.operator === "=>";
		}
	},
	protos : {
		type        : "ArrowFunctionExpression",
		precedence  : 21,
		on_register : set_expression_statement,
		initialize  : function (token, scope) {
			scope.tokenizer.streamer.cursor.index -= 1;
			scope.advance_binary();

			this.type       = this.type;
			this.parameters = scope.current_expression.get_params(scope);

			scope.advance("=>");
			scope.advance('{');

			this.body  = scope.current_expression.statement(scope);
			this.start = token.start;
			this.end   = this.body.end;
		},
	},
}).

// Export default {{{1
statement("Identifier", {
	is     : function (token) { return token.name === "export"; },
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
					if (scope.current_token) {
						if (scope.current_token.delimiter === ';') {
							this.start = start;
							this.end   = scope.current_token.end;
							return this;
						} else {
							console.error("INVESTIGATE ME");
						}
					} else {
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
// }}}1

module.exports = new Parser(es6_tokenizer, es6_symbol_table);

// ignore:start
// Debug {{{1
if (require.main === module) {
	
	var p = module.exports, source;
	var print_substr = function (token) {
		console.log("-----------------------");
		console.log(source.slice(token.start.index, token.end.index));
		console.log("----------------------------------------");
	};
	var _print = function (token) {
		console.log("----------------------------------------");
		console.log(token);
		print_substr(token);
	};

	var fs       = require("fs");
	var path     = require("path");
	var filename = path.join(__dirname, "./es6_parser.js");
	source       = fs.readFileSync(filename, "utf8");
	/*
*/
	source = `
	export default function () {}
	export default a = 2;
	searchables.push({
		type          : header.type,
		model         : header.model,
		attrs         : { ngIf : \`configs.\${ header.model }.is_renderable\` },
		is_searchable : index > 0,
	});
	\`Hello??\${ namespace }\${ other }\`;
	jt\`hello\`;
	x => {

	};
	(x, y) => {
		x = y;
	};
	a + 1 
	return function (d) {
		return (d.values.length > 1) ? liner(d.values) : null;
	};
	do console.log(123)
		while (true)
	break b
	return z
	var a =
		b
	z = {
		// "wheel.zoom"      : { is_enabled : false },
		"dblclick.zoom"   : { is_enabled : false },
		// "mousewheel.zoom" : { is_enabled : false }
	}
`;

try {
	var r = p.parse(source);
	for (var i = 0; i < r.length; ++i) {
		_print(r[i]);
	}
	//print(r[13].expression.right);
} catch(e) {
	console.log(e);
	console.log(e.stack);
}

	//process.exit();
}
// }}}1
// ignore:end
