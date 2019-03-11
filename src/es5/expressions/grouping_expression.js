/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2017-08-17
* Updated at  : 2019-02-26
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum = require("../enums/states_enum");
/*
var GroupingExpression = function () {};
GroupingExpression.prototype = {
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
	statement_denotation : require("../denotations/expression_statement_denotation")
};
*/

module.exports = {
	id         : "Grouping expression",
    type       : "Expression",
	precedence : 20,

	is         : (token, parser) => parser.current_state === states_enum.expression && token.value === '(',
    initialize : (symbol, current_token, parser) => {
        console.log(parser);
        parser.throw_unexpected_token("Implement");
    }
};
