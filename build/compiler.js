/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : javascript_beautify.js
* Created at  : 2017-04-20
* Updated at  : 2017-04-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

/* global */
/* exported */
/* exported */

//ignore:end

var JavascriptBeautifier = function (indent, indentation) {
	this.indentation    = indentation;
	this.current_indent = indent;
},
p = JavascriptBeautifier.prototype;

p.indent = function () {
	this.current_indent = this.current_indent + this.indentation;
	return this.current_indent;
};

p.outdent = function () {
	this.current_indent = this.current_indent.substring(0, this.current_indent.length - this.indentation.length);
	return this.current_indent;
};

p.compile_binary_expression = function (token, operator) {
	switch (token.type) {
		case "BinaryExpression" :
		case "LogicalExpression" :
			switch (operator) {
				case '%' :
				case '/' :
				case '*' :
					switch (token.operator) {
						case '%' :
						case '/' :
						case '*' :
							return `${ this.compile(token) }`;
						default:
							return `(${ this.compile(token) })`;
					}
					break;
				case '-' :
				case '+' :
					switch (token.operator) {
						case '-' :
						case '+' :
							return `${ this.compile(token) }`;
						default:
							return `(${ this.compile(token) })`;
					}
					break;
				default:
					return `${ this.compile(token) }`;
			}
	}

	return `${ this.compile(token) }`;
};

