/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : preprocessor.js
* Created at  : 2017-04-26
* Updated at  : 2017-04-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

var js                   = require("../src/javascript_parser");
var jeefo                = require("jeefo");
var JavascriptBeautifier = require("./compiler");

/* global */
/* exported */
/* exported */

//ignore:end

// Pre processor {{{1
js.namespace("javascript.preprocessor", function () {

	// Scope {{{2
	var Scope = function (parent) {
		this.scope    = {};
		this.parent   = parent;
		this.children = [];
		if (parent) {
			this.defs  = this.assign(this.object_create(null), parent.defs);
			this.level = parent.level + 1;
		} else {
			this.defs  = this.object_create(null);
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
	var JavascriptPreprocessor = function (file) {
		this.file           = file;
		this.scope          = new this.Scope(null);
		this.result         = file.code;
		this.remove_indices = [];
		this.defs           = [];
	};
	p = JavascriptPreprocessor.prototype;
	p.Scope = Scope;
	p.Def = function (token) {
		this.token = token;
	};

	p.replace_between = function (def) {
		this.result = this.result.substr(0, def.start) +
			def.replacement +
			this.result.substr(def.end, this.result.length);
	};

	p.remove = function (def) {
		this.result = this.result.substr(0, def.start) + this.result.substr(def.end, this.result.length);
	};

	p.define = function (args, scope) {
		var def = scope.defs[args[0].value] = new this.Def(args[1]), i = 0, ids = [], j;

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
			case "IfStatement" :
				this.find(type, token.test, container);
				this.find(type, token.statement, container);
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
			case "FunctionExpression" :
				break;
		}
	};

	var b = new JavascriptBeautifier('', '\t');

	p.call_expression = function (expression, def, level) {
		var i = 0, j = 0, args = [], statements = [];

		b.current_indent = '';

		for (; i < expression["arguments"].length; ++i) {
			args.push(b.compile(expression["arguments"][i]));
		}

		for (i = 1; i < level; ++i) {
			b.current_indent = b.current_indent + '\t';
		}
		
		for (i = 0; i < args.length; ++i) {
			for (j = 0; j < def.params[i].length; ++j) {
				def.params[i][j].name = args[i];
			}
		}

		for (i = 0; i < def.token.body.body.length; ++i) {
			statements.push(
				b.current_indent + b.compile(def.token.body.body[i])
			);
		}

		this.defs.push({
			type        : "replace",
			start       : expression.start.index,
			end         : expression.end.index + 1,
			replacement : statements.join('\n').trim()
		});
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
							this.call_expression(expression, scope.defs[expression.callee.name], scope.level);
						}
						break;
				}
				break;
			case "AssignmentExpression":
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

	p.statement = function (statement, scope) {
		switch (statement.type) {
			case "BlockStatement" :
				this.process(statement.body, scope.$new());
				break;
		}
	};

	p.process = function (tokens, scope) {
		for (var i = 0; i < tokens.length; ++i) {

			SWITCH:
			switch (tokens[i].type) {
				case "Comment" :
					switch (tokens[i].comment.trim()) {
						case "ignore:start":
							this.indices = {
								type  : "remove",
								start : tokens[i].start.index,
								end   : this.result.length,
							};
							this.remove_indices.push(this.indices);
							break SWITCH;
						case "ignore:end":
							if (this.indices) {
								this.indices.end = tokens[i].end.index;
								this.indices = null;
							} else {
								console.warn("Unexpected ignore end.");
							}
					}
					break;
				case "FunctionExpression" :
					this.process(tokens[i].body.body, scope.$new());
					break;
				case "ExpressionStatement" :
					this.expression(tokens[i].expression, scope);
					break;
				case "VariableDeclaration" :
					this.variable_declaration(tokens[i].declarations, scope);
					break;
				case "IfStatement" :
				case "ForStatement" :
				case "WhileStatement" :
					this.statement(tokens[i].statement, scope);
					break;
				case "SwitchStatement" :
					scope.level += 1;
					this.process(tokens[i].cases, scope);
					scope.level -= 1;
					break;
				case "SwitchCase" :
				case "DefaultCase" :
					this.process(tokens[i].statements, scope.$new());
					break;
			}
		}
	};
	// }}}2

	return function (file) {
		var pp = new JavascriptPreprocessor(file);
		pp.process(file.program.body, pp.scope);

		var ppp = pp.remove_indices.concat(pp.defs);

		ppp.sort(function (a, b) { return a.start - b.start; });

		for (var i = ppp.length - 1; i >= 0; --i) {
			switch (ppp[i].type) {
				case "remove":
					pp.remove(ppp[i]);
					break;
				case "replace":
					pp.replace_between(ppp[i]);
					break;
			}
		}

		return pp.result;
	};
});
// }}}1

js.run(["javascript.ES5_parser", "javascript.preprocessor"], function (parser, preprocessor) {
	module.exports = function (filename, source_code) {
		var file = parser(filename, source_code);
		return preprocessor(file);
	};
});

if (require.main === module) {
	
js.run(["javascript.ES5_parser", "javascript.preprocessor"], function (parser, preprocessor) {
	var fs       = require("fs");
	var path     = require("path");
	var filename = path.resolve(__dirname, "../src/javascript_parser.js");
	var source   = fs.readFileSync(filename, "utf8");

	try {

		var start = Date.now();
		var file = parser(filename, source);
		var code = preprocessor(file);
		var end = Date.now();

		console.log("-------------------------------");
		console.log(`Preprocessor in: ${ (end - start) }ms`);
		console.log("-------------------------------");

		console.log(code);

	} catch (e) {
		console.error("ERROR:", e);
	}
});

}
