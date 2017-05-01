/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : preprocessor.js
* Created at  : 2017-04-26
* Updated at  : 2017-05-02
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

var jeefo              = require("jeefo");
var JavascriptCompiler = require("./compiler");
var pp = require("../src/javascript_parser");

/* global */
/* exported */
/* exported */

//ignore:end

// Preprocessor {{{1
pp.namespace("javascript.Preprocessor", function () {

	// Scope {{{2
	var Scope = function (parent, defs) {
		this.parent   = parent;
		this.children = [];
		if (parent) {
			this.defs  = this.assign(this.object_create(null), parent.defs, defs);
			this.level = parent.level + 1;
		} else {
			this.defs  = this.assign(this.object_create(null), defs);
			this.level = 0;
		}
	},
	p = Scope.prototype;
	p.Scope         = Scope;
	p.assign        = jeefo.assign;
	p.object_create = Object.create;

	p.$new = function () {
		var scope = new this.Scope(this);
		this.children.push(scope);
		return scope;
	};
	p.$destroy = function () {
		var index = this.parent.children.indexOf(this);
		this.parent.children.splice(index, 1);
		return this.parent;
	};
	// }}}2

	// Preprocessor {{{2
	var JavascriptPreprocessor = function (file, defs, indent, indentation) {
		this.file     = file;
		this.scope    = new this.Scope(null, defs);
		this.result   = file.code;
		this.actions  = [];
		this.compiler = new JavascriptCompiler(indent || '', indentation || '\t');
		this.cache    = {};
	};
	p = JavascriptPreprocessor.prototype;
	p.Scope = Scope;
	p.Def = function (token, ret) {
		this.token = token;

		if (ret) {
			switch (ret.type) {
				case "Identifier" :
					this.is_return = ret.name !== "null" && ret.name !== "false";
					break;
			}
		} else {
			this.is_return = false;
		}
	};

	p.replace_between = function (def) {
		this.result = this.result.substr(0, def.start) +
			def.replacement +
			this.result.substr(def.end, this.result.length);
	};

	p.remove = function (def) {
		this.result = this.result.substr(0, def.start) + this.result.substr(def.end, this.result.length);
	};

	p.register = function (action, def) {
		def.type = action;
		this.actions.push(def);
	};

	p.define = function (args, scope) {
		var i = 0, ids = [], def, j;

		switch (args[0].type) {
			case "StringLiteral":
				def = scope.defs[args[0].value] = new this.Def(args[1], args[2]);
				break;
			case "Identifier":
				def = scope.defs[args[0].name] = new this.Def(args[1], args[2]);
				break;
		}

		switch (def.token.type) {
			case "FunctionExpression":
				var params = def.params = new Array(def.token.parameters.length);

				for (; i < params.length; ++i) {
					if (params.indexOf(def.token.parameters[i].name) !== -1) {
						def.token.parameters[i].error("Duplicated parameter");
					}
					params[i] = {
						ids  : [],
						name : def.token.parameters[i].name,
					};
				}

				this.find("Identifier", def.token.body, ids);

				for (i = 0; i < params.length; ++i) {
					for (j = 0; j < ids.length; ++j) {
						if (params[i].name === ids[j].name) {
							params[i].ids.push(ids[j]);
						}
					}

					params[i] = params[i].ids;
				}

				break;
		}
	};

	p.find = function (type, token, container) {
		var i = 0;

		switch (token.type) {
			case type:
				container.push(token);
				break;
			case "Program" :
				for (; i < token.body.length; ++i) {
					this.find(type, token.body[i], container);
				}
				break;
			case "ObjectLiteral" :
				for (; i < token.properties.length; ++i) {
					this.find(type, token.properties[i].property, container);
				}
				break;
			case "ArrayLiteral" :
				for (; i < token.elements.length; ++i) {
					this.find(type, token.elements[i], container);
				}
				break;
			case "BinaryExpression" :
			case "LogicalExpression" :
				this.find(type, token.left, container);
				this.find(type, token.right, container);
				break;
			case "IfStatement" :
				this.find(type, token.test, container);
				this.find(type, token.statement, container);
				if (token.alternate) {
					this.find(type, token.alternate, container);
				}
				break;
			case "ForStatement" :
				if (token.init) {
					this.find(type, token.init, container);
				}
				if (token.test) {
					this.find(type, token.test, container);
				}
				if (token.update) {
					this.find(type, token.update, container);
				}
				this.find(type, token.statement, container);
				break;
			case "ReturnStatement" :
				this.find(type, token.argument, container);
				break;
			case "BlockStatement" :
				for (; i < token.body.length; ++i) {
					this.find(type, token.body[i], container);
				}
				break;
			case "ExpressionStatement" :
				this.find(type, token.expression, container);
				break;
			case "AssignmentExpression" :
				this.find(type, token.left, container);
				this.find(type, token.right, container);
				break;
			case "MemberExpression" :
				this.find(type, token.object, container);
				this.find(type, token.property, container);
				break;
			case "NewExpression" :
				this.find(type, token.callee, container);
				break;
			case "CallExpression" :
				this.find(type, token.callee, container);
				for (; i < token["arguments"].length; ++i) {
					this.find(type, token["arguments"][i], container);
				}
				break;
			case "UnaryExpression" :
			case "ReturnStatement" :
				this.find(type, token.argument, container);
				break;
			case "VariableDeclaration" :
				for (; i < token.declarations.length; ++i) {
					if (token.declarations[i].init) {
						this.find(type, token.declarations[i].init, container); 
					}
				}
				break;
			case "SwitchStatement" :
				for (i = 0; i < token.cases.length; ++i) {
					this.find(type, token.cases[i], container);
				}
				break;
			case "SwitchCase" :
				this.find(type, token.test, container);
				for (i = 0; i < token.statements.length; ++i) {
					this.find(type, token.statements[i], container);
				}
				break;
			case "FunctionExpression" :
				for (; i < token.parameters.length; ++i) {
					this.find(type, token.parameters[i], container);
				}
				this.find(type, token.body, container);
				break;
		}
	};

	p.call_expression = function (expression, def, scope) {
		var i = 0, j = 0, args = [], statements = [];

		this.compiler.current_indent = '';

		for (; i < expression["arguments"].length; ++i) {
			args.push(this.compiler.compile(expression["arguments"][i]));
		}

		for (i = 1; i < scope.level; ++i) {
			this.compiler.current_indent = this.compiler.current_indent + this.compiler.indentation;
		}
		
		for (i = 0; i < def.params.length; ++i) {
			for (j = 0; j < def.params[i].length; ++j) {
				def.params[i][j].name = args[i];
			}
		}

		if (! this.current_expression) {
			this.current_expression = expression;
		}
		this.process(def.token.body.body, scope);

		if (def.is_return) {
			LOOP:
			for (i = 0; i < def.token.body.body.length; ++i) {
				if (def.token.body.body[i].type === "ReturnStatement") {
					statements.push(
						this.compiler.compile(def.token.body.body[i].argument)
					);
					break LOOP;
				}
			}
		} else {
			for (i = 0; i < def.token.body.body.length; ++i) {
				statements.push(
					this.compiler.current_indent + this.compiler.compile(def.token.body.body[i])
				);
			}
		}

		if (this.current_expression === expression) {
			this.register("replace", {
				start       : expression.start.index,
				end         : expression.end.index,
				replacement : statements.join('\n').trim()
			});
			this.current_expression = null;
		} else {
			expression.compiled = statements.join('\n').trim();
		}
	};

	p.expression = function (expression, scope) {
		switch (expression.type) {
			case "CallExpression" :
				switch (expression.callee.type) {
					case "MemberExpression" :
						if (expression.callee.object.name === "PP" && expression.callee.property.name === "define") {
							this.define(expression["arguments"], scope);
						} else {
							this.process(expression["arguments"], scope.$new());
						}
						break;
					case "Identifier":
						if (scope.defs[expression.callee.name]) {
							this.call_expression(expression, scope.defs[expression.callee.name], scope);
						}
						break;
				}
				break;
			case "AssignmentExpression":
				this.expression(expression.right, scope);
				break;
			case "BinaryExpression":
			case "LogicalExpression":
				this.expression(expression.left, scope);
				this.expression(expression.right, scope);
				break;
			case "FunctionExpression" :
				this.process(expression.body.body, scope.$new());
				break;
			//case "MemberExpression" :
				//console.log(expression);
			//default:
				//console.log(expression.type);
		}
	};

	p.variable_declaration = function (declarations, scope) {
		for (var i = 0; i < declarations.length; ++i) {
			if (declarations[i].init) {
				this.expression(declarations[i].init, scope); 
			}
		}
	};

	p.push_current_statement = function (statement) {
		statement.parent       = this.current_statement;
		this.current_statement = statement;
	};
	p.pop_current_statement = function () {
		this.current_statement = this.current_statement.parent;
	};

	p.statement = function (statement, scope) {
		switch (statement.type) {
			case "BlockStatement" :
				this.push_current_statement(statement);
				this.process(statement.body, scope.$new());
				this.pop_current_statement();
				break;
		}
	};

	p.process = function (tokens, scope) {
		for (var i = 0; i < tokens.length; ++i) {

			SWITCH:
			switch (tokens[i].type) {
				// Comment {{{3
				case "Comment" :
					switch (tokens[i].comment.trim()) {
						case "ignore:start":
							if (! this.remove_indices) {
								this.remove_indices = {
									start : tokens[i].start.index,
									end   : this.result.length,
								};
								this.register("remove", this.remove_indices);
							}
							break SWITCH;
						case "ignore:end":
							if (this.remove_indices) {
								this.remove_indices.end = tokens[i].end.index;
								this.remove_indices = null;
							} else {
								console.warn("Unexpected ignore end.");
							}
					}
					break;

				// Statement {{{3
				case "ExpressionStatement" :
					this.push_current_statement(tokens[i]);
					this.expression(tokens[i].expression, scope);
					this.pop_current_statement();
					break;
				case "ReturnStatement" :
					if (tokens[i].argument) {
						this.push_current_statement(tokens[i]);
						this.expression(tokens[i].argument, scope);
						this.pop_current_statement();
					}
					break;
				case "IfStatement" :
					this.push_current_statement(tokens[i]);

					this.expression(tokens[i].test, scope);
					this.statement(tokens[i].statement, scope);
					if (tokens[i].alternate) {
						this.process([tokens[i].alternate], scope);
					}

					this.pop_current_statement();
					break;
				case "ForStatement" :
				case "WhileStatement" :
					this.push_current_statement(tokens[i]);
					this.statement(tokens[i].statement, scope);
					this.pop_current_statement();
					break;
				case "SwitchStatement" :
					this.push_current_statement(tokens[i]);

					scope.level += 1;
					this.process(tokens[i].cases, scope);
					scope.level -= 1;

					this.pop_current_statement();
					break;
				
				// Expression {{{3
				case "FunctionExpression" :
					this.process(tokens[i].body.body, scope.$new());
					break;
				// Other {{{3
				case "VariableDeclaration" :
					this.variable_declaration(tokens[i].declarations, scope);
					break;
				case "SwitchCase" :
				case "DefaultCase" :
					this.process(tokens[i].statements, scope.$new());
					break;
				// }}}3
			}
		}
	};
	// }}}2

	return JavascriptPreprocessor;
});

