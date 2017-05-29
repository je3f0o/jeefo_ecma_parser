/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_parser.js
* Created at  : 2017-05-22
* Updated at  : 2017-05-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

var jeefo    = require("./parser"),
	_package = require("../package"),
	app      = jeefo.module(_package.name);

require("./es5_tokenizer");

/* globals */
/* exported */

// ignore:end

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
				console.log(`[${ this.type } EXPECT ;]`, scope.current_expression, this);
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

//ignore:start
// Debug {{{1
if (require.main === module) {
	
app.run("javascript.ES5_parser", function (p) {
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

	var source = `
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
	a++;
	o = { a_1 : 99, $b : 2 };
	[1,2,3];
	{ kkk : 1, $b : 2 };
	{};
	function a () {}
	new Fn(1.2E2,2,3);
	PP.define("IS_NULL", function (x) { return x === null;   }, true);
	instance.define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);
	instance.define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);

	do console.log(a++); while(a < 3);
	return {
		pre : (link && link.pre) ? link.pre : null,
		/**
		 * Compiles and re-adds the contents
		 */
		post : function(scope, element) {
			// Compile the contents
			if (! compiledContents) {
				compiledContents = $compile(contents);
			}
			// Re-add the compiled contents to the element
			compiledContents(scope, function(clone) {
				element.append(clone);
			});

			// Call the post-linking function, if any
			if (link && link.post) {
				link.post.apply(null, arguments);
			}
		}
	};
	var fields           = form.fields.filter(function (f) { return f; }),
		violations       = form.violations,
		oversighted_type = form.oversighted_type,
		total_fields     = fields.length + 4, // oversighted_type, violations, title, num_attachments
		counter          = 0;
	(function check_condition () {
		if (is_canceled) { return; }
		var result = callback();

		if (result) {
			deferred.resolve();
		} else if ((Date.now() + interval) < end_time) {
			setTimeout(check_condition, interval);
		} else {
			deferred.reject();
		}
	}());
	var EXTRACT_FILENAME = /filename[^;\\n=]*=((?:['\"]).*?\\2|[^;\\n]*)/g;
	match    = match[0].match(/filename="([^"\\\\]*(?:\\.[^"\\\\]*)*)"/i);
	filename = (match && match[1]) ? decodeURI(match[1]) : fallback_filename;
	$ngRedux.connect(function () {
		var state = $ngRedux.getState();
		if (state.backdrop) {
			$element.css({
				bottom  : 0,
				opacity : 0.6,
			});
		} else {
			$element.css({
				bottom  : "100%",
				opacity : 0,
			});
		}

		return { backdrop : state.backdrop };
	})(dumb_state);
	return {
		'collapse-handler-right'          : ! folder.is_loading && ! folder.is_collapsed,
		'icon-spin4 animate-spin'         : folder.is_loading,
		'icon-right-dir collapse-handler' : ! folder.is_loading
	};
	divider *= 1024;
	size = (size / divider);

	define([], function () {
		function compare_by_id (a, b) {
			var result = 0;
			if (a.conclusion_id < b.conclusion_id) {
				result = -1;
			} else if (a.conclusion_id > b.conclusion_id) {
				result = 1;
			}
			return result;
		}
		function compare_by_string (a, b) { return a.rate.localeCompare(b.rate); }
	});

	this.REGEX_FLAGS.indexOf(flags_value.charAt(i)) !== -1 && flags.indexOf(flags_value.charAt(i)) === -1;
`;

try {
	var r = p.parse(source);
	print(r[44]);
} catch(e) {
	console.log(e);
	console.log(e.stack);
}

	//print(r[0].declarations[2].init.body.body[0].argument.arguments[1].body.body[0].argument);
	//print(r[9].statement.body[0]);
	//print(r[12].expression.arguments[2].body.body[0].declarations[0].init.body.body[3]);


	//console.log(r);

	//process.exit();
});

}
// }}}1

module.exports = jeefo;

//ignore:end
