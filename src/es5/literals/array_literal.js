/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_literal.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-05
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { PRIMITIVE } = require("../enums/precedence_enum");
const {
    is_expression,
    get_comma_separated_expressions,
} = require("../helpers");
const {
    terminal_definition : terminal
} = require("../../common");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Array literal",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, '[')) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize : (node, current_token, parser) => {
        const { current_state } = parser;

        const open = terminal.generate_new_node(parser);
        const {
            delimiters,
            expressions
        } = get_comma_separated_expressions(parser, ']');
        const close = terminal.generate_new_node(parser);

        node.open_square_bracket  = open;
        node.elements             = expressions;
        node.delimiters           = delimiters;
        node.close_square_bracket = close;
        node.start                = open.start;
        node.end                  = close.end;

        parser.ending_index  = node.end.index;
        parser.current_state = current_state;
    }
};