// Public funciton {{{1
pp.namespace("javascript.ES5_preprocessor", [
	"javascript.ES5_parser",
	"javascript.Preprocessor",
], function (parser, JavascriptPreprocessor) {
	var PublicJavascriptPreprocessor = function (defs, middlewares) {
		this.pp          = new JavascriptPreprocessor({}, defs);
		this.scope       = this.pp.scope;
		this.middlewares = middlewares || [];
	},
	p = PublicJavascriptPreprocessor.prototype;
	p.Scope                  = JavascriptPreprocessor.prototype.Scope;
	p.parser                 = parser;
	p.JavascriptPreprocessor = JavascriptPreprocessor;

	p.define = function (name, definition, is_return) {
		var code = `PP.define(${ name }, ${ definition.toString() }, ${ is_return });`;
		var file = parser("[IN MEMORY]", code);

		this.pp.compiler.current_indent = '';

		this.scope = new this.Scope(null, this.scope.defs);
		this.pp.process(file.program.body, this.scope);
	};

	p.$new = function () {
		return new PublicJavascriptPreprocessor(this.scope.defs, this.middlewares.concat());
	};

	p.middleware = function (middleware) {
		this.middlewares.push(middleware);
	};

	p.get_defs = function (defs) {
		return new this.Scope(this.scope, defs).defs;
	};

	p.process = function (filename, source_code, defs, indent, indentation) {
		var i    = 0,
			file = this.parser(filename, source_code),
			pp   = new this.JavascriptPreprocessor(file, this.get_defs(defs), indent, indentation);

		for (; i < this.middlewares.length; ++i) {
			this.middlewares[i](pp);
		}

		pp.process(file.program.body, pp.scope);
		pp.actions.sort(function (a, b) { return a.start - b.start; });

		for (i = pp.actions.length - 1; i >= 0; --i) {
			switch (pp.actions[i].type) {
				case "remove":
					pp.remove(pp.actions[i]);
					break;
				case "replace":
					pp.replace_between(pp.actions[i]);
					break;
			}
		}

		return pp.result;
	};

	var instance = new PublicJavascriptPreprocessor();

	instance.define("IS_NULL"      , function (x) { return x === null;   }, true);
	instance.define("IS_DEFINED"   , function (x) { return x !== void 0; }, true);
	instance.define("IS_UNDEFINED" , function (x) { return x === void 0; }, true);

	instance.define("IS_NUMBER"   , function (x) { return typeof x === "number";   } , true);
	instance.define("IS_STRING"   , function (x) { return typeof x === "string";   } , true);
	instance.define("IS_BOOLEAN"  , function (x) { return typeof x === "boolean";  } , true);
	instance.define("IS_FUNCTION" , function (x) { return typeof x === "function"; } , true);

	return instance;
});
// }}}1

