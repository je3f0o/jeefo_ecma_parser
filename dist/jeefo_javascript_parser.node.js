
"use strict";

module.exports = function (jeefo) {

/**
 * jeefo_javascript_parser : v0.0.9
 * Author                  : je3f0o, <je3f0o@gmail.com>
 * Homepage                : https://github.com/je3f0o/jeefo_javascript_parser
 * License                 : The MIT License
 * Copyright               : 2017
 **/
jeefo.use(function (jeefo) {

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2017-05-11
* Updated at  : 2017-07-22
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


var app = jeefo.module("jeefo_javascript_parser", ["jeefo.tokenizer"]);

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
	 *
	 * register_expression({
	 *   precedence : number
	 *   initialize(symbol_token, tokens, index, scope)
	 *   suffix : any
	 *   protos : {}
	 * })
	 *
	 * get_expression(scope, tokens, index)
	 */
	var SymbolsTable = function (constructors, expression_symbols) {
		this.constructors       = constructors       || new JeefoObject();
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
			return new this.SymbolsTable(this.constructors.$copy(), this.expression_symbols.$copy());
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

		get_expression : function (scope) {
			var symbols = this.expression_symbols[scope.current_token.type];

			if (! symbols) {
				return;
			}

			for (var i = symbols.length - 1; i >= 0; --i) {
				if (symbols[i].is && ! symbols[i].is(scope.current_token, scope)) {
					continue;
				}

				var token = new symbols[i].Token();

				if (token.initialize) {
					token.initialize(scope.current_token, scope);
				}

				return token;
			}
		},

		expression_default_prototypes : {
			type       : "Undefined",
			precedence : 0,
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
		get_binary_expression : function (scope) {
			var symbols = this.binary_expression_symbols[scope.current_token.type];

			if (! symbols) {
				return;
			}

			for (var i = symbols.length - 1; i >= 0; --i) {
				if (symbols[i].is && ! symbols[i].is(scope.current_token, scope)) {
					continue;
				}

				var token = new symbols[i].Token();

				if (token.initialize) {
					token.initialize(scope.current_token, scope);
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
	var Scope = function (symbols, tokenizer) {
		this.symbols   = symbols;
		this.tokenizer = tokenizer;
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
		advance : function (expected_token_property, expected_token_value) {
			this.current_token = this.tokenizer.next();

			if (this.current_token) {

				if (this.symbols.delimiter_symbols.hasOwnProperty(this.current_token.delimiter)) {
					this.current_expression = this.symbols.delimiter_symbols[this.current_token.value];
				} else {
					this.current_expression = this.symbols.get_expression(this);
				}

				if (expected_token_value) {
					if (expected_token_value !== this.current_token[expected_token_property]) {
						console.log("EXPECT TOKEN VALUE", expected_token_value, this.current_token);
						this.current_token.error_unexpected_token();
					}
				} else if (expected_token_property && expected_token_property !== this.current_token.value) {
					console.log("EXPECT TOKEN VALUE", expected_token_property, this.current_token);
					this.current_token.error_unexpected_token();
				}
			} else {
				this.current_expression = null;
			}
		},

		// Advance binary {{{3
		advance_binary : function () {
			this.current_token = this.tokenizer.next();

			if (this.current_token) {
				if (this.symbols.delimiter_symbols.hasOwnProperty(this.current_token.delimiter)) {
					this.current_expression = this.symbols.delimiter_symbols[this.current_token.value];
				} else {
					this.current_expression = this.symbols.get_binary_expression(this);
				}
			} else {
				this.current_expression = null;
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
			var scope = new this.Scope(this.symbols, this.tokenizer);
			this.tokenizer.init(source_code, 4);

			return scope.parse();
		},
	};

	return Parser;
});
// }}}1

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2017-06-05
* Author      : jeefo
* Purpose     :
* Description :
*
* Precedence Table
* 0  - 10 : Identifier and Literals
* 10 - 20 : Delimiters
* 20 - 30 : Operators
* 40      : Comment
* 50      : Division operator
*
_._._._._._._._._._._._._._._._._._._._._.*/


// ES5 Tokenizer {{{1
app.namespace("javascript.es5_tokenizer", ["tokenizer.Tokenizer"], function (Tokenizer) {
	var es5_tokenizer = new Tokenizer();

	var DELIMITERS = [
		'.', ',',
		'/', '?',
		';', ':',
		"'", '"',
		'`', '~',
		'-',
		'=', '+',
		'\\', '|', 
		'(', ')',
		'[', ']',
		'{', '}',
		'<', '>',
		'!', '@', '#', '%', '^', '&', '*',
	].join('');

	es5_tokenizer.
	// Delimiter {{{2
	register({
		is : function (character) {
			switch (character) {
				case ':' : case ';' :
				case ',' : case '?' :
				case '(' : case ')' :
				case '[' : case ']' :
				case '{' : case '}' :
					return true;
			}
		},
		protos : {
			type       : "Delimiter",
			precedence : 10,
			initialize : function (character, streamer) {
				this.type  = this.type;
				this.value = this.delimiter = character;
				this.start = streamer.get_cursor();
				this.end   = streamer.end_cursor();
			},
		}
	}).

	// Comment {{{2
	register({
		is : function (character, streamer) {
			if (character === '/') {
				switch (streamer.peek(streamer.cursor.index + 1)) { case '*' : case '/' : return true; }
			}
		},
		protos : {
			type       : "Comment",
			precedence : 40,
			initialize : function (character, streamer) {
				var start = streamer.get_cursor(), start_index, end_index, is_trimmed;

				this.type = this.type;

				if (streamer.next() === '*') {
					var cursor  = streamer.cursor;
					character   = streamer.next(true);
					start_index = streamer.cursor.index;

					while (character) {
						end_index = streamer.cursor.index;

						if (character === '*' && streamer.peek(cursor.index + 1) === '/') {
							streamer.next();
							break;
						}
						character = streamer.next(true);

						if (! is_trimmed) {
							start_index = streamer.cursor.index;
							is_trimmed  = true;
						}
					}

					this.comment      = streamer.seek(start_index, end_index);
					this.is_multiline = true;
				} else {
					character   = streamer.next();
					start_index = streamer.cursor.index;

					while (character && character !== '\n') {
						character = streamer.next();

						if (! is_trimmed) {
							start_index = streamer.cursor.index;
							is_trimmed  = true;
						}
					}

					this.comment      = streamer.seek(start_index);
					this.is_multiline = false;
				}

				this.start = start;
				this.end   = streamer.get_cursor();
			},
		}
	}).

	// Identifier {{{2
	register({
		protos : {
			type       : "Identifier",
			DELIMITERS : DELIMITERS,
			initialize : function (character, streamer) {
				var start = streamer.get_cursor(), end = {};

				while (character && character > ' ' && this.DELIMITERS.indexOf(character) === -1) {
					streamer.assign(end, streamer.cursor);
					character = streamer.next();
				}

				this.type  = this.type;
				this.name  = streamer.seek(start.index);
				this.start = start;
				this.end   = streamer.get_cursor();

				streamer.cursor = end;
			},
		},
	}).

	// Number Literal {{{2
	register({
		is     : function (character) { return character >= '0' && character <= '9'; },
		protos : {
			type       : "Number",
			precedence : 2,
			initialize : function (character, streamer) {
				var start = streamer.get_cursor(), end = {};

				while (character && character >= '0' && character <= '9') {
					streamer.assign(end, streamer.cursor);
					character = streamer.next();
				}

				if (character && character === '.') {
					character = streamer.next();
					while (character && character >= '0' && character <= '9') {
						streamer.assign(end, streamer.cursor);
						character = streamer.next();
					}
				}

				if (character && (character === 'e' || character === 'E')) {
					character = streamer.next();
					while (character && character >= '0' && character <= '9') {
						streamer.assign(end, streamer.cursor);
						character = streamer.next();
					}
				}

				this.type  = this.type;
				this.value = streamer.seek(start.index);
				this.start = start;
				this.end   = streamer.get_cursor();

				streamer.cursor = end;
			},
		},
	}).

	// String Literal {{{2
	register({
		is     : function (character) { return character === '"' || character === "'"; },
		protos : {
			type       : "String",
			precedence : 1,
			initialize : function (character, streamer) {
				var start = streamer.get_cursor(), quote = character, start_index;

				character   = streamer.next();
				start_index = streamer.cursor.index;

				while (character && character >= ' ' && character !== quote) {
					if (character === '\\') {
						streamer.next();
					}
					character = streamer.next();
				}

				this.type  = this.type;
				this.quote = quote;
				this.value = streamer.seek(start_index);
				this.start = start;
				this.end   = streamer.end_cursor();
			},
		},
	}).

	// Operator {{{2
	register({
		is : function (character) {
			switch (character) {
				// Member operator
				case '.' :
				// Comparation operators
				case '!' :
				case '<' :
				case '>' :
				// Assignment and math operators
				case '=' :
				case '+' :
				case '-' :
				case '*' :
				case '%' :
				// Binary operators
				case '&' :
				case '|' :
				case '^' :
				case '~' :
					return true;
			}
		},
		protos : {
			type       : "Operator",
			precedence : 20,
			initialize : function (character, streamer) {
				var start = streamer.get_cursor(), cursor = streamer.cursor;

				switch (character) {
					case '!' :
					case '=' :
						if (streamer.peek(cursor.index + 1) === '=') {
							streamer.move_right(1);

							if (streamer.peek(cursor.index + 1) === '=') {
								streamer.move_right(1);
							}
						}
						break;
					case '+' :
					case '-' :
					case '&' :
					case '|' :
						switch (streamer.peek(cursor.index + 1)) {
							case '='       :
							case character :
								streamer.move_right(1);
						}
						break;
					case '/' :
					case '%' :
					case '^' :
						if (streamer.peek(cursor.index + 1) === '=') {
							streamer.move_right(1);
						}
						break;
					case '*' :
						if (streamer.peek(cursor.index + 1) === '*') {
							streamer.move_right(1);
						}
						if (streamer.peek(cursor.index + 1) === '=') {
							streamer.move_right(1);
						}
						break;
					case '<' :
						if (streamer.peek(cursor.index + 1) === '<') {
							streamer.move_right(1);
						}
						if (streamer.peek(cursor.index + 1) === '=') {
							streamer.move_right(1);
						}
						break;
					case '>'  :
						if (streamer.peek(cursor.index + 1) === '>') {
							streamer.move_right(1);

							if (streamer.peek(cursor.index + 1) === '>') {
								streamer.move_right(1);
							}

						}
						if (streamer.peek(cursor.index + 1) === '=') {
							streamer.move_right(1);
						}
				}

				this.type     = this.type;
				this.operator = streamer.seek(start.index, cursor.index + 1);
				this.start    = start;
				this.end      = streamer.end_cursor();
			},
		},
	}).

	// Slash {{{2
	register({
		is : function (character, streamer) {
			if (character === '/') {
				switch (streamer.peek(streamer.cursor.index + 1)) { case '*' : case '/' : return false; }
				return true;
			}
		},
		protos : {
			type       : "Slash",
			precedence : 50,
			DELIMITERS : DELIMITERS,
			initialize : function (character, streamer) {
				this.type  = this.type;
				this.start = streamer.get_cursor();
				this.end   = streamer.end_cursor();
			},
		},
	});
	// }}}2

	return es5_tokenizer;
});
// }}}1

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_parser.js
* Created at  : 2017-05-22
* Updated at  : 2017-07-16
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

	// Initialize multi symbols operator {{{2
	var initialize_multi_characters_operator = function (token) {
		this.type     = this.type;
		this.operator = token.operator;
	},

	// Expression Statement {{{2
	ExpressionStatement = function (expression, ASI, start, end) {
		this.type       = this.type;
		this.expression = expression;
		this.ASI        = ASI;
		this.start      = start;
		this.end        = end;
	},
	cache_expression_statement = function (handler) {
		handler.ExpressionStatement = ExpressionStatement;
	},
	expression_statement = function (scope) {
		var start      = scope.current_expression.start,
			expression = scope.expression(0);

		if (! scope.current_token) {
			return new this.ExpressionStatement(expression, true, start, expression.end);
		} else if (expression.end.column === 0 || scope.current_token.start.line > expression.end.line) {
			scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
			return new this.ExpressionStatement(expression, true, start, expression.end);
		} else if (scope.current_token.delimiter === ';') {
			return new this.ExpressionStatement(expression, false, start, scope.current_token.end);
		}

		console.log("ExpressionStatement", expression, scope.current_expression, scope.current_token);
		scope.current_token.error_unexpected_token();
	},

	// Comment {{{2
	comment = {
		suffix : false,
		protos : {
			type       : "Comment",
			precedence : 40,
			initialize : function (token) {
				this.type         = "Comment";
				this.comment      = token.comment;
				this.is_multiline = token.is_multiline;
				this.start        = token.start;
				this.end          = token.end;
			},
			left_denotation : function (left, scope) {
				while (scope.current_expression && scope.current_expression.type === "Comment") {
					scope.advance_binary();
				}
				return left;
			},
			statement_denotation : function () { return this; },
		},
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
				//console.log(scope.current_token);
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
	};
	ExpressionStatement.prototype.type = "ExpressionStatement";
	// }}}2

	// Delimiter characters {{{2
	symbols.
		delimiter(':').
		delimiter(')').
		delimiter(']').
		delimiter('}').
		binary_expression("Delimiter", {
			is     : function (token) { return token.delimiter === ';'; },
			protos : {
				type       : "Delimiter",
				initialize : function () {
					this.type      = this.type;
					this.delimiter = ';';
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
		is     : function (token) { return token.value === "null"; },
		protos : {
			type       : "Null",
			initialize : function (token) {
				this.type  = this.type;
				this.start = token.start;
				this.end   = token.end;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// Array Literal {{{3
	literal("Delimiter", {
		is     : function (token) { return token.delimiter === '['; },
		protos : {
			type       : "Array",
			initialize : function (token, scope) {
				this.type     = this.type;
				this.elements = [];
				this.start    = token.start;

				var i = 0;

				scope.advance();

				while (scope.current_token && scope.current_token.delimiter !== ']') {
					while (scope.current_expression && scope.current_expression.type === "Comment") {
						this.elements[i++] = scope.current_expression;
						scope.advance();
					}

					if (scope.current_token.delimiter === ',') {
						this.elements[i++] = null;
					} else {
						this.elements[i++] = scope.expression(COMMA_PRECEDENCE);
					}

					if (scope.current_token.delimiter === ',') {
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
			type       : "Number",
			initialize : function (token) {
				this.type  = this.type;
				this.value = token.value;
				this.start = token.start;
				this.end   = token.end;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		}
	}).

	// String literal {{{3
	literal("String", {
		protos : {
			type       : "String",
			initialize : function (token) {
				this.type  = this.type;
				this.quote = token.quote;
				this.value = token.value;
				this.start = token.start;
				this.end   = token.end;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// RegExp literal {{{3
	literal("Slash", {
		protos : {
			type        : "RegExp",
			REGEX_FLAGS : "gimuy",
			initialize  : function (token, scope) {
				var streamer    = scope.tokenizer.streamer,
					start       = streamer.get_cursor(),
					character   = streamer.next(),
					start_index = streamer.cursor.index, end, flags = '', pattern;

				while (character && character > ' ' && character !== '/') {
					if (character === '\\') {
						streamer.next();
					}
					character = streamer.next();
				}

				pattern = streamer.seek(start_index);
				end = streamer.get_cursor();

				character = streamer.next();
				while (character && character > ' ') {
					if (this.REGEX_FLAGS.indexOf(character) !== -1 && flags.indexOf(character) === -1) {
						flags    += character;
						streamer.assign(end, streamer.cursor);
						character = streamer.next();
					} else if (token.DELIMITERS.indexOf(character) !== -1) {
						break;
					} else {
						token.error("Invalid regular expression flags");
					}
				}

				streamer.cursor = end;

				this.type  = this.type;
				this.regex = { pattern : pattern, flags : flags };
				this.start = start;
				this.end   = streamer.end_cursor();

				scope.current_expression = this;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).

	// Boolean literal {{{3
	literal("Identifier", {
		is : function (token) {
			switch (token.value) { case "true" : case "false" :
				return true;
			}
		},
		protos : {
			type       : "Boolean",
			initialize : function (token) {
				this.type  = this.type;
				this.value = token.value;
				this.start = token.start;
				this.end   = token.end;
			},
			on_register          : cache_expression_statement,
			statement_denotation : expression_statement,
		},
	}).
	// }}}3
	// }}}2
	
	// Registering declaration symbols {{{2
	// Comment declaration {{{3
	binary_expression     ("Comment", comment).
	declaration_expression("Comment", comment).

	// Identifier {{{3
	declaration_expression("Identifier", {
		suffix : false,
		protos : {
			type       : "Identifier",
			precedence : 2,
			initialize : function (token) {
				this.type  = this.type;
				this.name  = token.name;
				this.start = token.start;
				this.end   = token.end;

				this.precedence = 21;
			},
			on_register : function (handler) {
				handler.ExpressionStatement = ExpressionStatement;

				handler.LabeledStatement = function (label) {
					this.type  = this.type;
					this.label = label;
				};
				handler.LabeledStatement.prototype.type = "LabeledStatement";
			},
			expression_statement : expression_statement,
			statement_denotation : function (scope) {
				var	tokenizer = scope.tokenizer,
					cursor    = tokenizer.streamer.get_cursor(),
					next      = tokenizer.next();

				while (next && next.type === "Comment") {
					next = tokenizer.next();
				}

				// Labeled statement {{{4
				if (next && next.delimiter === ':') {
					var labeled_statement = new this.LabeledStatement(scope.current_expression);

					scope.advance();
					labeled_statement.statement = scope.current_expression.statement_denotation(scope);

					labeled_statement.start = labeled_statement.label.start;
					labeled_statement.end   = labeled_statement.statement.end;

					return labeled_statement;
				}
				// }}}4

				// Expression statement
				tokenizer.streamer.cursor = cursor;
				return this.expression_statement(scope);
			},
		},
	}).
	// }}}3
	// }}}2

	// Registering Expressions and Statements {{{2
	// Sequence Expression {{{3
	binary_expression("Delimiter", {
		is     : function (token) { return token.delimiter === ','; },
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
						if (scope.current_token.delimiter === ',') {
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
	declaration_expression("Delimiter", {
		is     : function (token) { return token.delimiter === '{'; },
		suffix : false,
		protos : {
			type       : "CurlyBrackets",
			precedence : 21,
			initialize : function (token, scope) {
				var streamer = scope.tokenizer.streamer,
					cursor   = streamer.get_cursor();

				scope.advance();
				
				if (scope.current_token.delimiter !== '}') {
					if (scope.current_expression && scope.current_expression.type === "Comment") {
						scope.advance();
						
						while (scope.current_expression && scope.current_expression.type === "Comment") {
							scope.advance();
						}
					} else {
						scope.advance();
					}

					while (scope.current_expression && scope.current_expression.type === "Comment") {
						scope.advance();
					}

					if (scope.current_token.value === ':') {
						streamer.cursor     = cursor;
						scope.current_token = token;

						this.type = "ObjectLiteral";
						return;
					}
				}

				this.type           = this.type;
				streamer.cursor     = cursor;
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
					switch (scope.current_expression.type) {
						case "Identifier"    :
						case "NumberLiteral" :
						case "StringLiteral" :
							key = scope.current_expression;
							scope.advance();
							break;
					}

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

				if (this.type === "CurlyBrackets") {
					this.type = "ObjectLiteral";
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

				if (scope.current_token.delimiter === '}') {
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
	declaration_expression("Delimiter", {
		is     : function (token) { return token.delimiter === '('; },
		protos : {
			type       : "Grouping",
			precedence : 20,
			initialize : binary.protos.initialize,
			null_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance();
				this.expression = scope.expression(0);

				if (scope.current_token.delimiter === ')') {
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
	binary_expression("Operator", {
		is     : function (token) { return token.operator === '.'; },
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

				if (scope.current_token.type === "Identifier") {
					this.property    = scope.current_token;
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
	binary_expression("Delimiter", {
		is     : function (token) { return token.delimiter === '['; },
		protos : {
			type            : "Member",
			precedence      : 19,
			initialize      : binary.protos.initialize,
			left_denotation : function (left, scope) {
				this.object = left;

				scope.advance();
				this.property = scope.expression(0);

				this.is_computed = true;

				if (scope.current_token.delimiter === ']') {
					this.start = left.start;
					this.end   = scope.current_token.end;

					scope.advance_binary();
				} else {
					console.log(44444, this, scope.current_token);
					scope.current_token.error_unexpected_token();
				}

				return this;
			},
		},
	}).

	// Call Expression (18) {{{3
	binary_expression("Delimiter", {
		is     : function (token) { return token.delimiter === '('; },
		protos : {
			type       : "Call",
			precedence : 18,
			initialize : binary.protos.initialize,

			get_arguments : function (scope, call) {
				var i = 0, args = call["arguments"];

				scope.advance();

				LOOP:
				while (scope.current_token && scope.current_token.delimiter !== ')') {
					args[i++] = scope.expression(COMMA_PRECEDENCE);

					if (! scope.current_token) {
						console.error("Unexpected end");
					}
					if (scope.current_token.delimiter !== ',' && scope.current_token.delimiter !== ')') {
						scope.advance();
					}

					switch (scope.current_token.delimiter) {
						case ',' :
							scope.advance();
							break;
						case ')' :
							break LOOP;
						default:
							console.log(args, scope.current_expression);
							scope.current_token.error_unexpected_token();
					}
				}

				call.end = scope.current_token.end;
				//console.log(`[${ call.type }]`, call);
			},

			get_params : function (scope) {
				var i = 0, params = [];

				scope.advance();

				while (scope.current_expression && scope.current_expression.type === "Comment") {
					scope.advance();
				}

				while (scope.current_token && scope.current_token.delimiter !== ')') {
					if (scope.current_expression.type === "Identifier") {
						params[i++] = scope.current_expression;
						scope.advance();
					} else {
						scope.current_token.error_unexpected_token();
					}

					if (! scope.current_token) {
						console.error("Unexpected end");
					}

					while (scope.current_expression && scope.current_expression.type === "Comment") {
						scope.advance();
					}

					switch (scope.current_token.delimiter) {
						case ')' :
							return params;
						case ',' :
							scope.advance();
							break;
						default:
							scope.current_token.error_unexpected_token();
					}

					while (scope.current_expression && scope.current_expression.type === "Comment") {
						scope.advance();
					}
				}

				return params;
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
		is     : function (token) { return token.name === "new"; },
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
	binary_expression("Operator", {
		is : function (token) {
			switch (token.operator) { case '++' : case '--' :
				return true;
			}
		},
		protos : {
			type            : "Unary",
			precedence      : 17,
			initialize      : initialize_multi_characters_operator,
			left_denotation : function (left, scope) {
				if (left.start.line !== scope.current_token.start.line) {
					scope.current_token.error();
				}
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
	unary_expression("Operator", {
		is : function (token) {
			switch (token.operator) {
				case '!'  :
				case '~'  :
				case '+'  :
				case '-'  :
				case '++' :
				case '--' :
					return true;
			}
		},
		protos : prefix_unary,
	}).

	// Unary prefix void, typeof and delete unary expressions (16) {{{3
	unary_expression("Identifier", {
		is : function (token) {
			switch (token.name) { case "void" : case "typeof" : case "delete" :
				token.operator = token.name;
				return true;
			}
		},
		protos : prefix_unary
	}).

	// Exponentiation expression (15) {{{3
	binary_expression("Operator", {
		is     : function (token) { return token.operator === "**"; },
		protos : {
			type            : "Exponentiation",
			precedence      : 15,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		}
	}).

	// Multiply, Division and Remainder expressions (14) {{{3
	binary_expression("Operator", {
		is : function (token) {
			switch (token.operator) { case '*': case '%':
				return true;
			}
		},
		protos : {
			type            : "Binary",
			precedence      : 14,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	binary_expression("Slash", {
		protos : {
			type            : "Binary",
			precedence      : 14,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Addition and Subtraction expressions (13) {{{3
	binary_expression("Operator", {
		is : function (token) {
			switch (token.operator) { case '-' : case '+' :
				return true;
			}
		},
		protos : {
			type            : "Binary",
			precedence      : 13,
			initialize      : initialize_multi_characters_operator,
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Bitwise shift expressions (12) {{{3
	binary_expression("Operator", {
		is : function (token) {
			switch (token.operator) { case '<<' : case '>>' : case '>>>' :
				return true;
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
	binary_expression("Operator", {
		is : function (token) {
			switch (token.operator) {
				case '<'  :
				case '>'  :
				case '<=' :
				case '>=' :
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
		is     : function (token) { return token.name === "in"; },
		protos : binary.make("In", 11),
	}).

	// Instanceof expression (11) {{{3
	binary_expression("Identifier", {
		is     : function (token) { return token.name === "instanceof"; },
		protos : binary.make("Instanceof", 11),
	}).

	// Equality expressions (10) {{{3
	binary_expression("Operator", {
		is : function (token) {
			switch (token.operator) {
				case  '==' :
				case '===' :
				case  '!=' :
				case '!==' :
					return true;
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
	binary_expression("Operator", {
		is     : function (token) { return token.operator === '&'; },
		protos : binary.make("BitwiseAnd", 9),
	}).

	// Bitwise Xor expression (8) {{{3
	binary_expression("Operator", {
		is     : function (token) { return token.operator === '^'; },
		protos : binary.make("BitwiseXor", 8),
	}).

	// Bitwise Or expression (7) {{{3
	binary_expression("Operator", {
		is     : function (token) { return token.operator === '|'; },
		protos : binary.make("BitwiseOr", 7),
	}).

	// Logical And expression (6) {{{3
	binary_expression("Operator", {
		is     : function (token) { return token.operator === "&&"; },
		protos : binary.make("LogicalAnd", 6),
	}).

	// Logical Or expression (5) {{{3
	binary_expression("Operator", {
		is     : function (token) { return token.operator === "||"; },
		protos : binary.make("LogicalAnd", 5),
	}).

	// Conditional expression (4) {{{3
	binary_expression("Delimiter", {
		is     : function (token) { return token.delimiter === '?'; },
		protos : {
			type            : "Conditional",
			precedence      : 4,
			initialize      : binary.protos.initialize,
			left_denotation : function (left, scope) {
				this.test = left;

				scope.advance();
				this.consequent = scope.expression(0);

				if (scope.current_token.delimiter === ':') {
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
	binary_expression("Operator", {
		is : function (token) {
			switch (token.operator) {
				case    '=' :
				case   '+=' :
				case   '-=' :
				case   '*=' :
				case   '/=' :
				case   '%=' :
				case   '&=' :
				case   '|=' :
				case   '^=' :
				case  '**=' :
				case  '<<=' :
				case  '>>=' :
				case '>>>=' :
					return true;
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
		is     : function (token) { return token.name === "function"; },
		protos : {
			type            : "Function",
			precedence      : 31,
			//initialize      : binary.protos.initialize,
			//null_denotation : function (scope) {
			initialize : function (token, scope) {
				this.type = this.type;

				scope.advance_binary();
				if (scope.current_token.type === "Identifier") {
					this.id = scope.current_token;
					scope.advance_binary('(');
				} else {
					this.id = null;
				}

				if (scope.current_token.value === '(') {
					this.parameters = scope.current_expression.get_params(scope);
				} else {
					scope.current_token.error_unexpected_token();
				}

				scope.advance();
				if (scope.current_token.delimiter === '{') {
					this.body  = scope.current_expression.statement(scope);
					this.start = token.start;
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
	symbols.statement("Delimiter", {
		is     : function (token) { return token.delimiter === ';'; },
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
		is     : function (token) { return token.name === "var"; },
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
			initialize : function (token) {
				this.type         = this.type;
				this.declarations = [];
				this.ASI          = true;
				this.start        = token.start;
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

					if (scope.current_expression.type === "Identifier") {
						declarator = this.declare(scope.current_expression);
					} else {
						scope.current_token.error();
					}

					scope.advance_binary();
					if (! scope.current_expression) {
						console.log(scope.current_token);
					}
					if (scope.current_expression.operator === '=') {
						scope.advance();
						declarator.init = scope.expression(COMMA_PRECEDENCE);
					}
					declarator.end = declarator.init ? declarator.init.end : declarator.id.end;
					//console.log("VARIABLE DECLARATOR", declarator);

					if (scope.current_token) {
						switch (scope.current_token.delimiter) {
							case ',' :
								scope.advance();
								break;
							case ';' :
								this.ASI = false;
								this.end = scope.current_token.end;
								return this;
							default:
								if (declarator.end.column === 0) {
									this.end = declarator.end;
									scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
									return this;
								} else {
									console.log("unexpected end of var", scope.current_token, declarator);
									scope.current_token.error_unexpected_token();
								}
						}
					}
				}

				this.end = declarator.end;
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
		var start = scope.current_token.start, end = scope.current_token.end;

		scope.advance();
		if (! scope.current_token) {
			this.argument = null;
			this.ASI      = true;
		} else if (end.column === 0 || (scope.current_expression.start && scope.current_expression.start.line > end.line)) {
			this.argument = null;
			this.ASI      = true;
			scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
		} else if (scope.current_token.delimiter === ';') {
			end           = scope.current_token.end;
			this.argument = null;
			this.ASI      = false;
		} else {
			this.argument = scope.expression(0);

			if (! scope.current_token) {
				end      = this.argument.end;
				this.ASI = true;
			} else if (this.argument.end.column === 0 || scope.current_token.start.line > this.argument.end.line) {
				end      = this.argument.end;
				this.ASI = true;
				scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
			} else if (scope.current_token.delimiter === ';') {
				end      = scope.current_token.end;
				this.ASI = false;
			} else {
				scope.current_token.error();
			}
		}

		this.start = start;
		this.end   = end;
		//console.log(`[${ this.type }]`, scope.current_expression, this);

		return this;
	};

	symbols.statement("Identifier", {
		is     : function (token) { return token.name === "throw"; },
		protos : {
			type                 : "Throw",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : initialize_argument,
		}
	}).
	statement("Identifier", {
		is     : function (token) { return token.name === "return"; },
		protos : {
			type                 : "Return",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : initialize_argument,
		}
	});

	// Continue, Break statement {{{3
	var break_statement = function (scope) {
		var start = scope.current_token.start, end = scope.current_token.end;

		scope.advance();
		if (! scope.current_expression) {
			this.label = null;
			this.ASI   = true;
		} else if (end.column === 0 || scope.current_token.start.line > end.line) {
			this.label = null;
			this.ASI   = true;
			scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
		} else if (scope.current_token.delimiter === ';') {
			end        = scope.current_token.end;
			this.label = null;
			this.ASI   = false;
		} else if (scope.current_token.type === "Identifier") {
			this.label = scope.current_token;

			scope.advance();

			if (! scope.current_token) {
				end      = this.label.end;
				this.ASI = true;
			} else if (this.label.end.column === 0 || scope.current_token.start.line > this.label.end.line) {
				end      = this.label.end;
				this.ASI = true;
				scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
			} else if (scope.current_token.delimiter === ';') {
				end      = scope.current_token.end;
				this.ASI = false;
			} else {
				scope.current_token.error();
			}
		} else {
			scope.current_token.error();
		}

		this.start = start;
		this.end   = end;
		//console.log(`[${ this.type }]`, scope.current_expression, this);

		return this;
	};

	symbols.statement("Identifier", {
		is     : function (token) { return token.name === "break"; },
		protos : {
			type                 : "Break",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : break_statement,
		},
	}).
	statement("Identifier", {
		is     : function (token) { return token.name === "continue"; },
		protos : {
			type                 : "Continue",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : break_statement,
		},
	}).

	// If statement {{{3
	statement("Identifier", {
		is     : function (token) { return token.name === "if"; },
		protos : {
			type                 : "If",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var	start = scope.current_token.start;

				scope.advance('(');
				scope.advance();
				this.test = scope.expression(0);
				scope.advance();

				this.statement = scope.current_expression.statement_denotation(scope);

				var token    = scope.current_token,
					streamer = scope.tokenizer.streamer,
					cursor   = streamer.get_cursor();

				scope.advance();
				if (scope.current_expression && scope.current_expression.name === "else") {
					scope.advance();

					this.alternate = scope.current_expression.statement_denotation(scope);
				} else {
					this.alternate      = null;
					streamer.cursor     = cursor;
					scope.current_token = token;
				}

				this.start = start;
				this.end   = (this.alternate || this.statement).end;

				return this;
			},
		},
	}).

	// For statement {{{3
	statement("Identifier", {
		is     : function (token) { return token.name === "for"; },
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
				var self     = this,
					start    = scope.current_token.start,
					streamer = scope.tokenizer.streamer, cursor;

				scope.advance('(');
				cursor = streamer.get_cursor();

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
							streamer.cursor = cursor;
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
		is     : function (token) { return token.name === "while"; },
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
		is     : function (token) { return token.name === "do"; },
		protos : {
			type                 : "DoWhile",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var start = scope.current_token.start, end;

				scope.advance();

				this.statement = scope.current_expression.statement_denotation(scope);

				scope.advance("name", "while");
				scope.advance('(');
				scope.advance();

				this.test = scope.expression(0);

				if (scope.current_token.value === ')') {
					end = scope.current_token.end;
					scope.advance();
				}

				if (! scope.current_token) {
					this.ASI   = true;
					this.start = start;
					this.end   = end;
				} else if (end.column === 0 || scope.current_token.start.line > end.line) {
					scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
					this.ASI   = true;
					this.start = start;
					this.end   = end;
				} else if (scope.current_token.delimiter === ';') {
					this.ASI   = false;
					this.start = start;
					this.end   = scope.current_token.end;
				} else {
					scope.current_token.error();
				}

				return this;
			},
		},
	}).

	// Switch statement {{{3
	statement("Identifier", {
		is     : function (token) { return token.name === "switch"; },
		protos : {
			type                 : "Switch",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var start = scope.current_token.start;

				scope.advance('(');
				scope.advance();
				this.discriminant = scope.expression(0);

				if (scope.current_token.delimiter === ')') {
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

				while (scope.current_token.delimiter !== '}') {
					start = scope.current_token.start;

					while (scope.current_expression.type === "Comment") {
						cases.push(scope.current_expression);
						scope.advance();
					}

					switch (scope.current_expression.name) {
						case "case" :
							_case = new this.SwitchCase();
							scope.advance();
							_case.test = scope.expression(0);

							if (scope.current_token.delimiter !== ':') {
								scope.current_token.error_unexpected_token();
							}
							break;
						case "default" :
							_case = new this.DefaultCase();
							scope.advance(':');
							break;
						default:
						console.log(scope.current_token);
							scope.current_token.error();
					}

					_case.statements = [];
					_case.start      = start;
					_case.end        = scope.current_token.end;

					scope.advance();
					while (scope.current_expression) {
						if (! scope.current_expression               ||
							scope.current_token.delimiter === '}'    ||
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
		is     : function (token) { return token.name === "try"; },
		protos : {
			type                 : "Try",
			precedence           : 31,
			initialize           : binary.protos.initialize,
			statement_denotation : function (scope) {
				var	start    = scope.current_token.start,
					streamer = scope.tokenizer.streamer, token, cursor;

				scope.advance('{');
				this.block = scope.current_expression.statement(scope);

				scope.advance();
				if (scope.current_expression.name === "catch") {
					this.handler = this._catch(scope);
					token        = scope.current_token;
					cursor       = streamer.get_cursor();
					scope.advance();
				} else {
					this.handler = null;
				}

				if (scope.current_expression.name === "finally") {
					scope.advance('{');
					this.finalizer = scope.current_expression.statement(scope);
				} else if (token) {
					this.finalizer      = null;
					streamer.cursor     = cursor;
					scope.current_token = token;
				} else {
					console.error("Missing catch or finally after try");
				}

				this.start = start;
				this.end   = (this.finalizer || this.handler).end;

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
* Updated at  : 2017-06-05
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


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

/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es6_parser.js
* Created at  : 2017-05-23
* Updated at  : 2017-06-09
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/


// ES6 parser {{{1
app.namespace("javascript.ES6_parser", [
	"javascript.ES5_parser",
	"javascript.es6_tokenizer",
], function (parser, tokenizer) {

	parser           = parser.copy();
	parser.tokenizer = tokenizer;

	var set_expression_statement = function (handler, symbols) {
		handler.ExpressionStatement  = symbols.constructors.StringLiteral.prototype.ExpressionStatement;
		handler.statement_denotation = symbols.constructors.StringLiteral.prototype.statement_denotation;
	};

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

	// Tagged Template literal {{{2
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

	// Arrow Function Expression without parenthesis {{{2
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
			type        : "ArrowFunction",
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

	// Arrow Function Expression with parenthesis {{{2
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
			type        : "ArrowFunction",
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

	// Export default {{{2
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

});

return jeefo

};