/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : javascript_parser.js
* Created at  : 2017-04-14
* Updated at  : 2017-05-02
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

var js = require("./javascript_tokenizer");

/* globals -PP */
/* exported */
/* exported */

var PP = {
	define : function (name, definition) {
		return definition;
	},
	undef  : function () {}
};

//ignore:end
// Javascript Parser {{{1
js.namespace("javascript.Parser", ["javascript.tokenizer", "tokenizer.Token"], function (tokenizer, Token) {

	var keywords = [
		"break", "continue", "return",
		"do", "for", "while",
		"switch", "case", "default",
		"in", "typeof", "instanceof",
		"try", "catch", "finally", "throw",
		"var", "function", "this",
		"new", "debugger",
		"if", "else",
		"with", "delete", "void",
	];

	var JavascriptParser = function (statement_middlewares, expression_middlewares) {
		this.reserved               = keywords;
		if (statement_middlewares)  { this.statement_middlewares  = statement_middlewares;  }
		if (expression_middlewares) { this.expression_middlewares = expression_middlewares; }
	},
	p = JavascriptParser.prototype;

	// Classes {{{2
	// Statements {{{3
	p.EmptyStatement = function (token) {
		this.type  = "EmptyStatement";
		this.start = token.start;
		this.end   = token.end;
	};
	p.IfStatement = function (start, end, test, statement, alternate) {
		this.type       = "IfStatement";
		this.test       = test;
		this.statement  = statement;
		this.alternate  = alternate || null;
		this.start      = start;
		this.end        = end;
	};
	p.ForStatement = function (start, end, init, test, update, statement) {
		this.type      = "ForStatement";
		this.init      = init;
		this.test      = test;
		this.update    = update;
		this.statement = statement;
		this.start     = start;
		this.end       = end;
	};
	p.ForInStatement = function (start, end, left, right, statement) {
		this.type      = "ForInStatement";
		this.left      = left;
		this.right     = right;
		this.statement = statement;
		this.start     = start;
		this.end       = end;
	};
	p.WhileStatement = function (start, end, test, statement) {
		this.type      = "WhileStatement";
		this.test      = test;
		this.statement = statement;
		this.start     = start;
		this.end       = end;
	};
	p.SwitchStatement = function (start, end, test, cases) {
		this.type  = "SwitchStatement";
		this.test  = test;
		this.cases = cases;
		this.start = start;
		this.end   = end;
	};
	p.LabeledStatement = function (start, end, label, statement) {
		this.type      = "LabeledStatement";
		this.label     = label;
		this.statement = statement;
		this.start     = start;
		this.end       = end;
	};
	p.TryStatement = function (start, end, block, handler, finalizer) {
		this.type      = "TryStatement";
		this.block     = block;
		this.handler   = handler;
		this.finalizer = finalizer;
		this.start     = start;
		this.end       = end;
	};
	p.ReturnStatement = function (start, end, argument) {
		this.type     = "ReturnStatement";
		this.argument = argument;
		this.start    = start;
		this.end      = end;
	};
	p.BreakStatement = function (start, end, label) {
		this.type  = "BreakStatement";
		this.label = label;
		this.start = start;
		this.end   = end;
	};
	p.ContinueStatement = function (start, end, label) {
		this.type  = "ContinueStatement";
		this.label = label;
		this.start = start;
		this.end   = end;
	};
	p.ExpressionStatement = function (start, end, expression) {
		this.type       = "ExpressionStatement";
		this.expression = expression;
		this.start      = start;
		this.end        = end;
	};
	p.BlockStatement = function (token, body) {
		this.type  = "BlockStatement";
		this.body  = body;
		this.start = token.start;
		this.end   = token.end;
	};
	p.ProgramStatement = function (start, end, body) {
		this.type  = "ProgramStatement";
		this.body  = body;
		this.start = start;
		this.end   = end;
	};
	// Literals {{{3
	p.NumberLiteral = function (token) {
		this.type  = "NumberLiteral";
		this.value = token.value;
		this.start = token.start;
		this.end   = token.end;
	};
	p.StringLiteral = function (token) {
		this.type  = "StringLiteral";
		this.value = token.value;
		this.start = token.start;
		this.end   = token.end;
	};
	p.ArrayLiteral = function (token, elements) {
		this.type     = "ArrayLiteral";
		this.elements = elements;
		this.start    = token.start;
		this.end      = token.end;
	};
	p.RegExpLiteral = function (start, end, pattern, flags) {
		this.type  = "RegExpLiteral";
		this.regex = {
			pattern : pattern,
			flags   : flags
		};
		this.start = start;
		this.end   = end;
	};
	p.ObjectLiteral = function (token, properties) {
		this.type       = "ObjectLiteral";
		this.properties = properties;
		this.start      = token.start;
		this.end        = token.end;
	};
	// Expressions {{{3
	p.MemberExpression = function (start, end, object, property, is_computed) {
		this.type        = "MemberExpression";
		this.object      = object;
		this.property    = property;
		this.is_computed = is_computed ? true : false;
		this.start       = start;
		this.end         = end;
	};
	p.CallExpression = function (start, end, callee, args) {
		this.type         = "CallExpression";
		this.callee       = callee;
		this["arguments"] = args;
		this.start        = start;
		this.end          = end;
	};
	p.NewExpression = function (start, end, callee, args) {
		this.type         = "NewExpression";
		this.callee       = callee;
		this["arguments"] = args;
		this.start        = start;
		this.end          = end;
	};
	p.UnaryExpression = function (start, end, operator, argument, is_prefix) {
		this.type      = "UnaryExpression";
		this.operator  = operator;
		this.argument  = argument;
		this.is_prefix = is_prefix ? true : false;
		this.start     = start;
		this.end       = end;
	};
	p.LogicalExpression = function (start, end, left, operator, right) {
		this.type     = "LogicalExpression";
		this.operator = operator;
		this.left     = left;
		this.right    = right;
		this.start    = start;
		this.end      = end;
	};
	p.BinaryExpression = function (start, end, left, operator, right) {
		this.type     = "BinaryExpression";
		this.operator = operator;
		this.left     = left;
		this.right    = right;
		this.start    = start;
		this.end      = end;
	};
	p.AssignmentExpression = function (start, end, left, operator, right) {
		this.type     = "AssignmentExpression";
		this.operator = operator;
		this.left     = left;
		this.right    = right;
		this.start    = start;
		this.end      = end;
	};
	p.ConditionalExpression = function (start, end, test, consequent, alternate) {
		this.type       = "ConditionalExpression";
		this.test       = test;
		this.consequent = consequent;
		this.alternate  = alternate;
		this.start      = start;
		this.end        = end;
	};
	p.SequenceExpression = function (expressions) {
		this.type        = "SequenceExpression";
		this.expressions = expressions;
		this.start       = expressions[0].start;
		this.end         = expressions[expressions.length - 1].end;
	};
	p.FunctionExpression = function (start, end, id, parameters, body) {
		this.type       = "FunctionExpression";
		this.id         = id;
		this.parameters = parameters;
		this.body       = body;
		this.start      = start;
		this.end        = end;
	};
	// Delcarations {{{3
	p.VariableDeclaration = function (start, end, declarators) {
		this.type         = "VariableDeclaration";
		this.declarations = declarators;
		this.start        = start;
		this.end          = end;
	};
	p.VariableDeclarator = function (identifier) {
		this.type  = "VariableDeclarator";
		this.id    = identifier;
		this.init  = null;
		this.start = identifier.start;
		this.end   = identifier.end;
	};
	p.FunctionDeclaration = function (start, end, id, parameters, body) {
		this.type       = "FunctionDeclaration";
		this.id         = id;
		this.parameters = parameters;
		this.body       = body;
		this.start      = start;
		this.end        = end;
	};
	// Others {{{3
	p.Comment = function (token) {
		this.type    = "Comment";
		this.comment = token.value;
		this.start   = token.start;
		this.end     = token.end;
	};
	p.Property = function (key, is_computed) {
		this.type        = "Property";
		this.key         = key;
		this.value       = null;
		this.is_computed = is_computed ? true : false;
		this.start       = key.start;
	};
	p.CatchClause = function (start, end, param, body) {
		this.type  = "CatchClause";
		this.param = param;
		this.body  = body;
		this.start = start;
		this.end   = end;
	};
	p.SwitchCase = function (start, end, test, statements) {
		this.type       = "SwitchCase";
		this.test       = test;
		this.statements = statements;
		this.start      = start;
		this.end        = end;
	};
	p.DefaultCase = function (start, end, statements) {
		this.type       = "DefaultCase";
		this.statements = statements;
		this.start      = start;
		this.end        = end;
	};
	p.Identifier = function (token) {
		this.type  = "Identifier";
		this.name  = token.value;
		this.start = token.start;
	};
	p.Operator = function (operator) {
		this.type     = "Operator";
		this.operator = operator;
	};
	p.Piece = function (token) {
		this.start_token = token;
	};
	p.Temp = function () {};
	p.File = function (name, code, program) {
		this.type    = "File";
		this.name    = name;
		this.code    = code;
		this.program = program;
	};
	p.Program = function (body) {
		this.type  = "Program";
		this.body  = body;
		this.start = body.length ? body[0].start             : { line : 1, column : 1, index : 0 };
		this.end   = body.length ? body[body.length - 1].end : { line : 1, column : 1, index : 0 };
	};
	// }}}3
	// }}}2

	// Parse {{{2
	p.parse = function (filename, source_code) {
		this.raw_tokens = tokenizer(source_code);
		//console.log(888, this.raw_tokens);

		var body    = this.parse_block_statement(this.raw_tokens);
		return new this.File(filename, source_code, new this.Program(body));
	};

	// Parse statement {{{2
	p.parse_statement = function (temp, tokens, start_index) {
		var index = start_index, has_special_characters;

		for (; index < tokens.length; ++index) {
			switch (tokens[index].type) {
				case "Identifier":
					if (index === start_index) {
						switch (tokens[index].value) {
							case "function" :
								return this.parse_function_declaration(temp, tokens, start_index);
							case "var" :
								return this.parse_variable_declaration(temp, tokens, start_index, tokens.length);
							case "return" :
								return this.parse_return_statement(temp, tokens, start_index);
							case "if" :
								return this.parse_if_statement(temp, tokens, start_index);
							case "for" :
								return this.parse_for_statement(temp, tokens, start_index);
							case "while" :
								return this.parse_while_statement(temp, tokens, start_index);
							case "switch" :
								return this.parse_switch_statement(temp, tokens, start_index);
							case "try" :
								return this.parse_try_statement(temp, tokens, start_index);
							case "break" :
								return this.parse_break_statement(temp, tokens, start_index);
							case "continue" :
								return this.parse_continue_statement(temp, tokens, start_index);
						}
					}
					break;
				case "Block":
					if (index === start_index) {
						temp.statement = new this.BlockStatement(
							tokens[start_index],
							this.parse_block_statement(tokens[start_index].children)
						);
						return index;
					}
					break;
				case "SpecialCharacter":
					switch (tokens[index].value) {
						case ':':
							if (! has_special_characters) {
								return this.parse_labeled_statement(temp, tokens, start_index);
							}
							break;
						case ';':
							if (index === start_index) {
								temp.statement = new this.EmptyStatement(tokens[index]);
							} else {
								this.parse_expression_statement(temp, tokens, start_index, index);
							}

							return index;
						case '$':
						case '_':
							break;
						default:
							has_special_characters = true;
					}
					break;
				case "Comment":
					temp.statement = new this.Comment(tokens[index]);
					return index;
			}
		}

		throw Error("Executed unreachable code.");
	};

	// Parse If statement {{{2
	p.parse_if_statement = function (temp, tokens, index, next_token) {
		var i = index + 1, test, statement, alternate;

		if (tokens[i]) {
			if (tokens[i].type === "Parenthesis") {
				test = this.parse_test(temp, tokens[i].children);
				++i;
			} else {
				tokens[i].error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (tokens[i]) {
			i = this.parse_statement(temp, tokens, i);
			if (temp.statement) {
				statement = temp.statement;
			} else {
				throw Error("Fallback error");
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (tokens[i + 1] && tokens[i + 1].type === "Identifier" && tokens[i + 1].value === "else") {
			if (tokens[i + 2]) {
				i = this.parse_statement(temp, tokens, i + 2);
				alternate = temp.statement;
			} else {
				throw Error("Fallback error");
			}
		}

		temp.statement = new this.IfStatement(
			tokens[index].start, tokens[i].end,
			test, statement, alternate
		);

		return i;
	};

	// Parse For statement {{{2
	p.parse_for_statement = function (temp, tokens, index, next_token) {
		var i = index + 1, type, init, test, update, left, right;

		if (tokens[i]) {
			if (tokens[i].type === "Parenthesis") {
				this.parse_for_arguments(temp, tokens[i].children);
				type = temp.type;
				switch (type) {
					case "loop" :
						init   = temp.init;
						test   = temp.test;
						update = temp.update;
						break;
					case "in" :
						left  = temp.left;
						right = temp.right;
						break;
					default:
						throw Error("Fallback error");
				}
				++i;
			} else {
				tokens[i].error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (tokens[i]) {
			i = this.parse_statement(temp, tokens, i);

			if (temp.statement) {
				switch (type) {
					case "loop" :
						temp.statement = new this.ForStatement(
							tokens[index].start, tokens[i].end,
							init, test, update, temp.statement
						);
						break;
					case "in" :
						temp.statement = new this.ForInStatement(
							tokens[index].start, tokens[i].end,
							left, right, temp.statement
						);
						break;
				}
			} else {
				throw Error("error");
			}
		} else {
			next_token.error_unexpected_token();
		}

		return i;
	};

	// Parse While statement {{{2
	p.parse_while_statement = function (temp, tokens, index, next_token) {
		var i = index + 1, test;

		if (tokens[i]) {
			if (tokens[i].type === "Parenthesis") {
				test = this.parse_test(temp, tokens[i].children);
				i = i + 1;
			} else {
				tokens[i].error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (tokens[i]) {
			i = this.parse_statement(temp, tokens, i);
			if (temp.statement) {
				temp.statement = new this.WhileStatement(tokens[index].start, tokens[i].end, test, temp.statement);
			} else {
				throw Error("Fallback error");
			}
		} else {
			next_token.error_unexpected_token();
		}

		return i;
	};

	// Parse Switch statement {{{2
	p.parse_switch_statement = function (temp, tokens, index, next_token) {
		var i = index + 1, body, discriminant;

		if (tokens[i]) {
			if (tokens[i].type === "Parenthesis") {
				this.parse_sequence_expression(temp, tokens[i].children, 0, tokens[i].children.length);
				if (temp.expression) {
					discriminant = temp.expression;
				} else {
					throw Error("Fallback error");
				}
				i = i + 1;
			} else {
				tokens[i].error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (tokens[i]) {
			if (tokens[i].type === "Block") {
				body = this.parse_switch_cases(temp, tokens[i].children);
			} else {
				tokens[i].error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		temp.statement = new this.SwitchStatement(tokens[index].start, tokens[i].end, discriminant, body);

		return i;
	};

	// Parse Labeled statement {{{2
	p.parse_labeled_statement = function (temp, tokens, index) {
		var i, label;

		i = this.parse_identifier(temp, tokens, index);
		label = temp.identifier;

		if (tokens[i + 1]) {
			if (tokens[i + 1].type === "SpecialCharacter" && tokens[i + 1].value === ':') {
				i = this.parse_statement(temp, tokens, i + 2, true);

				temp.statement = new this.LabeledStatement(tokens[index].start, temp.statement.end, label, temp.statement);
			} else {
				tokens[i + 1].error_unexpected_token();
			}
		} else {
			throw Error("Fallback error");
		}

		return i;
	};

	// Parse Try statement {{{2
	p.parse_try_statement = function (temp, tokens, index, next_token) {
		var i = index + 1, handler = null, finalizer = null, j, block, param, body;

		if (tokens[i]) {
			if (tokens[i].type === "Block") {
				block = new this.BlockStatement(tokens[i], this.parse_block_statement(tokens[i].children));
				++i;
			} else {
				tokens[i].error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (tokens[i]) {
			if (tokens[i].type === "Identifier" && tokens[i].value === "catch") {
				++i;

				if (tokens[i]) {
					if (tokens[i].type === "Parenthesis") {
						j = this.parse_identifier(temp, tokens[i].children, 0);
						if (temp.identifier) {
							param = temp.identifier;

							if (tokens[i].children.length > j + 1) {
								tokens[i].children[j + 1].error_unexpected_token();
							}
						} else {
							throw Error("error");
						}

						i = i + 1;
					} else {
						tokens[i].error_unexpected_token();
					}
				} else {
					next_token.error_unexpected_token();
				}

				if (tokens[i]) {
					if (tokens[i].type === "Block") {
						body    = new this.BlockStatement(tokens[i], this.parse_block_statement(tokens[i].children));
						handler = new this.CatchClause(tokens[i - 2].start, tokens[i].end, param, body);
					} else {
						tokens[i].error_unexpected_token();
					}
				} else {
					next_token.error_unexpected_token();
				}
			}
		}

		if (tokens[i + 1]) {
			if (tokens[i + 1].type === "Identifier" && tokens[i + 1].value === "finally") {
				i += 2;

				if (tokens[i]) {
					if (tokens[i].type === "Block") {
						finalizer = new this.BlockStatement(tokens[i], this.parse_block_statement(tokens[i].children));
					} else {
						throw Error("error");
					}
				} else {
					tokens[i].error_unexpected_token();
				}
			}
		}

		if (! handler && ! finalizer) {
			throw Error("Error");
		}

		temp.statement = new this.TryStatement(tokens[index].start, tokens[i].end, block, handler, finalizer);

		return i;
	};

	// Parse Block statement {{{2
	p.parse_block_statement = function (tokens) {
		var temp = new this.Temp(), i = 0, statements = [];

		if (this.statement_middlewares) {
			return this.parse_block_statement_with_middlewares(temp, tokens, statements);
		} else {
			for (; i < tokens.length; ++i) {
				i = this.parse_statement(temp, tokens, i);
				statements.push(temp.statement);
			}
		}

		return statements;
	};

	// Parse Block statement with middlewares {{{2
	p.parse_block_statement_with_middlewares = function (temp, tokens, statements) {
		var i = 0, j, return_index;

		LOOP:
		for (; i < tokens.length; ++i) {
			for (j = 0; j < this.statement_middlewares.length; ++j) {
				return_index = this.statement_middlewares[i](this, temp, tokens, i);

				if (return_index > i) {
					i = return_index;
					statements.push(temp.statement);
					continue LOOP;
				}
			}

			i = this.parse_statement(temp, tokens, i);
			statements.push(temp.statement);
		}

		return statements;
	};

	// Parse Return statement {{{2
	p.parse_return_statement = function (temp, tokens, index) {
		var i = this.parse_sequence_expression(temp, tokens, index + 1, tokens.length);
		temp.statement = new this.ReturnStatement(tokens[index].start, tokens[i].end, temp.expression);

		return i;
	};

	// Parse Break statement {{{2
	p.parse_break_statement = function (temp, tokens, index) {
		var i = index, label = null;

		if (tokens[i + 1]) {
			if (this.is_identifier(tokens[i + 1])) {
				i = this.parse_identifier(temp, tokens, i + 1);
				label = temp.identifier;
			}
		}

		if (tokens[i + 1]) {
			if (tokens[i + 1].type === "SpecialCharacter" && tokens[i + 1].value === ';') {
				++i;
			}
		}

		temp.statement = new this.BreakStatement(tokens[index].start, tokens[i].end, label);
		
		return i;
	};
	
	// Parse Continue statement {{{2
	p.parse_continue_statement = function (temp, tokens, index) {
		var i = index + 1, label = null;

		if (tokens[i]) {
			if (this.is_identifier(tokens[i])) {
				i = this.parse_identifier(temp, tokens, i);
				label = temp.identifier;
			}
		}

		if (tokens[i + 1]) {
			if (tokens[i + 1].type === "SpecialCharacter" && tokens[i + 1].value === ';') {
				++i;
			}
		}

		temp.statement = new this.ContinueStatement(tokens[index].start, tokens[i].end, label);
		
		return i;
	};
	
	// Parse Expression statement {{{2
	p.parse_expression_statement = function (temp, tokens, index, end_index) {
		this.parse_sequence_expression(temp, tokens, index, end_index);
		temp.statement = new this.ExpressionStatement(tokens[index].start, tokens[end_index].end, temp.expression);
	};
	// }}}2

	// Parse Number expression {{{2
	p.parse_number_literal = function () {
		//var 
	};
	// }}}2

	// Parse Variable declaration {{{2
	p.parse_variable_declaration = function (temp, tokens, index, end_index) {
		var i = index + 1, vars = [], expect_identifer = true, declarator;

		// ignore:start
		// Pre processors {{{3
		var PARSE_IDENTIFIER = PP.define("PARSE_IDENTIFIER", function (instance) {
			if (declarator) {
				tokens[i].error_unexpected_type();
			}
			i = instance.parse_identifier(temp, tokens, i);

			declarator = new instance.VariableDeclarator(temp.identifier);
			expect_identifer = false;
		});
		// }}}3
		// ignore:end

		for (; i < end_index; ++i) {
			switch (tokens[i].type) {
				// Number {{{3
				case "Number":
					tokens[i].error("Unexpected ILLEGAL token");
					break;
				// Identifier {{{3
				case "Identifier":
					PARSE_IDENTIFIER(this);
					break;
				// Special characters {{{3
				case "SpecialCharacter":
					switch (tokens[i].value) {
						case '=':
							if (declarator) {
								if (tokens[i + 1]) {
									i = this.parse_expression(temp, tokens, i + 1, end_index);
									declarator.end  = temp.expression.end_token.end;
									declarator.init = temp.expression.parsed_token;

									vars.push(declarator);
									declarator = null;
								} else {
									throw new Error("Fallback error");
								}
							} else {
								tokens[i].error_unexpected_token();
							}
							break;
						case '$':
						case '_':
							PARSE_IDENTIFIER(this);
							break;
						case ',':
							if (declarator) {
								vars.push(declarator);
								declarator = null;
							} else if (expect_identifer) {
								tokens[i].error_unexpected_token();
							}
							expect_identifer = true;
							break;
						case ';':
							if (expect_identifer) {
								tokens[i].error_unexpected_token();
							}
							if (declarator) {
								vars.push(declarator);
							}

							temp.statement = new this.VariableDeclaration(tokens[index].start, tokens[i].end, vars);
							return i;
						default:
							tokens[i].error_unexpected_token();
					}
					break;
				// Comment {{{3
				case "Comment":
					break;
				// Unexpected token {{{3
				default:
					tokens[i].error_unexpected_token();
				// }}}3
			}
		}

		// some kind of error...
		//if (! declarator) { }

		vars.push(declarator);
		temp.statement = new this.VariableDeclaration(tokens[index].start, tokens[i - 1].end, vars);

		return i - 1;
	};

	// Parse Function declaration {{{2
	p.parse_function_declaration = function (temp, tokens, index) {
		var i = index + 1, parameters, id, body;

		if (tokens[i]) {
			if (this.is_identifier(tokens[i])) {
				i  = this.parse_identifier(temp, tokens, i) + 1;
				id = temp.identifier;
			} else {
				tokens[i].error_unexpected_token();
			}
			// some kind of error
			//} else {
		}

		if (tokens[i]) {
			if (tokens[i].type === "Parenthesis") {
				parameters = this.parse_parameters(temp, tokens[i].children);
				++i;
			} else {
				tokens[i].error_unexpected_token();
			}
			// some kind of error
			//} else {
		}

		if (tokens[i]) {
			if (tokens[i].type === "Block") {
				body = new this.BlockStatement(
					tokens[i],
					this.parse_block_statement(tokens[i].children)
				);
			} else {
				tokens[i].error_unexpected_token();
			}
			// some kind of error
			//} else {
		}

		temp.statement = new this.FunctionDeclaration(tokens[index].start, body.end, id, parameters, body);

		return i;
	};
	// }}}2

	// Parse expression {{{2
	p.parse_expression = function (temp, tokens, i, end_index, delimiter) {
		var j = 0, pieces = [];

		LOOP:
		for (; i < end_index; ++i) {
			if (tokens[i].type === "SpecialCharacter") {
				switch (tokens[i].value) {
					case ',':
					case ';':
					case delimiter:
						break LOOP;
				}
			}
			i = this.parse_expression_piece(temp, tokens, i);

			if (temp.piece.parsed_token) {
				pieces.push(temp.piece);
			}
		}

		this.assemble_pieces(pieces, 0);

		for (; j < pieces.length; ++j) {
			if (pieces[j]) {
				temp.expression = pieces[j];
				break;
			}
		}
		/*
		var c = 0;
		for (j = 0; j < pieces.length; ++j) {
			if (pieces[j]) {
				c += 1;
			}
		}
		if (c > 1) {
			console.log("HERE", pieces);
			process.exit()
		}
		*/
		
		return i - 1;
	};

	// Parse expression pieces {{{2
	p.parse_expression_piece = function (temp, tokens, i) {
		temp.piece = new this.Piece(tokens[i]);

		if (this.expression_middlewares) {
			for (var j = 0; j < this.expression_middlewares.length; ++j) {
				i = this.expression_middlewares[j](this, temp.piece, tokens, i);

				if (temp.piece.parsed_token) {
					temp.piece.end_token = tokens[i];
					return i;
				}
			}
		}

		switch (tokens[i].type) {
			// Number literal {{{3
			case "Number":
				temp.piece.parsed_token = new this.NumberLiteral(tokens[i]);
				break;
			// String literal {{{3
			case "String":
				temp.piece.parsed_token = new this.StringLiteral(tokens[i]);
				break;
			// Regex literal {{{3
			case "RegExp":
				i = this.parse_regex(temp.piece, tokens, i);
				break;
			// Identifier {{{3
			case "Identifier":
				i = this.parse_identifier(temp, tokens, i);

				switch (temp.identifier.name) {
					case "in"         :
					case "void"       :
					case "delete"     :
					case "typeof"     :
					case "instanceof" :
						temp.piece.parsed_token = new this.Operator(temp.identifier.name);
						break;
					default:
						temp.piece.parsed_token = temp.identifier;
				}

				temp.piece.start_token = temp.piece.end_token = temp.token;
				break;
			// Parenthesis, Square bracket, Curly bracket {{{3
			case "Array":
			case "Block":
			case "Parenthesis":
				temp.piece.parsed_token = { type : tokens[i].type };
				break;
			// Special characters {{{3
			case "SpecialCharacter":
				switch (tokens[i].value) {
					case '_' :
					case '$' :
						i = this.parse_identifier(temp, tokens, i);
						temp.piece.parsed_token = temp.identifier;
						temp.piece.start_token  = temp.piece.end_token = temp.token;
						break;
					default:
						i = this.parse_operators(temp.piece, tokens, i);
				}
				break;
			// Comment {{{3
			case "Comment":
				temp.piece.parsed_token = null;
			// }}}3
		}

		if (! temp.piece.end_token) {
			temp.piece.end_token = tokens[i];
		}

		return i;
	};

	// Parse New expression {{{2
	p.parse_new_expression = function (pieces, index, next_token) {
		var i = index + 1, callee;

		this.assemble_pieces(pieces, i, next_token, "Parenthesis");

		for (; i < pieces.length; ++i) {
			if (pieces[i]) {
				callee    = pieces[i];
				pieces[i] = null;
				break;
			}
		}

		if (callee.parsed_token.type === "CallExpression") {
			pieces[index].parsed_token = new this.NewExpression(
				pieces[index].start_token.start, callee.end_token.end,
				callee.parsed_token.callee, callee.parsed_token["arguments"]
			);
		} else {
			pieces[index].parsed_token = new this.NewExpression(
				pieces[index].start_token.start, callee.end_token.end,
				callee.parsed_token, []
			);
		}
		pieces[index].end_token = callee.end_token;

		return i;
	};

	// Parse Unary expression {{{2
	p.parse_unary_expression = function (pieces, indices, next_token) {
		for (var j = 0, i, index, operand; j < indices.length; ++j) {
			index = indices[j];

			switch (pieces[index].parsed_token.operator) {
				case "--" :
				case "++" :
					if (pieces[index - 1] && pieces[index - 1].parsed_token &&
						pieces[index - 1].parsed_token.type !== "Operator" &&
						pieces[index - 1].parsed_token.type !== "NumberLiteral") {

						pieces[index - 1].parsed_token = new this.UnaryExpression(
							pieces[index - 1].start_token.start,
							pieces[index].end_token.end,
							pieces[index].parsed_token.operator,
							pieces[index - 1].parsed_token
						);
						pieces[index - 1].end_token = pieces[index].end_token;
					} else if (
						pieces[index + 1] && pieces[index + 1].parsed_token &&
						pieces[index + 1].parsed_token.type !== "Operator" &&
						pieces[index + 1].parsed_token.type !== "NumberLiteral") {

						pieces[index + 1].parsed_token = new this.UnaryExpression(
							pieces[index].start_token.start,
							pieces[index + 1].end_token.end,
							pieces[index].parsed_token.operator,
							pieces[index + 1].parsed_token,
							true
						);
						pieces[index + 1].start_token = pieces[index].start_token;
					}
					pieces[index] = null;
					return;
				case '+'      :
				case '-'      :
				case '!'      :
				case '~'      :
				case "void"   :
				case "delete" :
				case "typeof" :
					i = index + 1;

					for (; i < pieces.length; ++i) {
						if (pieces[i]) {
							operand   = pieces[i];
							pieces[i] = null;
							break;
						}
					}

					if (! operand) {
						next_token.error_unexpected_token();
					}

					if (operand.parsed_token && operand.parsed_token.type === "Operator") {
						operand.start_token.error_unexpected_token();
					}

					if (operand) {
						pieces[index].parsed_token = new this.UnaryExpression(
							pieces[index].start_token.start,
							operand.end_token.end,
							pieces[index].parsed_token.operator,
							operand.parsed_token,
							true
						);
						pieces[index].end_token = operand.end_token;
					}
					break;
			}
		}
	};

	// Parse Binary expression {{{2
	p.parse_binary_expression = function (pieces, indices, Expression) {
		for (var i = 0, j, left, right; i < indices.length; ++i) {
			for (j = indices[i] - 1; j >= 0; --j) {
				if (pieces[j]) {
					left      = pieces[j];
					pieces[j] = null;
					break;
				}
			}

			for (j = indices[i] + 1; j < pieces.length; ++j) {
				if (pieces[j]) {
					right     = pieces[j];
					pieces[j] = null;
					break;
				}
			}

			pieces[indices[i]].parsed_token = new Expression(
				left.start_token.start, right.end_token.end,
				left.parsed_token, pieces[indices[i]].parsed_token.operator, right.parsed_token
			);
			pieces[indices[i]].start_token = left.start_token;
			pieces[indices[i]].end_token   = right.end_token;
		}
	};

	// Parse Member expression {{{2
	p.parse_member_expression = function (pieces, index) {
		var i, object, property;

		switch (pieces[index].parsed_token.type) {
			case "Operator":
				for (i = index - 1; i >= 0; --i) {
					if (pieces[i]) {
						object = pieces[i];

						if (object.parsed_token.type === "Parenthesis") {
							return false;
						}

						pieces[i] = null;
						break;
					}
				}

				for (i = index + 1; i >= 0; ++i) {
					if (pieces[i]) {
						property  = pieces[i];
						pieces[i] = null;
						break;
					}
				}


				pieces[index].parsed_token = new this.MemberExpression(
					object.start_token.start, property.end_token.end,
					object.parsed_token     , property.parsed_token
				);
				pieces[index].start_token = object.start_token;
				pieces[index].end_token   = property.end_token;
				break;
			case "Array":
				for (i = index - 1; i >= 0; --i) {
					if (pieces[i] && pieces[i].parsed_token.type !== "Operator") {
						object    = pieces[i];

						if (object.parsed_token.type === "Parenthesis") {
							return false;
						}

						pieces[i] = null;
						break;
					}
				}

				property = pieces[index].parsed_token;
				this.parse_sequence_expression(
					property, pieces[index].start_token.children,
					0, pieces[index].start_token.children.length
				);

				if (property.expression) {
					pieces[index].parsed_token = new this.MemberExpression(
						object.start_token.start, pieces[index].end_token.end,
						object.parsed_token, property.expression, true
					);
				} else {
					throw Error("Fallback error");
				}
				pieces[index].start_token = object.start_token;

				break;
		}

		return true;
	};

	// Parse Function expression {{{2
	p.parse_function_expression = function (pieces, index, next_token) {
		var id = null, i = index + 1, parameters, body;

		if (pieces[i]) {
			if (pieces[i].parsed_token.type === "Identifier") {
				id        = pieces[i].parsed_token;
				pieces[i] = null;
				++i;
			} else if (pieces[i].parsed_token.type !== "Parenthesis") {
				pieces[i].start_token.error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (pieces[i]) {
			if (pieces[i].parsed_token.type === "Parenthesis") {
				parameters = this.parse_parameters(pieces[i], pieces[i].start_token.children);
				pieces[i]  = null;
				++i;
			} else {
				pieces[i].start_token.error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		if (pieces[i]) {
			if (pieces[i].parsed_token.type === "Block") {
				body = new this.BlockStatement(
					pieces[i].start_token,
					this.parse_block_statement(pieces[i].start_token.children)
				);
				pieces[i] = null;
			} else {
				pieces[i].start_token.error_unexpected_token();
			}
		} else {
			next_token.error_unexpected_token();
		}

		pieces[index].parsed_token = new this.FunctionExpression(pieces[index].start_token.start, body.end, id, parameters, body);

		return i;
	};

	// Parse Sequence expression {{{2
	p.parse_sequence_expression = function (temp, tokens, i, end_index, is_raw, delimiter) {
		var expressions = [];

		LOOP:
		for (; i < end_index; ++i) {
			temp.expression = null;
			i = this.parse_expression(temp, tokens, i, end_index, delimiter);

			if (temp.expression) {
				expressions.push(temp.expression.parsed_token);
			}

			if (tokens[i + 1]) {
				if (tokens[i + 1].type === "SpecialCharacter") {
					switch (tokens[i + 1].value) {
						case ';':
						case delimiter :
							i += 2;
							break LOOP;
						case ',':
							++i;
							break;
						default:
							tokens[i + 1].error_unexpected_token();
					}
				} else {
					tokens[i + 1].error_unexpected_token();
				}
			}
		}

		if (is_raw) {
			temp.expressions = expressions;
		} else {
			if (expressions.length > 1) {
				temp.expression = new this.SequenceExpression(expressions);
			} else if (expressions.length === 1) {
				temp.expression = expressions[0];
			} else {
				temp.expression = null;
			}
		}

		return i - 1;
	};

	// Parse Assignment expression {{{2
	p.parse_assignment_expression = function (pieces, indices) {
		for (var i = 0, j, left, right; i < indices.length; ++i) {
			for (j = indices[i] - 1; j >= 0; --j) {
				if (pieces[j]) {
					left      = pieces[j];
					pieces[j] = null;
					break;
				}
			}

			switch (left.parsed_token.type) {
				case "Identifier" :
				case "MemberExpression" :
				case "AssignmentExpression" :
					break;
				default:
					left.start_token.error("Assigning to rvalue");
			}

			for (j = indices[i] + 1; j < pieces.length; ++j) {
				if (pieces[j]) {
					right     = pieces[j];
					pieces[j] = null;
					break;
				}
			}

			pieces[indices[i]].parsed_token = new this.AssignmentExpression(
				left.start_token.start, right.end_token.end,
				left.parsed_token, pieces[indices[i]].parsed_token.operator, right.parsed_token
			);
			pieces[indices[i]].start_token = left.start_token;
			pieces[indices[i]].end_token   = right.end_token;
		}
	};

	// Parse Conditional expression {{{2
	p.parse_conditional_expression = function (pieces, indices) {
		var i = 0, j, index, test, consequent, alternate;
		for (; i < indices.length; ++i, test = null) {
			for (j = indices[i] - 1; j >= 0; --j) {
				if (pieces[j]) {
					index = j;
					test  = pieces[j];
					break;
				}
			}

			if (! test) {
				throw Error("Fallback error");
			} else if (test.parsed_token.type === "Operator") {
				throw Error("Fallback error");
			}

			for (j = indices[i] + 1; j < pieces.length; ++j) {
				if (pieces[j]) {
					consequent = pieces[j];
					pieces[j]  = null;
					break;
				}
			}

			for (j = indices[i] + 1; j < pieces.length; ++j) {
				if (pieces[j]) {
					if (pieces[j].parsed_token.type === "Operator") {
						pieces[j] = null;
					} else {
						pieces[j].start_token.error_unexpected_token();
					}
					break;
				}
			}

			for (j = indices[i] + 1; j < pieces.length; ++j) {
				if (pieces[j]) {
					alternate = pieces[j];
					pieces[j] = null;
					break;
				}
			}

			pieces[indices[i]] = null;
			pieces[index].parsed_token = new this.ConditionalExpression(
				test.start_token.start, alternate.end_token.end,
				test.parsed_token, consequent.parsed_token, alternate.parsed_token
			);
			pieces[index].start_token = test.start_token;
			pieces[index].end_token   = alternate.end_token;
		}
	};
	// }}}2

	// Parse Array {{{2
	p.parse_array = function (tokens) {
		var i = 0, temp = new this.Temp(), elements = [];

		for (; i < tokens.length; ++i) {
			if (tokens[i].type === "SpecialCharacter") {
				if (tokens[i].value === ',') {
					if (temp.to_add) {
						elements.push(temp.expression.parsed_token);
						temp.to_add = false;
					} else {
						elements.push(null);
					}
				} else {
					tokens[i].error_unexpected_token();
				}
			} else {
				i = this.parse_expression(temp, tokens, i, tokens.length);
				temp.to_add = true;
			}
		}

		if (temp.to_add) {
			elements.push(temp.expression.parsed_token);
		}

		return elements;
	};

	// Parse Switch case {{{2
	p.parse_switch_cases = function (temp, tokens) {
		var i = 0, body = [], index, j, test, statements;

		TOP:
		for (; i < tokens.length; ++i) {
			switch (tokens[i].type) {
				case "Comment":
					body.push(new this.Comment(tokens[i]));
					continue TOP;
				case "Identifier" :
					break;
				default:
					tokens[i].error_unexpected_token();
			}

			SWITCH:
			switch (tokens[i].value) {
				case "case" :
					index = i;

					if (tokens[i + 1]) {
						if (tokens[i + 1].type === "SpecialCharacter" && tokens[i + 1].value === ':') {
							tokens[i + 1].error_unexpected_token();
						} else {
							i = this.parse_sequence_expression(temp, tokens, i + 1, tokens.length, false, ':');
						}
					} else {
						throw new Error("Fallback error");
					}

					if (tokens[i]) {
						if (tokens[i].type === "SpecialCharacter" && tokens[i].value === ':') {
							test       = temp.expression;
							statements = [];

							if (i + 1 === tokens.length) {
								body.push(new this.SwitchCase(tokens[index].start, tokens[i].end, test, statements));
								break;
							}

							CASE_SEARCH_NEXT_LOOP:
							for (j = i + 1; j < tokens.length; ++j) {
								switch (tokens[j].type) {
									case "Comment":
										break;
									case "Identifier":
										switch (tokens[j].value) {
											case "case":
											case "default":
												body.push(new this.SwitchCase(tokens[index].start, tokens[i].end, test, statements));
												break SWITCH;
										}
										break CASE_SEARCH_NEXT_LOOP;
									default:
										break CASE_SEARCH_NEXT_LOOP;
								}
							}

							CASE_LOOP:
							for (++i; i < tokens.length; ++i) {
								i = this.parse_statement(temp, tokens, i);
								statements.push(temp.statement);

								if (tokens[i + 1] && tokens[i + 1].type === "Identifier") {
									switch (tokens[i + 1].value) {
										case "case" :
										case "default" :
											break CASE_LOOP;
									}
								} else {
									break;
								}
							}

							body.push(new this.SwitchCase(tokens[index].start, tokens[i].end, test, statements));
						} else {
							tokens[i].error_unexpected_token();
						}
					} else {
						throw new Error("Fallback error");
					}
					break;
				case "default" :
					index = i;

					if (tokens[i + 1]) {
						if (tokens[i + 1].type === "SpecialCharacter" && tokens[i + 1].value === ':') {
							++i;
							statements = [];

							if (i + 1 === tokens.length) {
								body.push(new this.DefaultCase(tokens[index].start, tokens[i].end, statements));
								break;
							}

							DEFAULT_SEARCH_NEXT_LOOP:
							for (j = i + 1; j < tokens.length; ++j) {
								switch (tokens[j].type) {
									case "Comment":
										break;
									case "Identifier":
										switch (tokens[j].value) {
											case "case":
											case "default":
												body.push(new this.DefaultCase(tokens[index].start, tokens[i].end, statements));
												break SWITCH;
										}
										break DEFAULT_SEARCH_NEXT_LOOP;
									default:
										break DEFAULT_SEARCH_NEXT_LOOP;
								}
							}

							DEFAULT_LOOP:
							for (++i; i < tokens.length; ++i) {
								i = this.parse_statement(temp, tokens, i);
								statements.push(temp.statement);

								if (tokens[i + 1] && tokens[i + 1].type === "Identifier") {
									switch (tokens[i + 1].value) {
										case "case" :
										case "default" :
											break DEFAULT_LOOP;
									}
								} else {
									break;
								}
							}

							body.push(new this.DefaultCase(tokens[index].start, tokens[i].end, statements));
						} else {
							tokens[i].error_unexpected_token();
						}
					} else {
						throw new Error("Fallback error");
					}
					break;
				default:
					tokens[i].error_unexpected_token();
			}
		}

		return body;
	};

	// Parse Operators {{{2
	p.parse_operators = function (temp, tokens, i) {
		// ignore:start
		var EXPECT = PP.define("EXPECT", function (symbol, PREVIOUS_INDEX, INDEX) {
			return tokens[INDEX].value === symbol && tokens[INDEX].start.index === tokens[PREVIOUS_INDEX].end.index;
		}, true);
		// ignore:end

		switch (tokens[i].value) {
			case '.':
				temp.parsed_token = new this.Operator('.');
				return i;
			case '-':
				if (EXPECT('-', i, i + 1)) {
					temp.parsed_token = new this.Operator("--");
					return i + 1;
				} else if (EXPECT('=', i, i + 1)) {
					temp.parsed_token = new this.Operator("-=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('-');
				return i;
			case '+':
				if (EXPECT('+', i, i + 1)) {
					temp.parsed_token = new this.Operator("++");
					return i + 1;
				} else if (EXPECT('=', i, i + 1)) {
					temp.parsed_token = new this.Operator("+=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('+');
				return i;
			case '/':
				if (EXPECT('=', i, i + 1)) {
					temp.parsed_token = new this.Operator("/=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('/');
				return i;
			case '*':
				if (EXPECT('=', i, i + 1)) {
					temp.parsed_token = new this.Operator("*=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('*');
				return i;
			case '%':
				if (EXPECT('=', i, i + 1)) {
					temp.parsed_token = new this.Operator("%=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('%');
				return i;
			case '=':
				if (EXPECT('=', i, i + 1)) {
					if (EXPECT('=', i + 1, i + 2)) {
						temp.parsed_token = new this.Operator("===");
						return i + 2;
					}

					temp.parsed_token = new this.Operator("==");
					return i + 1;
				}

				temp.parsed_token = new this.Operator('=');
				return i;
			case '&':
				if (EXPECT('&', i, i + 1)) {
					temp.parsed_token = new this.Operator("&&");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('&');
				return i;
			case '|':
				if (EXPECT('|', i, i + 1)) {
					temp.parsed_token = new this.Operator("||");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('|');
				return i;
			case '>':
				if (EXPECT('=', i, i + 1)) {
					temp.parsed_token = new this.Operator(">=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('>');
				return i;
			case '<':
				if (EXPECT('=', i, i + 1)) {
					temp.parsed_token = new this.Operator("<=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('<');
				return i;
			case '!':
				if (EXPECT('=', i, i + 1)) {
					if (EXPECT('=', i + 1, i + 2)) {
						temp.parsed_token = new this.Operator("!==");
						return i + 2;
					}

					temp.parsed_token = new this.Operator("!=");
					return i + 1;
				}
				temp.parsed_token = new this.Operator('!');
				return i;
			case '?':
			case ':':
				temp.parsed_token = new this.Operator(tokens[i].value);
				return i;
			default:
				tokens[i].error_unexpected_token();
		}
	};

	// Parse Identifier {{{2
	p.parse_identifier = function (temp, tokens, index) {
		var identifier = temp.identifier = new this.Identifier(tokens[index]), i = index + 1;

		LOOP:
		for (; i < tokens.length; ++i) {
			switch (tokens[i].type) {
				case "Number":
				case "Identifier":
					if (tokens[i - 1].end.index === tokens[i].start.index) {
						identifier.name = identifier.name + tokens[i].value;
					} else {
						break LOOP;
					}
					break;
				case "SpecialCharacter":
					switch (tokens[i].value) {
						case '$':
						case '_':
							if (tokens[i - 1].end.index === tokens[i].start.index) {
								identifier.name = identifier.name + tokens[i].value;
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

		identifier.end = tokens[i - 1].end;

		temp.token = new Token({
			type  : "Identifier",
			value : identifier.name,
			start : tokens[index].start,
			end   : tokens[i - 1].end,
		});

		return i - 1;
	};

	// Parse Parenthesis {{{2
	p.parse_parenthesis = function (pieces, index) {
		var i = index - 1, temp = pieces[index].parsed_token, callee, args;

		for (; i >= 0; --i) {
			if (pieces[i]) {
				if (pieces[i].parsed_token.type !== "Operator") {
					callee    = pieces[i];
					pieces[i] = null;
				}
				break;
			}
		}

		if (callee) {
			args = this.parse_arguments(temp, pieces[index].start_token.children);

			pieces[index].parsed_token = new this.CallExpression(
				callee.start_token.start,
				pieces[index].end_token.end,
				callee.parsed_token,
				args
			);
			pieces[index].start_token = callee.start_token;
		} else {
			this.parse_sequence_expression(
				temp, pieces[index].start_token.children,
				0, pieces[index].start_token.children.length
			);
			pieces[index].parsed_token = temp.expression;
		}
	};

	// Parse RegExp {{{2
	p.REGEX_FLAGS = "gimuy";

	p.parse_regex = function (piece, tokens, index) {
		var next_index = index + 1, i = 0, flags = '', has_flags, value;

		if (tokens[next_index] && tokens[index].end.index === tokens[next_index].start.index && tokens[next_index].type === "Identifier") {
			value     = tokens[next_index].value;
			has_flags = true;

			for (i = value.length - 1; i >= 0; --i) {
				if (this.REGEX_FLAGS.indexOf(value.charAt(i)) !== -1 && flags.indexOf(value.charAt(i)) === -1) {
					flags = flags + value.charAt(i);
				} else {
					tokens[next_index].error("Invalid regular expression flags");
				}
			}
		}

		if (! has_flags) {
			flags      = '';
			next_index = index;
		}

		piece.parsed_token = new this.RegExpLiteral(
			tokens[index].start, tokens[next_index].end,
			tokens[index].value, flags
		);

		return next_index;
	};

	// Parse Arguments {{{2
	p.parse_arguments = function (temp, tokens) {
		this.parse_sequence_expression(temp, tokens, 0, tokens.length, true);
		return temp.expressions;
	};

	// Parse For arguments {{{2
	p.parse_for_arguments = function (temp, tokens) {
		var is_var = (tokens[0] && tokens[0].type === "Identifier" && tokens[0].value === "var"),
			i = is_var ? 1 : 0;

		if (tokens[i]) {
			temp.identifier = null;

			if (this.is_identifier(tokens[i])) {
				i = this.parse_identifier(temp, tokens, i);

				// TODO: replace binary 'in' operator
				temp.type = (tokens[i + 1] && tokens[i + 1].value === "in") ? "in" : "loop";
			} else {
				temp.type = "loop";
			}

			switch (temp.type) {
				case "in":
					if (is_var) {
						temp.left = new this.VariableDeclaration(tokens[0].start, temp.identifier.end, [
							new this.VariableDeclarator(temp.identifier)
						]);
					} else {
						temp.left = temp.identifier;
					}

					i = this.parse_sequence_expression(temp, tokens, i + 2, tokens.length);
					if (temp.expression) {
						temp.right = temp.expression;
					} else {
						throw Error("error");
					}
					break;
				case "loop":
					if (is_var) {
						i = this.parse_variable_declaration(temp, tokens, 0, tokens.length);
						temp.init = temp.statement;
					} else {
						i = this.parse_sequence_expression(temp, tokens, 0, tokens.length);
						temp.init = temp.expression;
					}

					if (tokens[i].type === "SpecialCharacter" && tokens[i].value === ';') {
						i = this.parse_sequence_expression(temp, tokens, i + 1, tokens.length);
						temp.test = temp.expression;
					} else {
						throw Error("ERROR");
					}

					if (tokens[i].type === "SpecialCharacter" && tokens[i].value === ';') {
						i = this.parse_sequence_expression(temp, tokens, i + 1, tokens.length);
						temp.update = temp.expression;
					} else {
						throw Error("ERROR");
					}
					break;
			}
		} else {
			throw Error("error");
		}
	};

	// Parse Parameters {{{2
	p.parse_parameters = function (temp, tokens) {
		var i = 0, params = [];

		for (; i < tokens.length; ++i) {
			if (this.is_identifier(tokens[i])) {
				i = this.parse_identifier(temp, tokens, i);

				if (tokens[i + 1]) {
					if (tokens[i + 1].type === "SpecialCharacter" && tokens[i + 1].value === ',') {
						++i;
					} else {
						tokens[i + 1].error_unexpected_token();
					}
				}

				params.push(temp.identifier);
			} else {
				tokens[i].error_unexpected_token();
			}
		}

		return params;
	};

	// Parse Test {{{2
	p.parse_test = function (temp, tokens) {
		this.parse_sequence_expression(temp, tokens, 0, tokens.length);
		if (temp.expression) {
			return temp.expression;
		}
		throw Error("Fallback error");
	};

	// Parse Object literal {{{2
	p.parse_object_literal = function (block_token) {
		var i = 0, properties = [], temp = new this.Temp(), tokens = block_token.children, property, expect_value;

		for (; i < tokens.length; ++i) {
			if (! property && this.is_identifier(tokens[i])) {
				i = this.parse_identifier(temp, tokens, i);
				property = new this.Property(temp.identifier);
				continue;
			}

			switch (tokens[i].type) {
				case "Number":
					if (property) {
						tokens[i].error_unexpected_type();
					}
					property = new this.Property(new this.NumberLiteral(tokens[i]));
					expect_value = true;
					break;
				case "String":
					if (property) {
						tokens[i].error_unexpected_type();
					}
					property = new this.Property(new this.StringLiteral(tokens[i]));
					expect_value = true;
					break;
				case "Array":
					break;
				case "SpecialCharacter":
					switch (tokens[i].value) {
						case ':':
							if (expect_value) {
								i = this.parse_expression(temp, tokens, i + 1, tokens.length);
								expect_value   = false;
								property.value = temp.expression.parsed_token;
							} else if (property) {
								i = this.parse_expression(temp, tokens, i + 1, tokens.length);
								property.value = temp.expression.parsed_token;
							} else {
								tokens[i].error_unexpected_token();
							}

							properties.push(property);
							property = null;
							break;
						case ',':
							if (expect_value) {
								tokens[i].error_unexpected_token();
							} else if (property) {
								property.value = property.key;
								property.end   = property.value.end;

								properties.push(property);
								property = null;
							}
							break;
						default:
							tokens[i].error_unexpected_token();
					}
					break;
				default:
					tokens[i].error_unexpected_token();
			}
		}

		if (property) {
			if (expect_value) {
				throw Error("Fallback error");
			}

			property.value = property.key;
			property.end   = property.value.end;
			properties.push(property);
		}

		return new this.ObjectLiteral(block_token, properties);
	};

	p.parse_block = function (pieces, index) {
		//var tokens = pieces[index], i = 0, is_object_literal = true;

		//for (; i < tokens.length; ++i) { }
		
		pieces[index].parsed_token = this.parse_object_literal(pieces[index].start_token);
	};
	// }}}2

	// Assemble pieces {{{2
	// learned from : https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
	p.assemble_pieces = function (pieces, i, next_token, until) {

		var member_operator_indices      = [],
			parenthesis_indices          = [],
			unary_operator_indices       = [],
			high_math_operator_indices   = [],
			medium_math_operator_indices = [],
			low_math_operator_indices    = [],
			conditional_operator_indices = [],
			logical_operator_indices     = [], // fixme: less than or greater than is
			ternary_operator_indices     = [],
			assignment_operator_indices  = [];

		for (; i < pieces.length; ++i) {
			switch (pieces[i].parsed_token.type) {
				case "Identifier":
					switch (pieces[i].parsed_token.name) {
						case "new" :
							i = this.parse_new_expression(pieces, i);
							break;
						case "function" :
							i = this.parse_function_expression(pieces, i);
							break;
					}
					break;
				case "Operator":
					switch (pieces[i].parsed_token.operator) {
						case '?':
							ternary_operator_indices.unshift(i);
							break;
						case "&&":
						case "||":
							logical_operator_indices.push(i);
							break;
						case '.' :
							member_operator_indices.push({ index : i });
							break;
						case '!'      :
						case '~'      :
						case "++"     :
						case "--"     :
						case "void"   :
						case "delete" :
						case "typeof" :
							unary_operator_indices.unshift(i);
							break;
						case '<'   :
						case '>'   :
						case "<="  :
						case ">="  :
						case "=="  :
						case "===" :
						case "!="  :
						case "!==" :
							conditional_operator_indices.push(i);
							break;
						case '+'   :
						case '-'   :
							if (pieces[i - 1] && pieces[i - 1].parsed_token.type === "Operator") {
								unary_operator_indices.unshift(i);
							} else {
								medium_math_operator_indices.push(i);
							}
							break;
						case '*'   :
						case '/'   :
						case '%'   :
							high_math_operator_indices.push(i);
							break;
						case "=":
						case "+=":
						case "-=":
						case "*=":
						case "/=":
						case "%=":
						case "&=":
						case "^=":
						case "|=":
						case "**=":
						case "<<=":
						case ">>=":
						case ">>>=":
							assignment_operator_indices.push(i);
							break;
					}
					break;
				case "Parenthesis":
					parenthesis_indices.push(i);
					break;
				case "Array":
					if (pieces[i - 1] && pieces[i - 1].parsed_token.type !== "Operator") {
						member_operator_indices.push({ index : i });
					} else {
						pieces[i].parsed_token = new this.ArrayLiteral(
							pieces[i].start_token,
							this.parse_array(pieces[i].start_token.children)
						);
					}
					break;
				case "Block":
					this.parse_block(pieces, i);
					break;
			}

			if (until && pieces[i].parsed_token.type === until) {
				break;
			}
		}

		for (i = 0; i < member_operator_indices.length; ++i) {
			member_operator_indices[i].is_parsed = this.parse_member_expression(pieces, member_operator_indices[i].index);
		}
		for (i = parenthesis_indices.length - 1; i >= 0; --i) {
			this.parse_parenthesis(pieces, parenthesis_indices[i]);
		}
		for (i = 0; i < member_operator_indices.length; ++i) {
			if (! member_operator_indices[i].is_parsed) {
				this.parse_member_expression(pieces, member_operator_indices[i].index);
			}
		}
		this.parse_unary_expression(pieces, unary_operator_indices);
		this.parse_binary_expression(pieces, high_math_operator_indices, this.BinaryExpression);
		this.parse_binary_expression(pieces, medium_math_operator_indices, this.BinaryExpression);
		this.parse_binary_expression(pieces, low_math_operator_indices, this.BinaryExpression);
		this.parse_binary_expression(pieces, conditional_operator_indices, this.BinaryExpression);
		this.parse_binary_expression(pieces, logical_operator_indices, this.LogicalExpression);
		this.parse_conditional_expression(pieces, ternary_operator_indices);
		this.parse_assignment_expression(pieces, assignment_operator_indices);
	};
	// }}}2

	// Is Identifier {{{2
	p.is_identifier = function (token) {
		return token.type === "Identifier" || token.value === '$' || token.value === '_';
	};

	// Error End of file {{{2
	p.error_end_of_file = function () {
		this.raw_tokens[this.raw_tokens.length - 1].error("Unexpected end of file");
	};
	// }}}2

	var JavascriptParserWrapper = function () {
		this.statement_middlewares  = [];
		this.expression_middlewares = [];
	};
	p = JavascriptParserWrapper.prototype;

	p.JavascriptParser = JavascriptParser;
	p.clone_middlewares = function (middlewares) {
		var i = 0, clone = new Array(middlewares.length);

		for (; i < clone.length; ++i) {
			clone[i] = middlewares[i];
		}

		return clone;
	};

	p.statement = function (middleware) {
		if (this.statement_middlewares) {
			this.statement_middlewares.push(middleware);
		} else {
			this.statement_middlewares = [middleware];
		}
	};
	p.expression = function (middleware) {
		if (this.expression_middlewares) {
			this.expression_middlewares.push(middleware);
		} else {
			this.expression_middlewares = [middleware];
		}
	};

	p.parse = function (filename, source_code) {
		var parser = new this.JavascriptParser(
			this.statement_middlewares  && this.clone_middlewares(this.statement_middlewares),
			this.expression_middlewares && this.clone_middlewares(this.expression_middlewares)
		);
		return parser.parse(filename, source_code);
	};

	return JavascriptParserWrapper;
});
// }}}1

js.namespace("javascript.ES5_parser", ["javascript.tokenizer", "javascript.Parser"], function (tokenizer, JavascriptParser) {
	var parser = new JavascriptParser();

	var ECMA6String = function () {};
	var p = ECMA6String.prototype;

	p.TemplateLiteral = function (token, body) {
		this.type  = "TemplateLiteral";
		this.body  = body;
		this.start = token.start;
		this.end   = token.end;
	};
	p.TemplateLiteralString = function (token) {
		this.type  = "TemplateLiteralString";
		this.value = token.value;
		this.start = token.start;
		this.end   = token.end;
	};
	p.TemplateLiteralExpression = function (token, expression) {
		this.type       = "TemplateLiteralExpression";
		this.expression = expression;
		this.start      = token.start;
		this.end        = token.end;
	};

	p.parse = function (parser, temp, tokens, i) {
		if (tokens[i].type === "TemplateLiteral") {
			var body = [], j = 0;

			for (; j < tokens[i].children.length; ++j) {
				switch (tokens[i].children[j].type) {
					case "TemplateLiteral quasi string" :
						body.push(new this.TemplateLiteralString(tokens[i].children[j]));
						break;
					case "TemplateLiteral expression" :
						parser.parse_sequence_expression(
							temp, tokens[i].children[j].children,
							0, tokens[i].children[j].children.length
						);
						body.push(new this.TemplateLiteralExpression(
							tokens[i].children[j],
							temp.expression
						));
						break;
					default:
						tokens[i].error_unexpected_token();
				}
			}

			temp.parsed_token = new this.TemplateLiteral(tokens[i], body);
		}

		return i;
	};

	var es6 = new ECMA6String();

	parser.expression(function (p, temp, tokens, i) {
		return es6.parse(p, temp, tokens, i);
	});

	return function (filename, source_code) {
		try {
			return parser.parse(filename, source_code);
		} catch (error) {
			error.fileName = filename;
			error.$stack   = error.stack;
			throw error;
		}
	};
});//ignore:start

if (require.main === module) {
var stack_trace = require("vim_qf_stack_trace");
	
js.run("javascript.ES5_parser", function (parser) {
	var fs   = require("fs");
	var path = require("path");

	var error_handler = function (error) {
		error = stack_trace(error);
		fs.writeFileSync("./.error.txt", error);
		console.error(error);
		process.exit();
	};

	//var JavascriptBeautifier = require("../../js_beautifier/javascript_beautify");
	var JavascriptBeautifier = require("../build/compiler");
	//var filename             = path.join(__dirname, "javascript_parser.js");
	var filename             = path.join(__dirname, "../build/compiler.js");
	//var filename = "./node_modules/uglify-js/lib/ast.js";
	var source   = 
`
switch(a){
case':':
}
	javascript_regions.register({
		type  : "TemplateLiteral expression",
		contains : [
			{ type : "Block"       } ,
			{ type : "Array"       } ,
			{ type : "String"      } ,
			{ type : "RegExp"      } ,
			{ type : "Comment"     } ,
			{ type : "Parenthesis" } ,
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%', // operator
					'&', '|', '$', '?',
					'=', '!', '<', '>', '\\\\',
					':', '.', ',', ';', // delimiters
				]
			},
		]
	});
	javascript_regions.register({
		type  : "TemplateLiteral",
` +
"		start : '`',\n" +
'		skip  : "\\`",\n' +
"		end   : '`'," +
`
		contains : [
			{ type : "TemplateLiteral quasi string" } ,
			{ type : "TemplateLiteral expression"   } ,
		],
		keepend : true
	});
`;
	source   = fs.readFileSync(filename, "utf8");

	/*
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
	*/

	try {
		var start = Date.now();
		var result = parser(filename, source);
		var end = Date.now();

		var statements = result.program.body;
		/*
		print(statements[0]);
		print(statements[0].expression.body[0]);
		print(statements[0].expression.body[1]);
		print(statements[0].expression.body[2]);
		return;
		*/

		console.log("-------------------------------");
		console.log(`Parsed in: ${ (end - start) }ms`);
		console.log("-------------------------------");

		var highlight = require("pygments").colorize;
		var compiler  = new JavascriptBeautifier('', '    ');
		var stmts     = statements.map(s => compiler.compile(s));
		highlight(stmts.join('\n'), "js", "console", console.log);

	} catch (e) {
		error_handler(e);
	}
});

}

module.exports = js;
//ignore:end
