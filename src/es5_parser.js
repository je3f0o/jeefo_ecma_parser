/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_parser.js
* Created at  : 2017-05-22
* Updated at  : 2017-05-24
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

	// Registering predefined constructors {{{2
	var symbols = new JavascriptSymbolsTable();

	var return_left = function (left) { return left; };

	symbols.register_constructor("VariableDeclarator", function (token) {
		this.type  = this.type;
		this.id    = token;
		this.init  = null;
		this.start = token.start;
	}).
	register_constructor("CatchClause", function () {
		this.type = this.type;
	}).
	register_constructor("SwitchCase", function () {
		this.type = this.type;
	}).
	register_constructor("DefaultCase", function () {
		this.type       = this.type;
		this.statements = [];
	}).
	register_constructor("GroupingExpression", function (token) {
		this.type       = this.type;
		this.expression = token.scope.expression(0);
		this.start      = token.start;
		this.end        = token.end;
	}, { precedence : 20 }).
	register_constructor("EmptyStatement", function (token) {
		this.type  = this.type;
		this.start = token.start;
		this.end   = token.end;
	}).
	register_constructor("ExpressionStatement", function (token) {
		this.type       = this.type;
		this.expression = token;
		this.start      = token.start;
	});
	// }}}2

	// Registering declaration expression symbols {{{2
	// Comment declaration symbol {{{3
	symbols.declaration_expression("Comment", {
		suffix : false,
		protos : {
			type       : "Comment",
			precedence : 1,
			initialize : function (tokens, index) {
				this.type    = this.type;
				this.comment = tokens[index].value;
				this.start   = tokens[index].start;
				this.end     = tokens[index].end;
			},
		},
	}).

	// Number literal {{{
	literal_expression("Number", {
		protos : {
			type              : "Number",
			precedence        : 21,
			EXPONENTIAL_REGEX : /^e|E\d+$/,
			initialize : function (tokens, index, scope) {
				this.type  = this.type;
				this.value = tokens[index].value;
				this.start = tokens[index].start;

				if (tokens[index + 1]                              &&
					tokens[index + 1].type  === "SpecialCharacter" &&
					tokens[index + 1].value === '.'                &&
					tokens[index + 1].start.index === tokens[index].end.index) {

					this.value += '.';
					scope.token_index = (index += 1);
				}

				if (tokens[index + 1]                          &&
					tokens[index + 1].type        === "Number" &&
					tokens[index + 1].start.index === tokens[index].end.index) {

					this.value += tokens[index + 1].value;
					scope.token_index = (index += 1);
				}

				if (tokens[index + 1]                                    &&
					tokens[index + 1].type        === "Identifier"       &&
					this.EXPONENTIAL_REGEX.test(tokens[index + 1].value) &&
					tokens[index + 1].start.index === tokens[index].end.index) {

					this.value += tokens[index + 1].value;
					scope.token_index = (index += 1);
				}

				this.end = tokens[index].end;
			},
		}
	}).

	// NULL literal {{{3
	register_constructor("NullLiteral", function (token) {
		this.type  = this.type;
		this.start = token.start;
		this.end   = token.end;
	}, { precedence : 21 }).

	named_expression("null", {
		on_register : function (handler, symbols) {
			handler.NullLiteral = symbols.constructors.NullLiteral;
		},
		null_denotation : function (token) {
			return new this.NullLiteral(token);
		},
		left_denotation : return_left,
	}).

	// String literal symbol {{{3
	literal_expression("String", {
		protos : {
			type       : "String",
			precedence : 21,
			initialize : function (tokens, index) {
				this.type  = this.type;
				this.value = tokens[index].value;
				this.start = tokens[index].start;
				this.end   = tokens[index].end;
			},
		},
	}).

	// Boolean literal symbols {{{3
	register_constructor("BooleanLiteral", function (token) {
		this.type  = this.type;
		this.value = token.name;
		this.start = token.start;
		this.end   = token.end;
	});

	var bool = {
		on_register : function (handler, symbols) {
			handler.BooleanLiteral = symbols.constructors.BooleanLiteral;
		},
		null_denotation : function (token) {
			return new this.BooleanLiteral(token);
		},
		left_denotation : return_left,
	};

	symbols.
		named_expression("true"  , bool).
		named_expression("false" , bool).

	// RegExp literal symbols {{{3
	literal_expression("RegExp", {
		protos : {
			type        : "RegExp",
			precedence  : 21,
			REGEX_FLAGS : "gimuy",
			initialize  : function (tokens, index, scope) {
				var next_index = index + 1, i = 0, flags = '', flags_value;

				this.type  = this.type;

				if (tokens[next_index] &&
					tokens[index].end.index === tokens[next_index].start.index &&
					tokens[next_index].type === "Identifier"
				) {
					flags_value = tokens[next_index].value;

					for (i = flags_value.length - 1; i >= 0; --i) {
						if (this.REGEX_FLAGS.indexOf(flags_value.charAt(i)) !== -1 && flags.indexOf(flags_value.charAt(i)) === -1) {
							flags += flags_value.charAt(i);
						} else {
							flags = '';
							tokens[next_index].error("Invalid regular expression flags");
						}
					}

					if (flags) {
						scope.token_index += 1;
					}
				}

				this.regex = {
					pattern : tokens[index].value,
					flags   : flags
				};

				this.start = tokens[index].start;
				this.end   = tokens[scope.token_index].end;
			},
		},
	}).

	// Delimiter characters {{{3
	// Terminator {{{4
	declaration_expression("SpecialCharacter", {
		is     : function (token) { return token.value === ';'; },
		suffix : false,
		protos : {
			type       : "Terminator",
			initialize : function (tokens, index) {
				this.type     = this.type;
				this.operator = tokens[index].value;
				this.start    = tokens[index].start;
				this.end      = tokens[index].end;
			},
		},
	}).

	// Delimiter {{{4
	register_constructor("SequenceExpression", function (start, expressions) {
		this.type        = this.type;
		this.expressions = expressions;
		this.start       = start;
		this.end         = expressions[expressions.length - 1].end;
	}, { precedence : 20 }).

	declaration_expression("SpecialCharacter", {
		is     : function (token) { return token.value === ':'; },
		suffix : false,
		protos : {
			type       : "Delimiter",
			initialize : function (tokens, index) {
				this.type     = this.type;
				this.operator = tokens[index].value;
				this.start    = tokens[index].start;
				this.end      = tokens[index].end;
			},
		},
	}).

	// Comma {{{4
	declaration_expression("SpecialCharacter", {
		is     : function (token) { return token.value === ','; },
		suffix : false,
		protos : {
			type       : "Comma",
			precedence : COMMA_PRECEDENCE,
			initialize : function (tokens, index) {
				this.type  = this.type;
				this.start = tokens[index].start;
				this.end   = tokens[index].end;
			},
			on_register : function (handler, symbols) {
				handler.SequenceExpression = symbols.constructors.SequenceExpression;
			},
			left_denotation : function (left, scope) {
				var expressions = [left];

				LOOP:
				while (scope.current_expression) {
					expressions.push(scope.expression(COMMA_PRECEDENCE));

					if (scope.current_expression) {
						switch (scope.current_expression.type) {
							case "Comma" :
								scope.advance();
								break;
							case "Delimiter":
							case "Terminator":
								break LOOP;
							default:
								scope.advance();
						}
					}
				}

				return new this.SequenceExpression(left.start, expressions);
			},
		},
	});
	// }}}4

	// Grouping expression declarations {{{3
	var initialize_groups = function (tokens, index, scope) {
		this.type  = this.type;
		this.scope = scope.$new(tokens[index].children);
		this.start = tokens[index].start;
		this.end   = tokens[index].end;
	};

	symbols.

	// Curly Brackets {{{3
	register_constructor("ObjectLiteral", function (token, properties) {
		this.type       = this.type;
		this.properties = properties;
		this.start      = token.start;
		this.end        = token.end;
	}, { precedence : 21 }).

	register_constructor("Property", function (key, value, is_computed) {
		this.type        = this.type;
		this.key         = key;
		this.value       = value;
		this.is_computed = is_computed;
		this.start       = key.start;
	}, { type : "Property", precedence : 21 }).

	declaration_expression("Block", {
		protos : {
			type        : "Block",
			precedence  : 21,
			initialize  : initialize_groups,
			on_register : function (handler, symbols) {
				handler.Property      = symbols.constructors.Property;
				handler.ObjectLiteral = symbols.constructors.ObjectLiteral;
			},
			null_denotation : function (scope) {
				var properties = [], i = 0, key, is_computed;
				scope = this.scope;

				scope.advance();

				while (scope.current_expression) {
					key = scope.expression(0);
					is_computed = key.type !== "Identifier";

					if (scope.current_expression.type === "Delimiter") {
						scope.advance();
					}

					properties[i++] = new this.Property(key, scope.expression(COMMA_PRECEDENCE), is_computed);
					if (scope.current_expression) {
						if (scope.current_expression.type === "Comma") {
							scope.advance();
						} else {
							scope.advance("Comma");
							scope.advance();
						}
					}
				}

				return new this.ObjectLiteral(this, properties);
			},
			left_denotation : function (left) {
				switch (left.type) {
					case "ObjectLiteral" :
					case "FunctionExpression" :
						return left;
				}
				console.log(111, left.type);
				return this;
			}
		},
	}).

	// Parenthesis {{{3
	register_constructor("CallExpression", function (callee, end) {
		this.type         = this.type;
		this.callee       = callee;
		this["arguments"] = [];
		this.start        = callee.start;
		this.end          = end;
	}).
	declaration_expression("Parenthesis", {
		protos : {
			type       : "Parenthesis",
			precedence : 19,
			initialize : initialize_groups,
			call_expression : function (callee) {
				var call = new this.CallExpression(callee, this.end);
				this.get_arguments(this.scope, call["arguments"], callee);

				return call;
			},
			get_arguments : function (scope, args) {
				var i = 0;

				scope.advance();
				while (scope.current_expression) {
					args[i++] = scope.expression(COMMA_PRECEDENCE);
					// TODO: Error check for arguments

					if (scope.current_expression) {
						if (scope.current_expression.type === "Comma") {
							scope.advance();
							if (! scope.current_expression) {
								console.error("ERRORRR", scope.current_expression); 
							}
						} else {
							console.error("ERRORRR2", scope.current_expression);
						}
					}
				}
			},
			on_register : function (protos, symbols) {
				protos.CallExpression     = symbols.constructors.CallExpression;
				protos.GroupingExpression = symbols.constructors.GroupingExpression;
			},
			null_denotation : function () {
				this.scope.advance();
				return new this.GroupingExpression(this);
			},
			left_denotation : function (left) {
				switch (left.type) {
					case "Identifier" :
					case "MemberExpression" :
					case "FunctionExpression" :
						return this.call_expression(left);
					case "NewExpression" :
						this.get_arguments(this.scope, left["arguments"]);
						left.end = this.end;
						return left;
					case "GroupingExpression" :
						return left;
				}
				if (left.type !== "GroupingExpression") {
					console.log(222, left);
				}
				return this;
			},
		},
	}).
	
	// New expression with args (19) {{{3
	register_constructor("NewExpression", function (start, callee) {
		this.type         = this.type;
		this.callee       = callee;
		this["arguments"] = [];
		this.start        = start;
		this.end          = callee.end;
	}, { precedence : 19 }).
	
	named_expression("new", {
		on_register : function (handler, symbols) {
			handler.NewExpression = symbols.constructors.NewExpression;
		},
		null_denotation : function (token, scope) {
			var start = token.start;
			scope.advance();

			var left = scope.current_expression.null_denotation(scope);

			LOOP:
			while (true) {
				token = scope.current_expression;

				if (! token) {
					break;
				}

				switch (token.type) {
					case "Identifier":
					case "MemberExpression":
						scope.advance();
						left = token.left_denotation(left, scope);
						break;
					case "ParenthesisExpression":
						return scope.current_expression.left_denotation(new this.NewExpression(start, left), scope);
					default:
						left.precedence = 18;
						break LOOP;
				}
			}

			return left;
		},
	}).

	// Member declaration expression (19) {{{3
	declaration_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '.'; },
		protos : {
			type       : "Member",
			precedence : 19,
			initialize : function () {
				this.type = this.type;
			},
			left_denotation : function (left, scope) {
				this.object      = left;
				this.property    = scope.expression(this.precedence);
				this.is_computed = false;
				this.start       = left.start;
				this.end         = this.property.end;
				return this;
			},
		},
	}).

	// Square Brackets {{{3
	register_constructor("ArrayLiteral", function (token, elements) {
		this.type     = this.type;
		this.elements = elements;
		this.start    = token.start;
		this.end      = token.end;
	}, { precedence : 21 }).

	declaration_expression("Array", {
		protos : {
			type        : "SquareBracket",
			precedence  : 19,
			initialize  : initialize_groups,
			on_register : function (handler, symbols) {
				handler.ArrayLiteral     = symbols.constructors.ArrayLiteral;
				handler.MemberExpression = symbols.constructors.MemberExpression;
			},
			null_denotation : function (scope) {
				var elements = [];
				scope = this.scope;
				scope.advance();

				while (scope.current_expression) {
					if (scope.current_expression.type === "Comma") {
						elements.push(null);
					} else {
						elements.push(scope.expression(COMMA_PRECEDENCE));
					}
					scope.advance();
				}

				return new this.ArrayLiteral(this, elements);
			},
			left_denotation : function (left) {
				if (left.type === "ArrayLiteral") {
					return left;
				}
				var member = new this.MemberExpression();

				member.type   = member.type;
				member.object = left;

				this.scope.advance();
				member.property    = this.scope.expression(0);
				member.is_computed = true;

				member.start = left.start;
				member.end   = this.end;

				return member;
			},
		},
	});

	// Binary expression symbols {{{3
	var binary = {
		protos : {
			initialize : function (tokens, index) {
				this.type     = this.type;
				this.operator = tokens[index].value;
			},
			left_denotation : function (left, scope) {
				this.left  = left;
				this.right = scope.expression(this.precedence);
				this.start = left.start;
				this.end   = this.right.end;

				return this;
			},
		},
		make : function (arity, precedence) {
			this.protos.type       = arity;
			this.protos.precedence = precedence;
			return this.protos;
		},
	};

	// Unary expressions (16) {{{3
	symbols.unary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '!' :
					if (! tokens[index + 1]                            ||
						tokens[index + 1].type  !== "SpecialCharacter" ||
						tokens[index + 1].value !== '='                ||
						tokens[index + 1].start.index > token.end.index) {

						token.op    = '!';
						token.index = index;
						return true;
					}
					break;
				case '~' :
					if (! tokens[index + 1]                            ||
						tokens[index + 1].type  !== "SpecialCharacter" ||
						tokens[index + 1].value !== '='                ||
						tokens[index + 1].start.index > token.end.index) {

						token.op    = '~';
						token.index = index;
						return true;
					}
					break;
				case '+' :
					if (tokens[index + 1]                              &&
						tokens[index + 1].type  === "SpecialCharacter" &&
						tokens[index + 1].value === '+'                &&
						tokens[index + 1].start.index === token.end.index) {

						token.op    = "++";
						token.index = index + 1;
						return true;
					}
					break;
				case '-' :
					if (tokens[index + 1]                              &&
						tokens[index + 1].type  === "SpecialCharacter" &&
						tokens[index + 1].value === '-'                &&
						tokens[index + 1].start.index === token.end.index) {

						token.op    = "--";
						token.index = index + 1;
						return true;
					}
					break;
			}
		},
		protos : {
			type       : "Unary",
			precedence : 16,
			initialize : function (tokens, index, scope) {
				this.type      = this.type;
				this.operator  = tokens[index].op;
				this.argument  = null;
				this.is_prefix = true;
				this.start     = tokens[index].start;
				this.end       = tokens[index].end;

				scope.token_index = tokens[index].index;
			},
			null_denotation : function (scope) {
				scope.advance();
				this.argument = scope.expression(this.precedence);
				this.end      = this.argument.end;

				return this;
			},
			left_denotation : function (left, scope) {
				switch (this.operator) {
					case "--" :
					case "++":
						if (left === this) {
							this.argument = scope.expression(this.precedence);
							this.end      = this.argument.end;
						} else {
							this.start      = left.start;
							this.argument   = left;
							this.is_prefix  = false;
							this.precedence = 17;
						}
						return this;
					default:
						console.error("ERROR");
				}
			}
		}
	});

	// Void, Typeof and Delete unary expressions (16) {{{3
	var prefix_unary = {
		on_register : function (handler, symbols) {
			handler.UnaryExpression = symbols.constructors.UnaryExpression;
		},
		null_denotation : function (token, scope) {
			var unary = new this.UnaryExpression();

			unary.type      = unary.type;
			unary.operator  = token.name;
			scope.advance();
			unary.argument  = scope.expression(unary.precedence);
			unary.is_prefix = true;
			unary.start     = token.start;
			unary.end       = unary.argument.end;

			return unary;
		},
	};

	symbols.
		named_expression("void"   , prefix_unary).
		named_expression("typeof" , prefix_unary).
		named_expression("delete" , prefix_unary);

	// Exponentiation expression (15) {{{3
	symbols.binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			return  token.value === '*'                               &&
					tokens[index + 1]                                 &&
					tokens[index + 1].type  === "SpecialCharacter"    &&
					tokens[index + 1].value === '*'                   &&
					tokens[index + 1].start.index === token.end.index;
		},
		protos : {
			type       : "Exponentiation",
			precedence : 15,
			initialize : function (tokens, index, scope) {
				this.type = this.type;
				scope.token_index += 1;
			},
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
					if (tokens[index + 1]) {
						return tokens[index + 1].type  !== "SpecialCharacter" ||
							tokens[index + 1].value !== '=' ||
							tokens[index + 1].start.index > token.end.index;
					}
					return true;
			}
		},
		protos : binary.make("Binary", 14),
	}).

	// Addition and Subtraction expressions (13) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '+' :
					if (tokens[index + 1]) {
						return tokens[index + 1].type  !== "SpecialCharacter" ||
							(tokens[index + 1].value !== '=' && tokens[index + 1].value !== '+') ||
							tokens[index + 1].start.index > token.end.index;
					}
					return true;
				case '-' :
					if (tokens[index + 1]) {
						return tokens[index + 1].type  !== "SpecialCharacter" ||
							(tokens[index + 1].value !== '=' && tokens[index + 1].value !== '-') ||
							tokens[index + 1].start.index > token.end.index;
					}
					return true;
			}
		},
		protos : binary.make("Binary", 13),
	}).

	// Comparition expressions (11) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '<' :
				case '>' :
					if (tokens[index + 1]                               &&
						tokens[index + 1].type  === "SpecialCharacter"  &&
						tokens[index + 1].value === '='                 &&
						tokens[index + 1].start.index === token.end.index) {

						token.op    = token.value + "=";
						token.index = index + 1;
						return true;
					}
					token.op    = token.value;
					token.index = index;
					return true;
			}
		},
		protos : {
			type       : "Comparision",
			precedence : 11,
			initialize : function (tokens, index, scope) {
				this.type         = this.type;
				this.operator     = tokens[index].op;
				scope.token_index = tokens[index].index;
			},
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// In expression (11) {{{3
	register_constructor("InExpression", function () {
		this.type = this.type;
	}, { precedence : 11, left_denotation : binary.protos.left_denotation }).

	named_expression("in", {
		on_register : function (handler, symbols) {
			handler.InExpression = symbols.constructors.InExpression;
		},
		left_denotation : function (left, scope) {
			var in_expression = new this.InExpression();
			return in_expression.left_denotation(left, scope);
		},
	}).

	// Instanceof expression (11) {{{3
	register_constructor("InstanceofExpression", function () {
		this.type = this.type;
	}, { precedence : 11, left_denotation : binary.protos.left_denotation }).

	named_expression("instanceof", {
		on_register : function (handler, symbols) {
			handler.InstanceofExpression = symbols.constructors.InstanceofExpression;
		},
		left_denotation : function (left, scope) {
			var instanceof_expression = new this.InstanceofExpression();
			return instanceof_expression.left_denotation(left, scope);
		},
	}).

	// Equality expressions (10) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			switch (token.value) {
				case '=' :
					if (tokens[index + 1]                               &&
						tokens[index + 1].type  === "SpecialCharacter"  &&
						tokens[index + 1].value === '='                 &&
						tokens[index + 1].start.index === token.end.index) {

						if (tokens[index + 2]                              &&
							tokens[index + 2].type  === "SpecialCharacter" &&
							tokens[index + 2].value === '='                &&
							tokens[index + 2].start.index === tokens[index + 1].end.index) {
							token.op    = "===";
							token.index = index + 2;
							return true;
						}

						token.op    = "==";
						token.index = index + 1;
						return true;
					}
					break;
				case '!' :
					if (tokens[index + 1]                               &&
						tokens[index + 1].type  === "SpecialCharacter"  &&
						tokens[index + 1].value === '='                 &&
						tokens[index + 1].start.index === token.end.index) {

						if (tokens[index + 2]                              &&
							tokens[index + 2].type  === "SpecialCharacter" &&
							tokens[index + 2].value === '='                &&
							tokens[index + 2].start.index === tokens[index + 1].end.index) {
							token.op    = "!==";
							token.index = index + 2;
							return true;
						}

						token.op    = "!=";
						token.index = index + 1;
						return true;
					}
			}
		},
		protos : {
			type       : "Equality",
			precedence : 10,
			initialize : function (tokens, index, scope) {
				this.type         = this.type;
				this.operator     = tokens[index].op;
				scope.token_index = tokens[index].index;
			},
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Bitwise And expression (9) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '&') {
				if (tokens[index + 1]) {
					return tokens[index + 1].type !== "SpecialCharacter"                     ||
						(tokens[index + 1].value !== '&' && tokens[index + 1].value !== '=') ||
						tokens[index + 1].start.index > token.end.index;
				}
				return true;
			}
		},
		protos : {
			type       : "BitwiseAnd",
			precedence : 9,
			initialize : function () {
				this.type = this.type;
			},
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Bitwise Xor expression (8) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '^') {
				if (tokens[index + 1]) {
					return tokens[index + 1].type !== "SpecialCharacter" ||
						tokens[index + 1].value   !== '='                ||
						tokens[index + 1].start.index > token.end.index;
				}
				return true;
			}
		},
		protos : {
			type       : "BitwiseXor",
			precedence : 8,
			initialize : function () {
				this.type     = this.type;
				this.operator = '^';
			},
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Bitwise Or expression (7) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			if (token.value === '|') {
				if (tokens[index + 1]) {
					return tokens[index + 1].type !== "SpecialCharacter"                     ||
						(tokens[index + 1].value !== '|' && tokens[index + 1].value !== '=') ||
						tokens[index + 1].start.index > token.end.index;
				}
				return true;
			}
		},
		protos : {
			type       : "BitwiseOr",
			precedence : 7,
			initialize : function () {
				this.type     = this.type;
				this.operator = '|';
			},
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Logical And expression (6) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			return token.value === '&'                               &&
				tokens[index + 1]                                    &&
				tokens[index + 1].type        === "SpecialCharacter" &&
				tokens[index + 1].value       === '&'                &&
				tokens[index + 1].start.index === token.end.index;
		},
		protos : {
			type       : "LogicalAnd",
			precedence : 6,
			initialize : function (tokens, index, scope) {
				this.type          = this.type;
				this.operator      = "&&";
				scope.token_index += 1;
			},
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Logical Or expression (5) {{{3
	binary_expression("SpecialCharacter", {
		is : function (token, tokens, index) {
			return token.value === '|'                               &&
				tokens[index + 1]                                    &&
				tokens[index + 1].type        === "SpecialCharacter" &&
				tokens[index + 1].value       === '|'                &&
				tokens[index + 1].start.index === token.end.index;
		},
		protos : {
			type       : "LogicalOr",
			precedence : 5,
			initialize : function (tokens, index, scope) {
				this.type          = this.type;
				this.operator      = "||";
				scope.token_index += 1;
			},
			left_denotation : binary.protos.left_denotation,
		},
	}).

	// Condition expression (4) {{{3
	binary_expression("SpecialCharacter", {
		is     : function (token) { return token.value === '?'; },
		protos : {
			type       : "Conditional",
			precedence : 4,
			initialize : function () {
				this.type = this.type;
			},
			left_denotation : function (left, scope) {
				this.test       = left;
				this.consequent = scope.expression(0);

				if (scope.current_expression.type === "Delimiter") {
					scope.advance();
				} else {
					console.error("ERRRRRRRRRRRRRORRRR");
				}
				this.alternate = scope.expression(0);

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
					if (! tokens[index + 1]                            ||
						tokens[index + 1].type  !== "SpecialCharacter" ||
						tokens[index + 1].value !== '='                ||
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
				case '^' :
				case '|' :
					if (tokens[index + 1]                              &&
						tokens[index + 1].type  === "SpecialCharacter" &&
						tokens[index + 1].value === '='                &&
						tokens[index + 1].start.index === token.end.index) {

						token.op    = token.value + '=';
						token.index = index + 1;
						return true;
					}
					break;
				case '*' :
					if (tokens[index + 1]                                 &&
						tokens[index + 1].type  === "SpecialCharacter"    &&
						tokens[index + 1].value === '*'                   &&
						tokens[index + 1].start.index === token.end.index &&
						tokens[index + 2]                                 &&
						tokens[index + 2].type  === "SpecialCharacter"    &&
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
						tokens[index + 1].type  === "SpecialCharacter"    &&
						tokens[index + 1].value === '<'                   &&
						tokens[index + 1].start.index === token.end.index &&
						tokens[index + 2]                                 &&
						tokens[index + 2].type  === "SpecialCharacter"    &&
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
						tokens[index + 1].type  === "SpecialCharacter"    &&
						tokens[index + 1].value === '>'                   &&
						tokens[index + 1].start.index === token.end.index &&
						tokens[index + 2]                                 &&
						tokens[index + 2].type  === "SpecialCharacter"    &&
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
						tokens[index + 1].type  === "SpecialCharacter"                &&
						tokens[index + 1].value === '>'                               &&
						tokens[index + 1].start.index === token.end.index             &&
						tokens[index + 2]                                             &&
						tokens[index + 2].type  === "SpecialCharacter"                &&
						tokens[index + 2].value === '>'                               &&
						tokens[index + 2].start.index === tokens[index + 1].end.index &&
						tokens[index + 3]                                             &&
						tokens[index + 3].type  === "SpecialCharacter"                &&
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
			type       : "Assignment",
			precedence : 3,
			initialize : function (tokens, index, scope) {
				this.type         = this.type;
				this.operator     = tokens[index].op;
				this.start        = tokens[index].start;
				scope.token_index = tokens[index].index;
			},
			left_denotation : binary.protos.left_denotation,
		},
	});

	// Function expression {{{3
	symbols.declaration_expression("Identifier", {
		is : function (token, tokens, index) {
			return token.value === "function" && (tokens[index + 1] && tokens[index + 1].start.index > token.end.index);
		},
		protos : {
			type       : "Function",
			precedence : 22,
			initialize : function (tokens, index) {
				this.type       = this.type;
				this.id         = null;
				this.parameters = [];
				this.body       = null;
				this.start      = tokens[index].start;
				this.end        = tokens[index].end;
			},
			null_denotation : function (scope) {
				scope.advance();

				if (scope.current_expression.type === "Identifier") {
					this.id = scope.current_expression;
					scope.advance("ParenthesisExpression");
				}

				if (scope.current_expression.type === "ParenthesisExpression") {
					var params      = this.parameters,
						parenthesis = scope.current_expression.scope;

					parenthesis.advance();
					while (parenthesis.current_expression) {
						if (parenthesis.current_expression.type === "Identifier") {
							params.push(parenthesis.current_expression);
						} else {
							parenthesis.current_expression.error();
						}

						parenthesis.advance();
						if (parenthesis.current_expression) {
							if (parenthesis.current_expression.type === "Comma") {
								parenthesis.advance();

								if (! parenthesis.current_expression) {
									parenthesis.current_expression.error();
								}
							} else {
								parenthesis.current_expression.error();
							}
						}
					}
				}

				scope.advance("BlockExpression");
				this.body = scope.statement();
				this.end  = this.body.end;
		
				return this;
			},
		},
	});
	// }}}3
	// }}}2

	// Registering statements symbols {{{2
	// Variable declaration statement {{{3
	symbols.register_statement("Identifier", {
		is     : function (token) { return token.name === "var"; },
		suffix : false,
		protos : {
			type       : "VariableDeclaration",
			initialize : function (tokens, index, scope) {
				this.type         = this.type;
				this.declarations = [];
				this.start        = scope.current_expression.start;

				// init
				scope.advance();
				var declarator;

				while (scope.current_expression) {
					if (scope.current_expression.type !== "Identifier") {
						scope.current_expression.error();
					}

					declarator = this.declare(scope.current_expression);

					scope.advance();
					if (scope.current_expression.operator === '=') {
						scope.advance();
						declarator.init = scope.expression(COMMA_PRECEDENCE);
					}
					declarator.end = declarator.init ? declarator.init.end : declarator.id.end;

					switch (scope.current_expression.type) {
						case "Comma" :
							scope.advance();
							break;
						case "Terminator" :
							this.end = scope.current_expression.end;
							return this;
						default:
							scope.current_expression.error();
					}
				}
			},

			on_register : function (protos, symbols) {
				protos.VariableDeclarator = symbols.constructors.VariableDeclarator;
			},

			declare : function (token) {
				token = new this.VariableDeclarator(token);
				this.declarations.push(token);
				return token;
			},
		}
	}).

	// Comment statement {{{3
	register_statement("Comment", {
		suffix : false,
		protos : {
			type : "Comment",
			initialize : function (tokens, index, scope) {
				this.type    = this.type;
				this.comment = scope.current_expression.comment;
				this.start   = scope.current_expression.start;
				this.end     = scope.current_expression.end;
			},
		}
	}).

	// Function declaration {{{3
	register_statement("FunctionExpression", {
		suffix : false,
		protos : {
			type                 : "FunctionDeclaration",
			statement_denotation : function (scope) {
				var expression  = scope.current_expression.null_denotation(scope);
				expression.type = "FunctionDeclaration";
				return expression;
			}
		},
	});

	// General Expression statement {{{3
	var expression_statement = {
		protos : {
			precedence : 0,

			on_register : function (protos, symbols) {
				protos.EmptyStatement      = symbols.constructors.EmptyStatement;
				protos.ExpressionStatement = symbols.constructors.ExpressionStatement;
			},

			statement_denotation : function (scope) {
				if (scope.current_expression.type === "Terminator" && ! scope.current_expression.left) {
					return new this.EmptyStatement(scope.current_expression);
				}

				var left = scope.current_expression, token;
				if (left.type === "Identifier") {
					left = left.null_denotation(scope);
				}

				while (scope.current_expression && 0 < scope.current_expression.precedence) {
					token = scope.current_expression;
					scope.advance();
					left = token.left_denotation(left, scope);
				}

				if (! scope.current_expression || scope.current_expression.type === "Terminator") {
					var _statement = new this.ExpressionStatement(left);
					_statement.end = (scope.current_expression || left).end;
					return _statement;
				}

				console.log("ELSE ERRORRRR");
			},
		},
	};

	symbols.
		register_statement("Identifier"           , expression_statement).
		register_statement("Terminator"           , expression_statement).
		register_statement("NumberLiteral"        , expression_statement).
		register_statement("StringLiteral"        , expression_statement).
		register_statement("BooleanLiteral"       , expression_statement).
		register_statement("UnaryExpression"      , expression_statement).
		register_statement("MemberExpression"     , expression_statement).
		register_statement("SequenceExpression"   , expression_statement).
		register_statement("AssignmentExpression" , expression_statement);
	
	// Block statement {{{3
	symbols.register_statement("BlockExpression", {
		protos : {
			type       : "Block",
			initialize : function (tokens, index, scope) {
				this.type  = this.type;
				this.body  = scope.current_expression.scope.parse();
				this.start = scope.current_expression.start;
				this.end   = scope.current_expression.end;
			},
		},
	});

	// If statement {{{3
	symbols.register_statement("Identifier", {
		is     : function (token) { return token.name === "if"; },
		protos : {
			type       : "If",
			initialize : function (tokens, index, scope) {
				var start = scope.current_expression.start;
				this.type = this.type;

				scope.advance("ParenthesisExpression");
				scope.current_expression.scope.advance();
				this.test = scope.current_expression.scope.expression(0);

				scope.advance();
				this.statement = scope.statement();

				index = scope.token_index;
				scope.advance();

				if (scope.current_expression && scope.current_expression.name === "else") {
					scope.advance();
					this.alternate = scope.statement();
				} else {
					this.alternate    = null;
					scope.token_index = index;
				}

				this.start = start;
				this.end   = (this.alternate || this.statement).end;
			},
		},
	}).

	// For statement {{{3
	register_constructor("ForInStatement", function (start, left, right, statement) {
		this.type      = this.type;
		this.left      = left;
		this.right     = right;
		this.statement = statement;
		this.start     = start;
		this.end       = statement.end;
	}).
	register_statement("Identifier", {
		is     : function (token) { return token.name === "for"; },
		protos : {
			type       : "For",
			initialize : function (tokens, index, scope) {
				var start = scope.current_expression.start;
				this.type = this.type;

				scope.advance("ParenthesisExpression");

				this.init   = scope.current_expression.scope;
				this.test   = null;
				this.update = null;

				scope.advance();
				this.statement = scope.statement();

				this.start = start;
				this.end   = this.statement.end;
			},
			on_register : function (handler, symbols) {
				handler.ForInStatement      = symbols.constructors.ForInStatement;
				handler.VariableDeclaration = symbols.constructors.VariableDeclaration;
			},
			statement_denotation : function () {
				var parenthesis = this.init;

				parenthesis.advance();
				if (parenthesis.current_expression && parenthesis.current_expression.name === "var") {
					var left = new this.VariableDeclaration();
					left.type         = left.type;
					left.declarations = [];
					left.start        = parenthesis.current_expression.start;

					parenthesis.advance();
					if (parenthesis.current_expression.type === "Identifier") {
						left.declare(parenthesis.current_expression);
					
						parenthesis.advance();
						if (parenthesis.current_expression && parenthesis.current_expression.name === "in") {

							parenthesis.advance();
							var right = parenthesis.expression(0);
							if (parenthesis.current_expression) {
								console.error("ERRRRRRRRRRRRRR");
							}
							
							return new this.ForInStatement(this.start, left, right, this.statement);
						} else {
							parenthesis.token_index = 0;
							parenthesis.advance();
							this.init = parenthesis.statement();
						}
					} else {
						console.error("ERRRRRRRRRRRRRR");
					}
				} else {
					this.init = parenthesis.expression(0);
				}

				if (this.init.type === "Terminator") {
					this.init = null;
				}

				if (parenthesis.current_expression) {
					if (parenthesis.current_expression.type === "Terminator") {
						parenthesis.advance();
						this.test = parenthesis.expression(0);

						if (this.test.type === "Terminator") {
							this.test = null;
						}

						if (parenthesis.current_expression && parenthesis.current_expression.type === "Terminator") {
							parenthesis.advance();
							this.update = parenthesis.expression(0);

							return this;
						}
					}

					console.error("ERRRRRRRRRRRRRR");
				} else if (this.init.type === "InExpression") {
					parenthesis.advance();
					if (parenthesis.current_expression) {
						console.error("ERRRRRRRRRRRRRR");
					}
					return new this.ForInStatement(this.start, this.init.left, this.init.right, this.statement);
				}

				console.error("ERRRRRRRRRRRRRR");
			},
		},
	}).

	// While statement {{{3
	register_statement("Identifier", {
		is     : function (token) { return token.name === "while"; },
		protos : {
			type       : "While",
			initialize : function (tokens, index, scope) {
				var start = scope.current_expression.start;
				this.type = this.type;

				scope.advance("ParenthesisExpression");
				scope.current_expression.scope.advance();
				this.test = scope.current_expression.scope.expression(0);

				scope.advance();
				this.statement = scope.statement();

				this.start = start;
				this.end   = this.statement.end;
			},
		},
	}).

	// Switch statement {{{3
	register_statement("Identifier", {
		is     : function (token) { return token.name === "switch"; },
		protos : {
			type       : "Switch",
			initialize : function (tokens, index, scope) {
				var start = scope.current_expression.start;
				this.type = this.type;

				scope.advance("ParenthesisExpression");
				scope.current_expression.scope.advance();
				this.discriminant = scope.current_expression.scope.expression(0);

				this.cases = [];
				scope.advance("BlockExpression");
				this.parse_cases(scope.current_expression.scope, this.cases);

				this.start = start;
				this.end   = scope.current_expression.end;
			},
			on_register : function (protos, symbols) {
				this.SwitchCase  = symbols.constructors.SwitchCase;
				this.DefaultCase = symbols.constructors.DefaultCase;
			},
			parse_cases : function (scope, cases) {
				var _case, start;

				scope.advance("Identifier");

				while (scope.current_expression) {
					switch (scope.current_expression.name) {
						case "case"    :
						case "default" :
							start = scope.current_expression.start;

							if (scope.current_expression.name === "case") {
								_case = new this.SwitchCase();
								scope.advance();
								_case.test = scope.expression(0);
								// error check
							} else {
								_case = new this.DefaultCase();
								scope.advance();
							}

							if (scope.current_expression.type !== "Delimiter") {
								scope.current_expression.error();
							}

							_case.statements = [];
							_case.start      = start;
							_case.end        = scope.current_expression.end;

							while (scope.current_expression) {
								scope.advance();

								if (! scope.current_expression ||
									scope.current_expression.name === "case" ||
									scope.current_expression.name === "default") {
									break;
								}

								_case.statements.push(scope.statement());
							}

							if (_case.statements.length) {
								_case.end = _case.statements[_case.statements.length - 1].end;
							}

							cases.push(_case);

							break;
						default:
							scope.current_expression.error();
					}
				}
			}
		}
	}).

	// Labeled statement {{{3
	register_statement("Identifier", {
		is : function (token, tokens, index) {
			return tokens[index].type === "SpecialCharacter" && tokens[index].value === ':';
		},
		protos : {
			type       : "Labeled",
			precedence : 2,
			initialize : function (tokens, index, scope) {
				var start = scope.current_expression.start;
				this.type = this.type;

				this.label = scope.current_expression.name;

				scope.token_index += 1;
				scope.advance();
				this.statement = scope.statement();

				this.start = start;
				this.end   = this.statement.end;
			}
		},
	}).

	// Try statement {{{3
	register_statement("Identifier", {
		is     : function (token) { return token.name === "try"; },
		protos : {
			type       : "Try",
			initialize : function (tokens, index, scope) {
				var start = scope.current_expression.start;
				this.type = this.type;

				scope.advance("BlockExpression");
				this.block = scope.statement();

				scope.advance("Identifier");
				if (scope.current_expression.name === "catch") {
					this._catch(scope);
					scope.advance();
				} else {
					this.handler = null;
				}

				if (scope.current_expression.name === "finally") {
					scope.advance("BlockExpression");
					this.finalizer = scope.statement();
				} else {
					this.finalizer = null;
				}

				if (! this.handler && ! this.finalizer) {
					console.error("Missing catch or finally after try");
				}

				this.start = start;
				this.end   = scope.current_expression.end;
			},
			on_register : function (protos, symbols) {
				this.CatchClause = symbols.constructors.CatchClause;
			},
			_catch : function (scope) {
				var _catch = new this.CatchClause(),
					start  = scope.current_expression.start;

				scope.advance("ParenthesisExpression");

				scope.current_expression.scope.advance();
				_catch.param = scope.current_expression.scope.expression(1);

				scope.advance("BlockExpression");
				_catch.block = scope.statement();
				_catch.start = start;
				_catch.end   = _catch.block.end;

				this.handler = _catch;
			},
		},
	});

	// Return, Throw statement {{{3
	var initialize_argument = function (tokens, index, scope) {
		var start = scope.current_expression.start;
		this.type = this.type;

		scope.advance();
		this.argument = scope.current_expression.type === "Terminator" ? null : scope.expression(0);

		this.start = start;
		this.end   = scope.current_expression.end;
	};

	symbols.register_statement("Identifier", {
		is     : function (token) { return token.name === "throw"; },
		protos : {
			type       : "Throw",
			initialize : initialize_argument,
		}
	}).
	register_statement("Identifier", {
		is     : function (token) { return token.name === "return"; },
		protos : {
			type       : "Return",
			initialize : initialize_argument,
		}
	});

	// Continue, Break statement {{{3
	var initialize_label = function (tokens, index, scope) {
		var start = scope.current_expression.start;
		this.type = this.type;

		scope.advance();
		if (scope.current_expression.type === "Identifier") {
			this.label = scope.current_expression;
			scope.advance("Terminator");
		} else {
			this.label = null;
		}

		this.start = start;
		this.end   = scope.current_expression.end;
	};

	symbols.register_statement("Identifier", {
		is     : function (token) { return token.name === "break"; },
		protos : {
			type       : "Break",
			initialize : initialize_label,
		}
	}).
	register_statement("Identifier", {
		is     : function (token) { return token.name === "continue"; },
		protos : {
			type       : "Continue",
			initialize : initialize_label,
		}
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
	a++;
	new Fn(1.2E2,2,3);
	PP.define("IS_NULL", function (x) { return x === null;   }, true);
	instance.define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);
	instance.define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);
`;

	var r = p.parse(source);

	//print(r[0].declarations[2].init.body.body[0].argument.arguments[1].body.body[0].argument);
	//print(r[9].statement.body[0]);
	//print(r[12].expression.arguments[2].body.body[0].declarations[0].init.body.body[3]);
	print(r[19]);

	//console.log(r);

	//process.exit();
});

}
// }}}1

module.exports = jeefo;

//ignore:end
