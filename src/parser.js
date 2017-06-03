/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2017-05-11
* Updated at  : 2017-06-04
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals -PP */
/* exported */

var jeefo = require("jeefo").create();
jeefo.use(require("jeefo_core"));
jeefo.use(require("jeefo_tokenizer"));

// ignore:end

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

		get_expression : function (scope) {
			var symbols = this.expression_symbols[scope.current_token.type];

			if (! symbols) {
				return;
			}

			for (var i = symbols.length - 1; i >= 0; --i) {
				if (symbols[i].is && ! symbols[i].is(scope.current_token)) {
					continue;
				}

				var token = new symbols[i].Token();

				if (token.initialize) {
					token.initialize(scope.current_token, scope);
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
		get_binary_expression : function (scope) {
			var symbols = this.binary_expression_symbols[scope.current_token.type], i = symbols.length - 1;

			for (; i >= 0; --i) {
				if (symbols[i].is && ! symbols[i].is(scope.current_token)) {
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
		advance : function (expected_token_value) {
			this.current_token = this.tokenizer.next();

			if (this.current_token) {

				if (this.symbols.delimiter_symbols.hasOwnProperty(this.current_token.delimiter)) {
					this.current_expression = this.symbols.delimiter_symbols[this.current_token.value];
				} else {
					this.current_expression = this.symbols.get_expression(this);
				}

				if (expected_token_value && expected_token_value !== this.current_token.value) {
					console.log("EXPECT TOKEN VALUE", expected_token_value, this.current_token);
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

// ignore:start

module.exports = jeefo;

// ignore:end
