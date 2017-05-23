/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parser.js
* Created at  : 2017-05-11
* Updated at  : 2017-05-24
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
			type            : "Undefined",
			precedence      : 0,
			null_denotation : function () { return this; },
			left_denotation : function () { return this; },
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

	var initialize_identifier = function (tokens, index, scope) {
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

		scope.token_index = i - 1;
	};

	var JavascriptSymbolsTable = function (constructors, expression_symbols, statement_symbols, named_symbols) {
		var i;

		this.constructors       = constructors       || new JeefoObject();
		this.named_symbols      = named_symbols      || new JeefoObject();
		this.statement_symbols  = statement_symbols  || new JeefoObject();
		this.expression_symbols = expression_symbols || new JeefoObject();

		if (this.expression_symbols.Identifier) {
			for (i = this.expression_symbols.Identifier.length - 1; i >= 0; --i) {
				if (this.expression_symbols.Identifier[i].precedence === 21) {
					this.expression_symbols.Identifier.splice(i, 1);
					break;
				}
			}
		}

		if (this.expression_symbols.SpecialCharacter) {
			for (i = this.expression_symbols.SpecialCharacter.length - 1; i >= 0; --i) {
				if (this.expression_symbols.SpecialCharacter[i].precedence === 21) {
					this.expression_symbols.SpecialCharacter.splice(i, 1);
					break;
				}
			}
		}

		this.declaration_expression("Identifier", {
			suffix : false,
			protos : {
				type       : "Identifier",
				names      : this.named_symbols,
				precedence : 21,
				initialize : initialize_identifier,
				null_denotation : function (scope) {
					if (this.names.hasOwnProperty(this.name)) {
						return this.names[this.name].null_denotation(this, scope);
					}
					return this;
				},
				left_denotation : function (left, scope) {
					if (this.names.hasOwnProperty(this.name)) {
						if (! this.names[this.name].left_denotation) {
							//console.log(this.name, this.names);
						}
						return this.names[this.name].left_denotation(left, scope);
					}
					return this;
				}
			},
		}).

		declaration_expression("SpecialCharacter", {
			is     : function (token) { return token.value === '$' || token.value === '_'; },
			suffix : false,
			protos : {
				type       : "Identifier",
				precedence : 21,
				initialize : initialize_identifier,
			},
		});
	};

	assign(JavascriptSymbolsTable.prototype, SymbolsTable.prototype, {
		SymbolsTable : JavascriptSymbolsTable,
		copy : function () {
			return new this.SymbolsTable(
				this.constructors.$copy(),
				this.expression_symbols.$copy(),
				this.statement_symbols.$copy(),
				this.named_symbols.$copy()
			);
		},
		named_expression : function (name, handler) {
			this.named_symbols[name] = JeefoObject.create(handler);
			if (handler.on_register) {
				handler.on_register(this.named_symbols[name], this);
			}
			return this;
		},
		declaration_expression : function (token_type, handler) {
			return this.register_expression(token_type, handler, handler.suffix);
		},
		literal_expression : function (token_type, handler) {
			return this.register_expression(token_type, handler, "Literal");
		},
		binary_expression : function (token_type, handler) {
			return this.register_expression(token_type, handler, handler.suffix);
		},
		unary_expression : function (token_type, handler) {
			return this.register_expression(token_type, handler);
		},
	});

	return JavascriptSymbolsTable;
});


// Javascript Scope {{{1
app.namespace("javascript.Scope", function () {
	var Scope = function (tokens, symbols) {
		this.tokens        = tokens;
		this.symbols       = symbols;
		this.token_index   = 0;
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
				statements.push(this.statement());
			}

			return statements;
		},

		advance : function (expect_type) {
			if (this.token_index < this.tokens_length) {
				this.current_expression = this.symbols.get_expression(this, this.tokens, this.token_index);

				if (expect_type && expect_type !== this.current_expression.type) {
					this.current_expression.error();
				}

				this.token_index += 1;
			} else {
				this.last_expression    = this.current_expression;
				this.current_expression = null;
			}
		},

		statement : function () {
			var statement = this.symbols.get_statement(this, this.tokens, this.token_index);

			if (statement.statement_denotation) {
				return statement.statement_denotation(this);
			}

			return statement;
		},

		expression : function (right_precedence) {
			var left, token;
			if (! this.current_expression) {
				left = this.last_expression;
			} else {
				left = this.current_expression.null_denotation(this);
			}

			while (this.current_expression && right_precedence < this.current_expression.precedence) {
				token = this.current_expression;
				this.advance();
				left = token.left_denotation(left, this);
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

			return scope.parse(tokens);
		},
	};

	return Parser;
});
// }}}1

// ignore:start

module.exports = jeefo;

// ignore:end