// ignore:start

pp.run(["javascript.ES5_preprocessor"], function (pp) {
	module.exports = function (filename, code) {
		return pp.process(filename, code);
	};
});

if (require.main === module) {
	
pp.run(["javascript.ES5_preprocessor", "tokenizer.TokenParser", "tokenizer.Region"], function (pp, TokenParser, Region) {
	
	var fs = require("fs"),
		path = require("path");
	
	var language = "ECMA6";
	
	var es6_string_template_regions = new Region(language);
	es6_string_template_regions.register({
		type  : "ES6StringVariable",
		name  : "ES6 string template variable",
		start : "${",
		end   : '}',
	});
	var es6_string_tokenizer = new TokenParser(language, es6_string_template_regions);
	
	var filename = path.resolve(__dirname, "./javascript_compiler.js");
	var source = `if (IS_NULL(x)) {}`;
	source = fs.readFileSync(filename, "utf8");

	pp.middleware(function (pp) {
		var strs = [];
		pp.find("StringLiteral", pp.file.program, strs);

		strs.forEach(function (str) {
			var tt = es6_string_tokenizer.parse(str.value);
			var is_es6 = tt.some(function (t) {
				return t.type === "ES6StringVariable";
			});

			if (is_es6) {
				pp.register("replace", {
					start : str.start.index,
					end : str.end.index,
					replacement : "ECMA6666666666666666666666666"
				});
			}
		});
	});

	try {
		var start = Date.now();
		var code = pp.process("[IN MEMORY]", source);
		var end = Date.now();

		console.log("-------------------------------");
		console.log(`Preprocessor in: ${ (end - start) }ms`);
		console.log("-------------------------------");

		console.log(code);
	} catch (e) {
		console.error("ERROR:", e);
	}
});

module.exports = pp;

}

// ignore:end
