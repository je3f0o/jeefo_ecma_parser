/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tagged_template_literal.js
* Created at  : 2017-08-19
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var TaggedTemplateLiteral = function () {};
TaggedTemplateLiteral.prototype = {
	type        : "TaggedTemplateLiteral",
	precedence  : 21,
	initialize  : function (token, scope) {
		this.type = this.type;
		this.tag  = scope.current_token;

		scope.advance();
		this.template = scope.current_expression;
		this.start    = this.tag.start;
		this.end      = this.template.end;
	},
	statement_denotation : require("../../es5/denotations/expression_statement_denotation")
};

module.exports = {
	is : function (token, scope) {
		return scope.tokenizer.streamer.peek(scope.tokenizer.streamer.cursor.index + 1) === '`';
	},
	token_type  : "Identifier",
	Constructor : TaggedTemplateLiteral
};