p.compile = function (token, special) {
	var i, args, params, body, statements, indent;

	if (! token) {
		return String(token);
	}

	switch (token.type) {
		case "Comment":
			return `/* ${ token.comment } */`;
		case "EmptyStatement":
			return '';
		case "ExpressionStatement":
			return `${ this.compile(token.expression) };`;
		case "ConditionalExpression":
			return `${ this.compile(token.test) } ? ${ this.compile(token.consequent) } : ${ this.compile(token.alternate) }`;
		case "CallExpression":
			args = token.arguments.map(function (arg) {
				return this.compile(arg);
			}, this).join(", ");

			return `${ this.compile(token.callee) }(${ args })`;
		case "UnaryExpression":
			switch (token.operator) {
				case '+'      :
				case '-'      :
				case '~'      :
					return `${ token.operator }${ this.compile(token.argument) }`;
				case '!'      :
					body = this.compile(token.argument);
					if (body[0] === '!') {
						return `!${ body }`;
					}
					return `! ${ body }`;
				case "++"     :
				case "--"     :
					if (token.is_prefix) {
						return `${ token.operator }${ this.compile(token.argument) }`;
					}
					return `${ this.compile(token.argument) }${ token.operator }`;
			}
			return `${ token.operator } ${ this.compile(token.argument) }`;
		case "SequenceExpression":
			if (token.expressions[0]) {
				body = this.compile(token.expressions[0]);

				for (i = 1; i < token.expressions.length; ++i) {
					body = `${ body }, ${ this.compile(token.expressions[i]) }`;
				}
			}
			return body ? `(${ body })` : '';
		case "IfStatement":
			if (token.statement.type === "EmptyStatement") {
				body = ';';
			} else {
				body = ` ${ this.compile(token.statement) }`;
			}
			return `if (${ this.compile(token.test) })${ body }${ token.alternate ? " else " + this.compile(token.alternate) : '' }`;
		case "ForStatement":
			body = this.compile(token.body);
			if (body !== ';') {
				body = ` ${ body }`;
			}

			if (token.init) {
				if (token.init.type === "VariableDeclaration") {
					args = this.compile(token.init);
				} else {
					args = `${ this.compile(token.init) };`;
				}
			} else {
				args = ';';
			}

			if (token.test) {
				args = `${ args } ${ this.compile(token.test) };`;
			} else {
				args = `${ args };`;
			}

			if (token.update) {
				args = `${ args } ${ this.compile(token.update) }`;
			}

			return `for (${ args })${ body }`;
		case "ForInStatement":
			body = this.compile(token.body);
			if (body !== ';') {
				body = ` ${ body }`;
			}

			if (token.left.type === "VariableDeclaration") {
				args = this.compile(token.left, true);
			} else {
				args = this.compile(token.left);
			}
			args = `${ args } in ${ this.compile(token.right) }`;

			return `for (${ args })${ body }`;
		case "WhileStatement":
			body = this.compile(token.body);
			if (body !== ';') {
				body = ` ${ body }`;
			}
			return `while (${ this.compile(token.test) })${ body }`;
		case "NewExpression":
			args = token.arguments.map(function (arg) {
				return this.compile(arg);
			}, this).join(", ");

			return `new ${ this.compile(token.callee) }(${ args })`;
		case "BinaryExpression":
		case "LogicalExpression":
			return `${ this.compile_binary_expression(token.left, token.operator) } ${ token.operator } ${ this.compile_binary_expression(token.right, token.operator) }`;
		case "AssignmentExpression":
			return `${ this.compile(token.left) } ${ token.operator } ${ this.compile(token.right) }`;
		case "VariableDeclarator":
			var max_length = special;

			if (token.init) {
				for (i = 0, indent = '', max_length = max_length - token.id.name.length; i < max_length; ++i) {
					indent = indent + ' ';
				}
				return `${ token.id.name }${ indent } = ${ this.compile(token.init) }`;
			}

			return token.id.name;
		case "VariableDeclaration":
			var _max_length = token.declarations.reduce(function (length, declartor) {
				return declartor.id.name.length > length ? declartor.id.name.length : length;
			}, 0);

			if (token.declarations[0]) {
				body = this.compile(token.declarations[0], _max_length);
				indent = `${ this.current_indent }    `;

				for (i = 1; i < token.declarations.length; ++i) {
					body = `${ body },\n${ indent }${ this.compile(token.declarations[i], _max_length) }`;
				}
			}

			if (special) {
				return `var ${ body }`;
			}

			return `var ${ body };`;
		case "FunctionDeclaration":
			statements = token.body.body;

			if (token.parameters[0]) {
				params = token.parameters[0].name;

				for (i = 1; i < token.parameters.length; ++i) {
					params = `${ params }, ${ token.parameters[i].name }`;
				}
			}

			return `${ this.current_indent }function ${ token.id.name } (${ params || '' }) ${ this.compile(token.body) }`;
		case "StringLiteral":
			return `"${ token.value }"`;
		case "NumberLiteral":
			return token.value;
		case "RegExpLiteral":
			return `/${ token.regex.pattern }/${ token.regex.flags }`;
		case "ArrayLiteral":
			this.indent();

			if (token.elements.length) {
				body = token.elements[0] ? this.compile(token.elements[0]) : '';

				for (i = 1; i < token.elements.length; ++i) {
					if (token.elements[i]) {
						body = `${ body },\n${ this.current_indent }${ this.compile(token.elements[i]) }`;
					} else {
						body = `${ body },\n${ this.current_indent } undefined`;
					}
				}
			}

			this.outdent();

			return `[${ body || '' }]`;
		case "Property":
			switch (token.key.type) {
				case "Identifier" :
					return `${ this.current_indent }${ token.key.name } : ${ this.compile(token.value) }`;
			}
			return `${ this.current_indent }${ token.key.name } : ${ this.compile(token.value) }`;
		case "ObjectLiteral":
			this.indent();

			body = token.properties.map(function (property) {
				return this.compile(property);
			}, this).join(",\n");

			this.outdent();

			if (body) {
				body = `\n${ body }\n${ this.current_indent }`;
			}

			return `{${ body }}`;
		case "Identifier":
			return token.name;
		case "MemberExpression":
			if (token.is_computed) {
				return `${ this.compile(token.object) }[${ this.compile(token.property) }]`;
			}
			return `${ this.compile(token.object) }.${ this.compile(token.property) }`;
		case "BlockStatement":
			statements = token.body;

			if (statements[0]) {
				indent = this.indent();
				body   = `${ indent }${ this.compile(statements[0]) }`;

				for (i = 1; i < statements.length; ++i) {
					body = `${ body }\n${ indent }${ this.compile(statements[i]) }`; 
				}

				body = `\n${ body }\n${ this.outdent() }`;
			}

			return `{${ body || '' }}`;
		case "CatchClause":
			return ` catch (${ this.compile(token.param) }) ${ this.compile(token.body) }`;
		case "TryStatement":
			if (token.handler) {
				body = this.compile(token.handler);
			}
			if (token.finalizer) {
				body = `${ body } finally ${ this.compile(token.finalizer) }`;
			}
			return `try ${ this.compile(token.block) }${ body }`;
		case "ReturnStatement":
			return `return${ (token.argument ? ' ' + this.compile(token.argument) : '') };`;
		case "FunctionExpression":
			if (token.parameters[0]) {
				params = token.parameters[0].name;

				for (i = 1; i < token.parameters.length; ++i) {
					params = `${ params }, ${ token.parameters[i].name }`;
				}
			}

			return `function ${ (token.id ? token.id.name + ' ' : '') }(${ params || '' }) ${ this.compile(token.body) }`;
	}
};

module.exports = JavascriptBeautifier;

//ignore:start

if (require.main === module) {
	
var highlight = require("pygments").colorize;

module.exports = function (tokens) {
	var compiler = new JavascriptBeautifier('', '    ');

	var stmts = tokens.map(function (token) {
		return compiler.compile(token);
	});

	highlight(stmts.join('\n'), "js", "console", console.log);
};

}

//ignore:end
