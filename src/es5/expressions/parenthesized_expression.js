/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parenthesized_expression.js
* Created at  : 2019-08-28
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { TERMINATION }              = require("../enums/precedence_enum");
const { get_right_value }          = require("../helpers");
const { terminal_definition }      = require("../../common");
const { parenthesized_expression } = require("../enums/states_enum");
const {
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Parenthesized expression",
    type       : "Expression",
    precedence : -1,

    is : (token, parser) => {
        return parser.current_state === parenthesized_expression;
    },
    initialize : (node, token, parser) => {
        parser.expect('(', is_open_parenthesis);
        const open = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        if (is_close_parenthesis(parser)) {
            parser.throw_unexpected_token("Missing expression");
        }

        parser.post_comment = null;
        const expression = get_right_value(parser, TERMINATION);
        if (! expression) {
            parser.throw_unexpected_token();
        }
        parser.prev_node = parser.post_comment;

        parser.expect(')', is_close_parenthesis);
        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.expression        = expression;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
};
