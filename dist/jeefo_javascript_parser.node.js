
"use strict";

module.exports = function (jeefo) {

/**
 * jeefo_javascript_parser : v0.0.7
 * Author                  : je3f0o, <je3f0o@gmail.com>
 * Homepage                : https://github.com/je3f0o/jeefo_javascript_parser
 * License                 : The MIT License
 * Copyright               : 2017
 **/
jeefo.use(function (jeefo) {

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2017-05-11
* Updated at  : 2017-05-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


var app = jeefo.module("jeefo_javascript_parser", ["jeefo_tokenizer"]);

// SymbolsTable {{{1
app.namespace("parser.SymbolsTable", [
	"object.assign",
	"JeefoObject",
], function (assign, JeefoObject) {

	var HandlerInterface = function (handler) {
		this.is    = handler.is;
		this.Token = function () {};
	};
	HandlerInterface.prototype = {
		assign  : assign,
		inherit : function (arg1, arg2) {
			this.assign(this.Token.prototype, arg1, arg2);
		},
	};

	/**
	 * @interface
	 *
	 * expression_default_prototype : {}
	 * statement_default_prototype  : {}
	 *
	 * register_expression({
	 *   precedence : number
	 *   initialize(symbol_token, tokens, index, scope)
	 *   suffix : any
	 *   protos : {}
	 * })
	 * register_statement({
	 *   precedence : number
	 *   initialize(statement_token, symbol_token, tokens, index, scope)
	 *   suffix : any
	 *   protos : {}
	 * })
	 *
	 * get_expression(scope, tokens, index)
	 * get_statement(scope, tokens, index)
	 */
	var SymbolsTable = function (constructors, expression_symbols, statement_symbols) {
		this.constructors       = constructors       || new JeefoObject();
		this.statement_symbols  = statement_symbols  || new JeefoObject();
		this.expression_symbols = expression_symbols || new JeefoObject();
	};

	SymbolsTable.prototype = {
		assign       : assign,
		Handler      : HandlerInterface,
		SymbolsTable : SymbolsTable,

		handler : function (handler) {
			return new this.Handler(handler);
		},

		sort_handler : function (a, b) {
			return a.Token.prototype.precedence - b.Token.prototype.precedence;
		},

		copy : function () {
			return new this.SymbolsTable(this.constructors.$copy(), this.expression_symbols.$copy(), this.statement_symbols.$copy());
		},

		register_constructor : function (type, Constructor, protos) {
			this.constructors[type] = Constructor;
			this.assign(Constructor.prototype, this.expression_default_prototypes, protos);
			Constructor.prototype.type = type;

			if (Constructor.prototype.on_register) {
				Constructor.prototype.on_register(Constructor.prototype, this);
			}

			return this;
		},

		register_expression : function (type, handler, suffix) {
			var _handler = this.handler(handler);
			_handler.inherit(this.expression_default_prototypes, handler.protos);

			if (suffix === void 0) {
				_handler.Token.prototype.type += "Expression";
			} else if (suffix) {
				_handler.Token.prototype.type += suffix;
			}
			this.constructors[_handler.Token.prototype.type] = _handler.Token;

			if (_handler.Token.prototype.on_register) {
				_handler.Token.prototype.on_register(_handler.Token.prototype, this);
			}

			if (this.expression_symbols.hasOwnProperty(type)) {
				this.expression_symbols[type].push(_handler);
				this.expression_symbols[type].sort(this.sort_handler);
			} else {
				this.expression_symbols[type] = [_handler];
			}

			return this;
		},

		register_statement : function (type, handler) {
			var _handler = this.handler(handler);
			_handler.inherit(this.statement_default_prototypes, handler.protos);

			if (handler.suffix === void 0) {
				_handler.Token.prototype.type += "Statement";
			} else if (handler.suffix) {
				_handler.Token.prototype.type += handler.suffix;
			}
			this.constructors[_handler.Token.prototype.type] = _handler.Token;

			if (_handler.Token.prototype.on_register) {
				_handler.Token.prototype.on_register(_handler.Token.prototype, this);
			}

			if (this.statement_symbols.hasOwnProperty(type)) {
				this.statement_symbols[type].push(_handler);
				this.statement_symbols[type].sort(this.sort_handler);
			} else {
				this.statement_symbols[type] = [_handler];
			}

			return this;
		},

		get_expression : function (scope, tokens, index) {
			var symbols = this.expression_symbols[tokens[index].type];

			if (! symbols) {
				return;
			}

			for (var i = symbols.length - 1; i >= 0; --i) {
				if (symbols[i].is && ! symbols[i].is(tokens[index], tokens, index)) {
					continue;
				}

				var token = new symbols[i].Token();

				if (token.initialize) {
					token.initialize(tokens, index, scope);
				}

				return token;
			}
		},

		get_statement : function (scope, tokens, index) {
			var token   = scope.current_expression,
				symbols = this.statement_symbols[token.type];

			if (! symbols) {
				return;
			}

			for (var i = symbols.length - 1; i >= 0; --i) {
				if (symbols[i].is && ! symbols[i].is(token, tokens, index)) {
					continue;
				}

				token = new symbols[i].Token();

				if (token.initialize) {
					token.initialize(tokens, index, scope);
				}

				return token;
			}
		},

		expression_default_prototypes : {
			type       : "Undefined",
			precedence : 0,
		},

		statement_default_prototypes : {
			type       : "Undefined",
			precedence : 3,
		},
	};

	return SymbolsTable;
});

// Javascript SymbolsTable {{{1
app.namespace("javascript.SymbolsTable", [
	"JeefoObject",
	"object.assign",
	"parser.SymbolsTable",
], function (JeefoObject, assign, SymbolsTable) {

	var JavascriptSymbolsTable = function (constructors, expression_symbols, delimiter_symbols, binary_expression_symbols) {
		this.constructors              = constructors              || new JeefoObject();
		this.expression_symbols        = expression_symbols        || new JeefoObject();
		this.delimiter_symbols         = delimiter_symbols         || new JeefoObject();
		this.binary_expression_symbols = binary_expression_symbols || new JeefoObject();
	};

	assign(JavascriptSymbolsTable.prototype, SymbolsTable.prototype, {
		SymbolsTable : JavascriptSymbolsTable,
		copy : function () {
			return new this.SymbolsTable(
				this.constructors.$copy(),
				this.expression_symbols.$copy(),
				this.delimiter_symbols.$copy(),
				this.binary_expression_symbols.$copy()
			);
		},
		// Delimiter symbols {{{3
		delimiter : function (character) {
			this.delimiter_symbols[character] = { type : "Delimiter", precedence : 0, character : character };
			return this;
		},
		// Binary Expression {{{3
		register_binary_expression : function (type, handler) {
			var _handler = this.handler(handler);
			_handler.inherit(handler.protos);
			_handler.Token.prototype.type += "Expression";

			this.constructors[_handler.Token.prototype.type] = _handler.Token;

			if (_handler.Token.prototype.on_register) {
				_handler.Token.prototype.on_register(_handler.Token.prototype, this);
			}

			if (this.binary_expression_symbols.hasOwnProperty(type)) {
				this.binary_expression_symbols[type].push(_handler);
				this.binary_expression_symbols[type].sort(this.sort_handler);
			} else {
				this.binary_expression_symbols[type] = [_handler];
			}

			return this;
		},
		get_binary_expression : function (scope, tokens, index) {
			var symbols = this.binary_expression_symbols[tokens[index].type], i = symbols.length - 1;

			for (; i >= 0; --i) {
				if (symbols[i].is && ! symbols[i].is(tokens[index], tokens, index)) {
					continue;
				}

				var token = new symbols[i].Token();

				if (token.initialize) {
					token.initialize(tokens, index, scope);
				}

				return token;
			}
		},
		// }}}3
		literal : function (token_type, handler) {
			handler.protos.precedence = 31;
			return this.register_expression(token_type, handler, "Literal");
		},
		statement : function (token_type, handler) {
			return this.register_expression(token_type, handler, "Statement");
		},
		unary_expression : function (token_type, handler) {
			return this.register_expression(token_type, handler, "Expression");
		},
		binary_expression : function (token_type, handler) {
			return this.register_binary_expression(token_type, handler);
		},
		declaration_expression : function (token_type, handler) {
			return this.register_expression(token_type, handler, handler.suffix);
		},
	});

	return JavascriptSymbolsTable;
});


// Javascript Scope {{{1
app.namespace("javascript.Scope", function () {
	var Scope = function (tokens, symbols) {
		this.tokens        = tokens;
		this.symbols       = symbols;
		this.token_index   = -1;
		this.tokens_length = tokens.length;
	};

	Scope.prototype = {
		Scope : Scope,

		$new : function (tokens) {
			return new this.Scope(tokens, this.symbols);
		},

		parse : function () {
			var statements = [];

			for (this.advance(); this.current_expression; this.advance()) {
				if (! this.current_expression.statement_denotation) {
					console.log("NOT FOUND STMT:", this.current_expression);
					console.log("NOT FOUND STMT protos:", this.current_expression.__proto__);
					console.log(this.current_token);
					process.exit();
				}
				statements.push(this.current_expression.statement_denotation(this));
			}

			return statements;
		},

		// Advance {{{3
		advance : function (expected_token_value) {
			this.token_index += 1;

			if (this.token_index < this.tokens_length) {
				this.current_token      = this.tokens[this.token_index];

				if (this.symbols.delimiter_symbols.hasOwnProperty(this.current_token.value)) {
					this.current_expression = this.symbols.delimiter_symbols[this.current_token.value];
				} else {
					this.current_expression = this.symbols.get_expression(this, this.tokens, this.token_index);
				}

				if (expected_token_value && expected_token_value !== this.current_token.value) {
					console.log("EXPECT TOKEN VALUE", expected_token_value, this.current_token);
					this.current_token.error_unexpected_token();
				}
			} else {
				this.current_token = this.current_expression = null;
			}
		},

		// Advance binary {{{3
		advance_binary : function () {
			this.token_index += 1;

			if (this.token_index < this.tokens_length) {
				this.current_token      = this.tokens[this.token_index];
				this.current_expression = this.symbols.delimiter_symbols[this.current_token.value];

				if (! this.current_expression) {
					this.current_expression = this.symbols.get_binary_expression(this, this.tokens, this.token_index);
				}
			} else {
				this.current_token = this.current_expression = null;
			}
		},
		// }}}3

		expression : function (right_precedence) {
			var left = this.current_expression;
			if (left.null_denotation) {
				left = left.null_denotation(this);
			}

			if (this.current_expression && ! this.current_expression.left_denotation &&
				this.current_expression.precedence > right_precedence) {
				this.advance_binary();
			}

			var l;
			while (this.current_expression && right_precedence < this.current_expression.precedence) {
				left = this.current_expression.left_denotation(left, this);
				if (l === left) {
					console.log(222222222222, left, this.current_token);
					process.exit();
				}
				l = left;
			}

			return left;
		},

	};

	return Scope;
});

// Javascript Parser {{{1
app.namespace("javascript.Parser", function () {
	var Parser = function (tokenizer, symbols, Scope) {
		this.Scope     = Scope;
		this.symbols   = symbols;
		this.tokenizer = tokenizer;
	};

	Parser.prototype = {
		Parser : Parser,
		copy   : function () {
			return new this.Parser(this.tokenizer.copy(), this.symbols.copy(), this.Scope);
		},
		parse : function (source_code) {
			var tokens = this.tokenizer.parse(source_code),
				scope  = new this.Scope(tokens, this.symbols);

			scope.code = source_code;

			return scope.parse(tokens);
		},
	};

	return Parser;
});
// }}}1

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2017-05-26
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


// ES5 Tokenizer {{{1
app.namespace("javascript.es5_tokenizer", ["tokenizer.Tokenizer"], function (Tokenizer) {
	var es5_tokenizer = new Tokenizer("ECMA Script 5");

	// Comment {{{2
	es5_tokenizer.regions.register({
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

	// Parenthesis {{{2
	register({
		type  : "Parenthesis",
		name  : "Parenthesis",
		start : '(',
		end   : ')',
		contains : [
			{ type : "Block"       } ,
			{ type : "Array"       } ,
			{ type : "String"      } ,
			{ type : "Comment"     } ,
			{ type : "Parenthesis" } ,
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '+', '*', '/', '%', // operator
					'&', '|', '^',
					'?', ':',
					'$', '_',
					'!', '\\',
					'=', '<', '>',
					'`', '.', ',', ';', // delimiters
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
					'-', '+', '*', '/', '%', // operator
					'&', '|', '^',
					'?', ':',
					'$', '_',
					'!', '\\',
					'=', '<', '>',
					'`', '.', ',', ';', // delimiters
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
			{ type : "Block"       } ,
			{ type : "Array"       } ,
			{ type : "String"      } ,
			{ type : "Comment"     } ,
			{ type : "Parenthesis" } ,
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '+', '*', '/', '%', // operator
					'&', '|', '^',
					'?', ':',
					'$', '_',
					'!', '\\',
					'=', '<', '>',
					'`', '.', ',', ';', // delimiters
				]
			},
		]
	});
	// }}}2

	return es5_tokenizer;
});
// }}}1

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_parser.js
* Created at  : 2017-05-22
* Updated at  : 2017-05-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


var COMMA_PRECEDENCE = 1;

// TODO: think about reserve, keywords...

// Javascript ES5 Symbols {{{1
app.namespace("javascript.es5_symbols", [
	"javascript.SymbolsTable",
], function (JavascriptSymbolsTable) {

	var symbols = new JavascriptSymbolsTable();

	// Is Named ? {{{2
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
	},

	// Initialize multi characters operator {{{2
	initialize_multi_characters_operator = function (tokens, index, scope) {
		this.type         = this.type;
		this.operator     = tokens[index].op;
		scope.token_index = tokens[index].index;
	},

	// Expression Statement {{{2
	ExpressionStatement = function (start, expression) {
		this.type       = this.type;
		this.expression = expression;
		this.start      = start;
	},
	cache_expression_statement = function (handler) {
		handler.ExpressionStatement = ExpressionStatement;
	},
	expression_statement = function (scope) {
		var statement = new this.ExpressionStatement(scope.current_token.start, scope.expression(0));

		if (scope.current_token) {
			if (scope.current_token.value === ';') {
				statement.end = scope.current_token.end;

//console.log(`[${ statement.type }]`, statement, scope.current_expression);
//process.exit();
				return statement;
			} else {
				console.log(22222222, statement, scope.current_expression, scope.current_token);
				scope.current_token.error_unexpected_token();
			}
		}

		statement.end = statement.expression.end;
		return statement;
	},

	// Bool literal {{{2
	bool = {
		type       : "Boolean",
		initialize : function (tokens, index) {
			this.type  = this.type;
			this.value = tokens[index].name;
			this.start = tokens[index].start;
			this.end   = tokens[index].end;
		},
		on_register          : cache_expression_statement,
		statement_denotation : expression_statement,
	},

	// Prefix unary {{{2
	prefix_unary = {
		type            : "Unary",
		precedence      : 16,
		initialize      : initialize_multi_characters_operator,
		null_denotation : function (scope) {
			var start = scope.current_token.start;
			scope.advance();

			this.argument  = scope.expression(16);
			this.is_prefix = true;
			this.start     = start;
			this.end       = this.argument.end;

			//console.log("UNARY", this, scope.current_expression);
			return this;
		},
		on_register          : cache_expression_statement,
		statement_denotation : expression_statement,
	},

	// Binary expression symbols {{{2
	binary = {
		initialize_multi_characters_operator : initialize_multi_characters_operator,
		protos : {
			initialize      : function () { this.type = this.type; },
			left_denotation : function (left, scope) {
				this.left  = left;
				scope.advance();
				this.right = scope.expression(this.precedence);
				this.start = left.start;
				this.end   = this.right.end;

//console.log(222222222, this, scope.current_expression);
//process.exit();
				return this;
			},
		},
		make : function (type, precedence) {
			this.protos.type       = type;
			this.protos.precedence = precedence;
			return this.protos;
		},
	},

	// Identifier protos {{{2
	identifier_protos = {
		type       : "Identifier",
		precedence : 2,
		initialize : function (tokens, index, scope) {
			var i = index + 1;

			this.type = this.type;
			this.name = tokens[index].value;

			LOOP:
			for (; i < tokens.length; ++i) {
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
			}

			this.start = tokens[index].start;
			this.end   = tokens[i - 1].end;

			this.precedence = 21;

			scope.token_index = i - 1;
		},
		on_register : function (handler) {
			handler.ExpressionStatement = ExpressionStatement;

			handler.LabeledStatement = function () {
				this.type = this.type;
			};
			handler.LabeledStatement.prototype.type = "LabeledStatement";
		},
		expression_statement : expression_statement,
		statement_denotation : function (scope) {
			var	id = scope.current_expression, index = scope.token_index;

			scope.advance();

			while (scope.current_expression && scope.current_expression.type === "Comment") {
				scope.advance();
			}

			// Labeled statement {{{3
			if (scope.current_token.value === ':') {
				var labeled_statement = new this.LabeledStatement();
				labeled_statement.label = id;

				scope.advance();
				labeled_statement.statement = scope.current_expression.statement_denotation(scope);

				labeled_statement.start = scope.tokens[index].start;
				labeled_statement.end   = labeled_statement.statement.end;

				return labeled_statement;
			}
			// }}}3

			// Expression statement
			scope.token_index        = index;
			scope.current_token      = scope.tokens[index];
			scope.current_expression = id;
			return this.expression_statement(scope);
		},
	};

	ExpressionStatement.prototype.type = "ExpressionStatement";
	// }}}2

	// Delimiter characters {{{2
	symbols.
		delimiter(':').
		delimiter(')').
		delimiter(']').
		delimiter('}').
		binary_expression("SpecialCharacter", {
			is     : function (token) { return token.value === ';'; },
			protos : {
				type       : "Delimiter",
				initialize : function () {
					this.type      = this.type;
					this.character = ';';
				},
				statement_denotation : function (scope) {
					this.start = scope.current_token.start;
					this.end   = scope.current_token.end;

					return this;
				},
			},
		}).
	// }}}2

	// Registering literal symbols {{{2
	// NULL literal {{{3
	literal("Identifier", {
		is     : is_named("null"),
		protos : {
			type       : "Null",
			initialize : function (tokens, index) {
				this.type  = this.type;
				this.start = tokens[index].start;
				this.end   = tokens[index].end;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// Array Literal {{{3
	literal("SpecialCharacter", {
		is     : function (token) { return token.value === '['; },
		protos : {
			type       : "Array",
			initialize : function (tokens, index, scope) {
				this.type     = this.type;
				this.elements = [];
				this.start    = tokens[index].start;

				var i = 0;

				scope.advance();

				while (scope.current_token && scope.current_token.value !== ']') {
					while (scope.current_expression && scope.current_expression.type === "Comment") {
						this.elements[i++] = scope.current_expression;
						scope.advance();
					}

					if (scope.current_token.value === ',') {
						this.elements[i++] = null;
					} else {
						this.elements[i++] = scope.expression(COMMA_PRECEDENCE);
					}

					if (scope.current_token.value === ',') {
						scope.advance();
					}
				}

				this.end = scope.current_token.end;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// Number literal {{{3
	literal("Number", {
		protos : {
			type              : "Number",
			EXPONENTIAL_REGEX : /^e|E\d+$/,
			initialize : function (tokens, index, scope) {
				this.type  = this.type;
				this.value = tokens[index].value;
				this.start = tokens[index].start;

				if (tokens[index + 1] && tokens[index + 1].value === '.' &&
					tokens[index + 1].start.index === tokens[index].end.index) {

					this.value += '.';
					scope.token_index = (index += 1);
				}

				if (tokens[index + 1] && tokens[index + 1].type === "Number" &&
					tokens[index + 1].start.index === tokens[index].end.index) {

					this.value += tokens[index + 1].value;
					scope.token_index = (index += 1);
				}

				if (tokens[index + 1] && tokens[index + 1].type === "Identifier" &&
					this.EXPONENTIAL_REGEX.test(tokens[index + 1].value) &&
					tokens[index + 1].start.index === tokens[index].end.index) {

					this.value += tokens[index + 1].value;
					scope.token_index = (index += 1);
				}

				this.end = tokens[index].end;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		}
	}).

	// String literal {{{3
	literal("SpecialCharacter", {
		is     : function (token) { return token.value === '"' || token.value === "'"; },
		protos : {
			type       : "String",
			initialize : function (tokens, index, scope) {
				this.type = this.type;

				for (var quote = tokens[index].value, i = index + 1; i < tokens.length; ++i) {
					if (tokens[i].value === '\\') {
						i += 1;
						continue;
					}

					if (tokens[i].value === quote) {
						scope.token_index = i;

						this.value = scope.code.substr(
							tokens[index].start.index + 1,
							tokens[i].end.index - tokens[index].start.index - 2
						);
						this.quote = quote;
						this.start = tokens[index].start;
						this.end   = tokens[i].end;

						return;
					}
				}
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// RegExp literal {{{3
	literal("SpecialCharacter", {
		is     : function (token) { return token.value === '/'; },
		protos : {
			type        : "RegExp",
			REGEX_FLAGS : "gimuy",
			initialize  : function (tokens, index, scope) {
				var flags   = '',
					i       = index + 1,
					pattern;

				while (tokens[i]) {
					if (tokens[i].value === '\\') {
						i += 2;
						continue;
					} else if (tokens[i].value === '/') {
						pattern = scope.code.substr(
							tokens[index].start.index + 1,
							tokens[i].end.index - tokens[index].start.index - 2
						);
						scope.token_index = i;
						break;
					}

					i += 1;
				}

				if (tokens[i + 1]                                     &&
					tokens[i + 1].start.index === tokens[i].end.index &&
					tokens[i + 1].type === "Identifier"
				) {
					scope.token_index += 1;
					var flags_value = tokens[scope.token_index].value;

					for (i = flags_value.length - 1; i >= 0; --i) {
						if (this.REGEX_FLAGS.indexOf(flags_value.charAt(i)) !== -1 && flags.indexOf(flags_value.charAt(i)) === -1) {
							flags += flags_value.charAt(i);
						} else {
							tokens[scope.token_index].error("Invalid regular expression flags");
						}
					}
				}

				this.regex = { pattern : pattern, flags : flags };
				this.start = tokens[index].start;
				this.end   = tokens[scope.token_index].end;

				scope.current_expression = this;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// Boolean literal {{{3
	literal("Identifier", { is : is_named("true") , protos : bool }).
	literal("Identifier", { is : is_named("false"), protos : bool }).
	// }}}3
	// }}}2
	
	// Registering declaration symbols {{{2
	// Comment declaration {{{3
	declaration_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			return token.value === '/' && tokens[index + 1]       &&
				tokens[index + 1].start.index === token.end.index &&
				(tokens[index + 1].value === '/' || tokens[index + 1].value === '*');
		},
		suffix : false,
		protos : {
			type       : "Comment",
			precedence : 40,
			initialize : function (tokens, index, scope) {
				var i = index + 1;
				this.type = this.type;

				if (tokens[i].value === '*') {
					i += 1;
					while (tokens[i]) {
						if (tokens[  i  ].value       === '*' &&
							tokens[i + 1].value       === '/' &&
							tokens[i + 1].start.index === tokens[i].end.index) {
							scope.token_index = i + 1;
							break;
						}
						++i;
					}
					this.comment = scope.code.substr(
						tokens[index].start.index + 2,
						tokens[scope.token_index].end.index - tokens[index].start.index - 4
					);
					this.is_multiline = true;
				} else {
					var line = tokens[index].start.line;
					while (tokens[i]) {
						if (! tokens[i + 1] || line < tokens[i + 1].start.line) {
							scope.token_index = i;
							break;
						}
						++i;
					}
					this.comment = scope.code.substr(
						tokens[index].start.index + 2,
						tokens[scope.token_index].end.index - tokens[index].start.index - 2
					);
					this.is_multiline = false;
				}

				this.start = tokens[index].start;
				this.end   = tokens[scope.token_index].end;
			},
			statement_denotation : function () { return this; },
		},
	}).

	// Identifier {{{3
	declaration_expression("Identifier", {
		suffix : false,
		protos : identifier_protos
	}).

	declaration_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '$' || token.value === '_'; },
		suffix : false,
		protos : identifier_protos
	}).
	// }}}3
	// }}}2

	// Registering Expressions and Statements {{{2
	// Sequence Expression {{{3
	binary_expression("SpecialCharacter", {
		is     : function (token) { return token.value === ','; },
		suffix : false,
		protos : {
			type            : "Sequence",
			precedence      : COMMA_PRECEDENCE,
			initialize      : binary.protos.initialize,
			left_denotation : function (left, scope) {
				var expressions = this.expressions = [left], i = 1;

				this.start = left.start;

				scope.advance();

				LOOP:
				while (scope.current_expression && scope.current_expression.precedence) {
					expressions[i++] = scope.expression(COMMA_PRECEDENCE);

					if (scope.current_expression && scope.current_expression.precedence) {
						if (scope.current_token.value === ',') {
							scope.advance();
						} else {
							scope.current_token.error_unexpected_token();
						}
					}
				}

				this.end = expressions[expressions.length - 1].end;

				return this;
			},
		},
	}).

	// Curly Brackets {{{3
	declaration_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '{'; },
		protos : {
			type       : "CurlyBrackets",
			precedence : 21,
			initialize : function (tokens, index, scope) {
				var token = scope.current_token;

				scope.advance();
				if (scope.current_token.value === '}') {
					scope.token_index   = index;
					scope.current_token = token;

					this.type = this.type;
					return;
				} else {
					scope.advance();

					while (scope.current_expression && scope.current_expression.type === "Comment") {
						scope.advance();
					}

					if (scope.current_token.value === ':') {
						scope.token_index   = index;
						scope.current_token = token;

						this.type = "ObjectLiteral";
						return;
					}
				}

				scope.token_index   = index;
				scope.current_token = token;
			},
			on_register : function (handler) {
				handler.Property = function (key, value) {
					this.type  = this.type;
					this.key   = key;
					this.value = value;
					this.start = key.start;
					this.end   = value.end;
				};
				handler.Property.prototype.type = "Property";
			},
			null_denotation : function (scope) {
				var i = 0, properties = this.properties = [], start = scope.current_token.start, key;

				scope.advance();

				while (scope.current_expression && scope.current_expression.type === "Comment") {
					properties[i++] = scope.current_expression;
					scope.advance();
				}

				while (scope.current_token && scope.current_token.value !== '}') {
					key = scope.expression(0);

					if (scope.current_token.value === ':') {
						scope.advance();
					} else {
						scope.current_token.error_unexpected_token();
					}

					properties[i++] = new this.Property(key, scope.expression(COMMA_PRECEDENCE));

					if (scope.current_token.value === ',') {
						scope.advance();
					}

					while (scope.current_expression && scope.current_expression.type === "Comment") {
						properties[i++] = scope.current_expression;
						scope.advance();
					}
				}

				this.start = start;
				this.end   = scope.current_token.end;

				scope.current_expression = this;

				return this;
			},
			statement : function (scope) {
				this.type = "BlockStatement";

				var i= 0, body = this.body = [];

				this.start = scope.current_token.start;

				for (scope.advance(); scope.current_expression && scope.current_expression.statement_denotation; scope.advance()) {
					body[i++] = scope.current_expression.statement_denotation(scope);
				}

				if (scope.current_token.value === '}') {
					this.end = scope.current_token.end;
				} else {
					scope.current_token.error_unexpected_token();
				}

				return this;
			},
			statement_denotation : function (scope) {
				if (this.type === "ObjectLiteral") {
					return this.null_denotation(scope);
				}
				return this.statement(scope);
			},
		},
	}).

	// Grouping (20) {{{3
	declaration_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '('; },
		protos : {
			type       : "Grouping",
			precedence : 20,
			initialize : binary.protos.initialize,
			get_params : function (scope) {
				var i = 0, params = [];

				scope.advance();

				while (scope.current_token && scope.current_token.value !== ')') {
					if (scope.current_expression.type === "Identifier") {
						params[i++] = scope.current_expression;
						scope.advance();
					} else {
						scope.current_token.error_unexpected_token();
					}

					if (! scope.current_token) {
						console.error("Unexpected end");
					}

					switch (scope.current_token.value) {
						case ')' :
							return params;
						case ',' :
							scope.advance();
							break;
						default:
							scope.current_token.error_unexpected_token();
					}
				}

				return params;
			},
			null_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance();
				this.expression = scope.expression(0);

				if (scope.current_token.value === ')') {
					this.start = start;
					this.end   = scope.current_token.end;

					scope.current_expression = this;
				} else {
					scope.current_token.error_unexpected_token();
				}

				return this;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// Member expression (19) {{{3
	binary_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '.'; },
		protos : {
			type       : "Member",
			precedence : 19,
			initialize : binary.protos.initialize,
			left_denotation : function (left, scope) {
				this.object = left;

				scope.advance();

				while (scope.current_expression.type === "Comment") {
					scope.advance();
				}

				if (scope.current_expression.type === "Identifier" || scope.current_token.type === "Identifier") {
					this.property    = scope.current_expression;
					this.is_computed = false;
					this.start       = left.start;
					this.end         = this.property.end;

					scope.advance_binary();
				} else {
					console.log(22222222, scope.current_expression, scope.current_token);
					scope.current_token.error_unexpected_token();
				}

				return this;
			},
		},
	}).

	// Member expression computed (19) {{{3
	binary_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '['; },
		protos : {
			type            : "Member",
			precedence      : 19,
			initialize      : binary.protos.initialize,
			left_denotation : function (left, scope) {
				this.object = left;

				scope.advance();
				this.property = scope.expression(0);

				this.is_computed = true;

				if (scope.current_token.value === ']') {
					this.start = left.start;
					this.end   = scope.current_token.end;

					scope.advance_binary();
				} else {
					scope.current_token.error_unexpected_token();
				}

				return this;
			},
		},
	}).

	// Call Expression (18) {{{3
	binary_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '('; },
		protos : {
			type       : "Call",
			precedence : 18,
			initialize : binary.protos.initialize,

			get_arguments : function (scope, call) {
				var i = 0, args = call["arguments"];

				scope.advance();

				LOOP:
				while (scope.current_token && scope.current_token.value !== ')') {
					args[i++] = scope.expression(COMMA_PRECEDENCE);

					if (! scope.current_token) {
						console.error("Unexpected end");
					}
					if (scope.current_token.value !== ',' && scope.current_token.value !== ')') {
						scope.advance();
					}

					switch (scope.current_token.value) {
						case ',' :
							scope.advance();
							break;
						case ')' :
							break LOOP;
						default:
						console.log(args[1], scope.current_expression);
							scope.current_token.error_unexpected_token();
					}
				}

				//console.log("ARGSSSSSSSS", args, scope.current_token);
				call.end = scope.current_token.end;
			},

			left_denotation : function (left, scope) {
				switch (left.type) {
					case "Identifier" :
					case "CallExpression" :
					case "MemberExpression" :
					case "FunctionExpression" :
						this.callee       = left;
						this["arguments"] = [];
						this.start        = left.start;

						this.get_arguments(scope, this);

						scope.advance_binary();
						return this;

					case "NewExpression" :
						this.get_arguments(scope, left);
						left.end = this.end;
						return left;

					case "GroupingExpression" :
						console.log("WHAAAAAAAAAAAAAAAT ??????");
						return left;
				}

				scope.current_token.error_unexpected_token();
			},
		}
	}).
	
	// New expression (18) {{{3
	unary_expression("Identifier", {
		is     : is_named("new"),
		protos : {
			type            : "New",
			precedence      : 18,
			initialize      : binary.protos.initialize,
			null_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance();
				this.callee       = scope.expression(18);
				this["arguments"] = [];
				this.start        = start;
				this.end          = this.callee.end;

				if (scope.current_expression && scope.current_expression.type === "CallExpression") {
					scope.current_expression.get_arguments(scope, this);
					this.precedence = 19;
				}

				scope.current_expression = this;

				return this;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// Unary suffix expression (17) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '+' :
				case '-' :
					if (tokens[index + 1] && tokens[index + 1].value === token.value &&
						tokens[index + 1].start.index === token.end.index) {
						token.op    = token.value + token.value;
						token.index = index + 1;
						return true;
					}
			}
		},
		protos : {
			type            : "Unary",
			precedence      : 17,
			initialize      : initialize_multi_characters_operator,
			left_denotation : function (left, scope) {
				this.argument  = left;
				this.is_prefix = false;
				this.start     = left.start;
				this.end       = scope.current_token.end;

				scope.advance_binary();

				//console.log(`[${ this.type }]`, this, scope.current_expression);
				return this;
			},
		},
	}).

	// Unary prefix expression (16) {{{3
	unary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '!' :
				case '~' :
					if (tokens[index + 1] &&
						tokens[index + 1].value !== '=' || tokens[index + 1].start.index > token.end.index) {

						token.op    = token.value;
						token.index = index;
						return true;
					}
					break;
				case '+' :
				case '-' :
					if (tokens[index + 1] && tokens[index + 1].value === token.value &&
						tokens[index + 1].start.index === token.end.index) {

						token.op    = token.value + token.value;
						token.index = index + 1;
						return true;
					} else if (token.value === '-') {
						token.op    = '-';
						token.index = index;
						return true;
					}
					break;
			}
		},
		protos : prefix_unary,
	}).

	// Void, Typeof and Delete unary expressions (16) {{{3
	unary_expression("Identifier", { is : is_named("void")  , protos : prefix_unary }).
	unary_expression("Identifier", { is : is_named("typeof"), protos : prefix_unary }).
	unary_expression("Identifier", { is : is_named("delete"), protos : prefix_unary }).

	// Exponentiation expression (15) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '*' && tokens[index + 1] &&
				tokens[index + 1].value === '*'          &&
				tokens[index + 1].start.index === token.end.index) {
				token.op    = "**";
				token.index = index + 1;
				return true;
			}
		},
		protos : {
			type            : "Exponentiation",
			precedence      : 15,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		}
	}).

	// Multiply, Division and Remainder expressions (14) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '*':
				case '/':
				case '%':
					return tokens[index + 1] &&
						(tokens[index + 1].value !== '=' || tokens[index + 1].start.index > token.end.index);
			}
		},
		protos : binary.make("Binary", 14),
	}).

	// Addition and Subtraction expressions (13) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '-' :
				case '+' :
					if ((tokens[index + 1].value !== '=' && tokens[index + 1].value !== token.value) ||
						tokens[index + 1].start.index > token.end.index) {
						
						token.op    = token.value;
						token.index = index;
						return true;
					}
			}
		},
		protos : binary.make("Binary", 13),
	}).

	// Bitwise shift expressions (12) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '>' :
					if (tokens[index + 1].value === '>' && tokens[index + 1].start.index === token.end.index) {
						if (tokens[index + 2].value === '>' && tokens[index + 2].start.index === tokens[index + 1].end.index) {
							token.op     = ">>>";
							token.index += 2;
							return true;
						}
						token.op    = ">>";
						token.index = index + 1;
						return true;
					}
					break;
				case '<' :
					if (tokens[index + 1].value === '<' && tokens[index + 1].start.index === token.end.index) {
						token.op     = "<<";
						token.index = index + 1;
						return true;
					}
					break;
			}
		},
		protos : {
			type            : "BitwiseShift",
			precedence      : 12,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Comparition expressions (11) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '<' :
				case '>' :
					if (tokens[index + 1] && tokens[index + 1].value === '=' &&
						tokens[index + 1].start.index === token.end.index) {

						token.op    = token.value + "=";
						token.index = index + 1;
					} else {
						token.op    = token.value;
						token.index = index;
					}
					return true;
			}
		},
		protos : {
			type            : "Comparision",
			precedence      : 11,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// In expression (11) {{{3
	binary_expression("Identifier", {
		is     : is_named("in"),
		protos : binary.make("In", 11),
	}).

	// Instanceof expression (11) {{{3
	binary_expression("Identifier", {
		is     : is_named("instanceof"),
		protos : binary.make("Instanceof", 11),
	}).

	// Equality expressions (10) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '=' :
				case '!' :
					if (tokens[index + 1] && tokens[index + 1].value === '=' &&
						tokens[index + 1].start.index === token.end.index) {

						if (tokens[index + 2] && tokens[index + 2].value === '=' &&
							tokens[index + 2].start.index === tokens[index + 1].end.index) {
							token.op    = token.value + "==";
							token.index = index + 2;
							return true;
						}

						token.op    = token.value + '=';
						token.index = index + 1;
						return true;
					}
					break;
			}
		},
		protos : {
			type            : "Equality",
			precedence      : 10,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Bitwise And expression (9) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '&') {
				if (tokens[index + 1]) {
					return (tokens[index + 1].value !== '&' && tokens[index + 1].value !== '=') ||
						tokens[index + 1].start.index > token.end.index;
				}
				return true;
			}
		},
		protos : binary.make("BitwiseAnd", 9),
	}).

	// Bitwise Xor expression (8) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '^') {
				if (tokens[index + 1]) {
					return tokens[index + 1].value !== '=' || tokens[index + 1].start.index > token.end.index;
				}
				return true;
			}
		},
		protos : binary.make("BitwiseXor", 8),
	}).

	// Bitwise Or expression (7) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '|') {
				if (tokens[index + 1]) {
					return (tokens[index + 1].value !== '|' && tokens[index + 1].value !== '=') ||
						tokens[index + 1].start.index > token.end.index;
				}
				return true;
			}
		},
		protos : binary.make("BitwiseOr", 7),
	}).

	// Logical And expression (6) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '&' && tokens[index + 1] &&
				tokens[index + 1].value       === '&' &&
				tokens[index + 1].start.index === token.end.index) {
				
				token.op    = "&&";
				token.index = index + 1;
				return true;
			}
		},
		protos : {
			type            : "LogicalAnd",
			precedence      : 6,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Logical Or expression (5) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '|' && tokens[index + 1] &&
				tokens[index + 1].value       === '|' &&
				tokens[index + 1].start.index === token.end.index) {
				
				token.op    = "||";
				token.index = index + 1;
				return true;
			}
		},
		protos : {
			type            : "LogicalOr",
			precedence      : 5,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Condition expression (4) {{{3
	binary_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '?'; },
		protos : {
			type            : "Conditional",
			precedence      : 4,
			initialize      : binary.protos.initialize,
			left_denotation : function (left, scope) {
				this.test = left;

				scope.advance();
				this.consequent = scope.expression(0);

				if (scope.current_token.value === ':') {
					scope.advance();
					this.alternate = scope.expression(COMMA_PRECEDENCE);
				} else {
					scope.current_token.error_unexpected_token();
				}

				this.start = left.start;
				this.end   = this.alternate.end;

				return this;
			}
		}
	}).

	// Assignment expression (3) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '=' :
					if (! tokens[index + 1] || tokens[index + 1].value !== '=' ||
						tokens[index + 1].start.index > token.end.index) {

						token.op    = '=';
						token.index = index;
						return true;
					}
					break;
				case '+' :
				case '-' :
				case '*' :
				case '/' :
				case '%' :
				case '&' :
				case '|' :
				case '^' :
					if (tokens[index + 1] && tokens[index + 1].value === '=' &&
						tokens[index + 1].start.index === token.end.index) {

						token.op    = token.value + '=';
						token.index = index + 1;
						return true;
					}
					break;
				case '*' :
					if (tokens[index + 1]                                 &&
						tokens[index + 1].value === '*'                   &&
						tokens[index + 1].start.index === token.end.index &&
						tokens[index + 2]                                 &&
						tokens[index + 2].value === '='                   &&
						tokens[index + 2].start.index === tokens[index + 1].end.index
					) {
						token.op    = "**=";
						token.index = index + 2;
						return true;
					}
					break;
				case '<'  :
					if (tokens[index + 1]                                 &&
						tokens[index + 1].value === '<'                   &&
						tokens[index + 1].start.index === token.end.index &&
						tokens[index + 2]                                 &&
						tokens[index + 2].value === '='                   &&
						tokens[index + 2].start.index === tokens[index + 1].end.index
					) {
						token.op    = "<<=";
						token.index = index + 2;
						return true;
					}
					break;
				case '>'  :
					if (tokens[index + 1]                                 &&
						tokens[index + 1].value === '>'                   &&
						tokens[index + 1].start.index === token.end.index &&
						tokens[index + 2]                                 &&
						tokens[index + 2].value === '='                   &&
						tokens[index + 2].start.index === tokens[index + 1].end.index
					) {
						token.op    = ">>=";
						token.index = index + 2;
						return true;
					}
					break;
				case ">>>=" :
					if (tokens[index + 1]                                             &&
						tokens[index + 1].value === '>'                               &&
						tokens[index + 1].start.index === token.end.index             &&
						tokens[index + 2]                                             &&
						tokens[index + 2].value === '>'                               &&
						tokens[index + 2].start.index === tokens[index + 1].end.index &&
						tokens[index + 3]                                             &&
						tokens[index + 3].value === '='                               &&
						tokens[index + 3].start.index === tokens[index + 2].end.index
					) {
						token.op    = ">>>=";
						token.index = index + 3;
						return true;
					}
			}
		},
		protos : {
			type            : "Assignment",
			precedence      : 3,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Function expression {{{3
	declaration_expression("Identifier", {
		is     : is_named("function"),
		protos : {
			type            : "Function",
			precedence      : 31,
			//initialize      : binary.protos.initialize,
			//null_denotation : function (scope) {
			initialize : function (tokens, index, scope) {
				this.type = this.type;

				var start = scope.current_token.start;

				scope.advance();
				if (scope.current_expression.type === "Identifier") {
					this.id = scope.current_expression;
					scope.advance('(');
				} else {
					this.id = null;
				}

				if (scope.current_token.value === '(') {
					this.parameters = scope.current_expression.get_params(scope);
				} else {
					scope.current_token.error_unexpected_token();
				}

				scope.advance();
				if (scope.current_token.value === '{') {
					this.body  = scope.current_expression.statement(scope);
					this.start = start;
					this.end   = this.body.end;
				} else {
					scope.current_token.error_unexpected_token();
				}

				//console.log(`[${ this.type }]`, this, scope.current_expression);

				scope.current_expression = this;

				return this;
			},
			statement_denotation : function () {
				this.type = "FunctionDeclaration";
				return this;
			},
		},
	});
	// }}}3
	// }}}2

	// Registering statements symbols {{{2
	// Empty statement {{{3
	symbols.statement("SpecialCharacter", {
		is     : function (token) { return token.value === ';'; },
		protos : {
			type                 : "Empty",
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				this.start = scope.current_token.start;
				this.end   = scope.current_token.end;

				return this;
			},
		},
	}).
	
	// Variable declaration statement {{{3
	declaration_expression("Identifier", {
		is     : is_named("var"),
		suffix : false,
		protos : {
			type        : "VariableDeclaration",
			precedence  : 31,
			on_register : function (handler) {
				handler.VariableDeclarator = function (token) {
					this.type  = this.type;
					this.id    = token;
					this.init  = null;
					this.start = token.start;
				};
				handler.VariableDeclarator.prototype.type = "VariableDeclarator";
			},
			initialize : function (tokens, index) {
				this.type         = this.type;
				this.declarations = [];
				this.start        = tokens[index].start;
			},
			statement_denotation : function (scope) {
				// init
				scope.advance();
				var declarator;

				while (scope.current_expression) {
					while (scope.current_expression.type === "Comment") {
						this.declarations.push(scope.current_expression);
						scope.advance();
					}

					if (scope.current_expression.type !== "Identifier") {
						scope.current_token.error();
					}

					declarator = this.declare(scope.current_expression);

					scope.advance_binary();
					if (scope.current_expression.operator === '=') {
						scope.advance();
						declarator.init = scope.expression(COMMA_PRECEDENCE);
					}
					declarator.end = declarator.init ? declarator.init.end : declarator.id.end;
					//console.log("VARIABLE DECLARATOR", declarator.init, scope.current_expression);

					if (scope.current_token) {
						switch (scope.current_token.value) {
							case ',' :
								scope.advance();
								break;
							case ';' :
								this.end = scope.current_token.end;
								return this;
							default:
								scope.current_token.error_unexpected_token();
						}
					}
				}

				return this;
			},

			declare : function (token) {
				token = new this.VariableDeclarator(token);
				this.declarations.push(token);
				return token;
			},
		}
	});

	// Return, Throw statement {{{3
	var initialize_argument = function (scope) {
		var start = scope.current_token.start;

		scope.advance();
		if (scope.current_token.value === ';') {
			this.argument = null;
		} else {
			this.argument = scope.expression(0);
			if (scope.current_token.value !== ';') {
				console.log('[' + this.type + "EXPECT ;]", scope.current_expression, this);
				scope.current_token.error_unexpected_token();
			}
		}

		this.start = start;
		this.end   = scope.current_token.end;
		//console.log(`[${ this.type } EXPECT ;]`, scope.current_expression, this);

		return this;
	};

	symbols.statement("Identifier", {
		is     : is_named("throw"),
		protos : {
			type                 : "Throw",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : initialize_argument,
		}
	}).
	statement("Identifier", {
		is     : is_named("return"),
		protos : {
			type                 : "Return",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : initialize_argument,
		}
	});

	// Continue, Break statement {{{3
	var break_statement = function (scope) {
		var start = scope.current_expression.start;
		this.type = this.type;

		scope.advance();
		if (scope.current_expression.type === "Identifier") {
			this.label = scope.current_expression;
			scope.advance(';');
		} else {
			this.label = null;
		}

		this.start = start;
		this.end   = scope.current_token.end;
		//console.log(`[${ this.type } EXPECT ;]`, scope.current_expression, this);

		return this;
	};

	symbols.statement("Identifier", {
		is     : is_named("break"),
		protos : {
			type                 : "Break",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : break_statement,
		},
	}).
	statement("Identifier", {
		is     : is_named("continue"),
		protos : {
			type                 : "Continue",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : break_statement,
		},
	}).

	// If statement {{{3
	statement("Identifier", {
		is     : is_named("if"),
		protos : {
			type                 : "If",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance('(');
				scope.advance();
				this.test = scope.expression(0);
				scope.advance();

				this.statement = scope.current_expression.statement_denotation(scope);

				var end_index = scope.token_index;
				scope.advance();
				if (scope.current_expression && scope.current_expression.name === "else") {
					scope.advance();

					this.alternate = scope.current_expression.statement_denotation(scope);
				} else {
					this.alternate    = null;
					scope.token_index = end_index;
				}

				this.start = start;
				this.end   = scope.tokens[scope.token_index].end;

				return this;
			},
		},
	}).

	// For statement {{{3
	statement("Identifier", {
		is     : is_named("for"),
		protos : {
			type       : "For",
			precedence : 31,
			initialize : binary.protos.initialize,
			on_register : function (handler, symbols) {
				handler.ForInStatement = function (left, right) {
					this.type  = this.type;
					this.left  = left;
					this.right = right;
				};
				handler.ForInStatement.prototype.type = "ForInStatement";

				handler.VariableDeclaration = symbols.constructors.VariableDeclaration;
			},
			statement_denotation : function (scope) {
				var self = this, start = scope.current_token.start;

				scope.advance('(');
				var index = scope.token_index;
				scope.advance();
				if (scope.current_expression && scope.current_expression.type === "VariableDeclaration") {
					var left = new self.VariableDeclaration();

					left.type         = left.type;
					left.declarations = [];
					left.start        = scope.current_expression.start;

					scope.advance();
					if (scope.current_expression.type === "Identifier") {
						left.declare(scope.current_expression);
					
						scope.advance_binary();
						if (scope.current_expression && scope.current_expression.type === "InExpression") {
							scope.advance();
							var right = scope.expression(0);

							self = new self.ForInStatement(left, right);
						} else if (scope.current_expression.operator === '=') {
							scope.token_index = index;
							scope.advance();
							self.init = scope.current_expression.statement_denotation(scope);
						} else {
							scope.current_token.error_unexpected_token();
						}
					} else {
						scope.current_token.error_unexpected_token();
					}
				} else if (scope.current_token.value === ';') {
					self.init = null;
				} else {
					self.init = scope.expression(0);
				}

				if (scope.current_token.value === ';') {
					scope.advance();

					if (scope.current_token.value === ';') {
						self.test = null;
					} else {
						self.test = scope.expression(0);
					}

					scope.advance();
					self.update = scope.expression(0);

				} else if (self.init && self.init.type === "InExpression") {
					self = new self.ForInStatement(self.init.left, self.init.right);
				} else if (self.type !== "ForInStatement") {
					scope.current_token.error_unexpected_token();
				}

				if (scope.current_token.value === ')') {
					scope.advance();
				}

				self.statement = scope.current_expression.statement_denotation(scope);

				self.start = start;
				self.end   = scope.current_token.end;

				return self;
			},
		},
	}).

	// While statement {{{3
	statement("Identifier", {
		is     : is_named("while"),
		protos : {
			type       : "While",
			precedence : 31,
			initialize : binary.protos.initialize,
			statement_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance('(');
				scope.advance();
				this.test = scope.expression(0);

				if (scope.current_token.value === ')') {
					scope.advance();
				} else {
					scope.current_token.error_unexpected_token();
				}

				this.statement = scope.current_expression.statement_denotation(scope); 

				this.start = start;
				this.end   = this.statement.end;

				return this;
			},
		},
	}).

	// Do While statement {{{3
	statement("Identifier", {
		is     : is_named("do"),
		protos : {
			type                 : "DoWhile",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance();

				this.statement = scope.current_expression.statement_denotation(scope);

				scope.advance("while");
				scope.advance('(');
				scope.advance();

				this.test = scope.expression(0);

				if (scope.current_token.value === ')') {
					scope.advance();
				}

				if (scope.current_token.value === ';') {
					this.start = start;
					this.end   = scope.current_token.end;
				} else {
					scope.current_token.error_unexpected_token();
				}

				return this;
			},
		},
	}).

	// Switch statement {{{3
	statement("Identifier", {
		is     : is_named("switch"),
		protos : {
			type                 : "Switch",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var start = scope.current_expression.start;

				scope.advance('(');
				scope.advance();
				this.discriminant = scope.expression(0, true);

				if (scope.current_token.value === ')') {
					scope.advance('{');
					this.cases = [];
					this.parse_cases(scope, this.cases);
				} else {
					scope.current_token.error_unexpected_token();
				}

				this.start = start;
				this.end   = scope.current_token.end;

				return this;
			},
			on_register : function (handler) {
				handler.SwitchCase = function () {
					this.type = this.type;
				};
				handler.SwitchCase.prototype.type = "SwitchCase";

				handler.DefaultCase = function () {
					this.type       = this.type;
					this.statements = [];
				};
				handler.DefaultCase.prototype.type = "DefaultCase";
			},
			parse_cases : function (scope, cases) {
				var _case, start;

				scope.advance();

				while (scope.current_token.value !== '}') {
					start = scope.current_token.start;

					switch (scope.current_expression.name) {
						case "case" :
							_case = new this.SwitchCase();
							scope.advance();
							_case.test = scope.expression(0);

							if (scope.current_token.value !== ':') {
								scope.current_token.error_unexpected_token();
							}
							break;
						case "default" :
							_case = new this.DefaultCase();
							scope.advance(':');
							break;
						default:
							scope.current_token.error();
					}

					_case.statements = [];
					_case.start      = start;
					_case.end        = scope.current_token.end;

					scope.advance();
					while (scope.current_expression) {
						if (! scope.current_expression               ||
							scope.current_token.value     === '}'    ||
							scope.current_expression.name === "case" ||
							scope.current_expression.name === "default") {
							break;
						}

						_case.statements.push(scope.current_expression.statement_denotation(scope));
						scope.advance();
					}

					if (_case.statements.length) {
						_case.end = _case.statements[_case.statements.length - 1].end;
					}

					cases.push(_case);
				}
			}
		}
	}).

	// Try statement {{{3
	statement("Identifier", {
		is     : is_named("try"),
		protos : {
			type                 : "Try",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var start = scope.current_token.start, catch_end_index;

				scope.advance('{');
				this.block = scope.current_expression.statement(scope);

				scope.advance();
				if (scope.current_expression.name === "catch") {
					this.handler    = this._catch(scope);
					catch_end_index = scope.token_index;
					scope.advance();
				} else {
					this.handler = null;
				}

				if (scope.current_expression.name === "finally") {
					scope.advance('{');
					this.finalizer = scope.current_expression.statement(scope);
				} else if (catch_end_index) {
					this.finalizer      = null;
					scope.token_index   = catch_end_index;
					scope.current_token = scope.tokens[catch_end_index];
				} else {
					console.error("Missing catch or finally after try");
				}

				this.start = start;
				this.end   = scope.current_token.end;

				return this;
			},
			on_register : function (handler) {
				handler.CatchClause = function () {
					this.type = this.type;
				};
				this.CatchClause.prototype.type = "CatchClause";
			},
			_catch : function (scope) {
				var _catch = new this.CatchClause(),
					start  = scope.current_expression.start;

				scope.advance('(');

				scope.advance();
				_catch.param = scope.expression(COMMA_PRECEDENCE);

				if (scope.current_token.value === ')') {
					scope.advance('{');
					_catch.body  = scope.current_expression.statement(scope);
					_catch.start = start;
					_catch.end   = _catch.body.end;
				}

				return _catch;
			},
		},
	});
	// }}}3
	// }}}2

	return symbols;
}).

// ES5 parser {{{1
namespace("javascript.ES5_parser", [
	"javascript.Scope",
	"javascript.Parser",
	"javascript.es5_tokenizer",
	"javascript.es5_symbols",
], function (Scope, Parser, tokenizer, symbols) {
	return new Parser(tokenizer, symbols, Scope);
});
// }}}1

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_tokenizer.js
* Created at  : 2017-05-23
* Updated at  : 2017-05-26
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


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

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_parser.js
* Created at  : 2017-05-23
* Updated at  : 2017-05-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


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

});

return jeefo

};