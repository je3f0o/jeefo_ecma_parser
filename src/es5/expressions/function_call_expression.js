/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-09-06
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition } = require("@jeefo/parser");
const precedence_enum         = require("../enums/precedence_enum");
const { terminal_definition } = require("../../common");
const {
    is_expression,
    get_comma_separated_expressions,
} = require("../helpers");
const {
    is_open_parenthesis,
    get_last_non_comment_node,
} = require("../../helpers");

const arguments_definition = new AST_Node_Definition({
    id         : "Arguments",
	type       : "Expression",
	precedence : -1,

    is         : () => {},
	initialize : (node, token, parser) => {
        const open = terminal_definition.generate_new_node(parser);
        const {
            delimiters, expressions
        } = get_comma_separated_expressions(parser, ')');
        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.list              = expressions;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    },
});

module.exports = {
    id         : "Function call expression",
	type       : "Expression",
	precedence : precedence_enum.CALL_EXPRESSION,

    is : (token, parser) => {
        if (is_expression(parser) && is_open_parenthesis(parser)) {
            return get_last_non_comment_node(parser) !== null;
        }
    },

	initialize : (node, token, parser) => {
        const callee            = get_last_non_comment_node(parser);
        const { current_state } = parser;

        const args = arguments_definition.generate_new_node(parser);

        node.callee    = callee;
        node.arguments = args;
        node.start     = callee.start;
        node.end       = args.end;

        parser.ending_index  = node.end.index;
        parser.current_state = current_state;
    },
};
