/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-08-29
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

const { is_expression }       = require("../helpers");
const { terminal_definition } = require("../../common");
const {
    TERMINATION,
    MEMBER_EXPRESSION,
} = require("../enums/precedence_enum");
const {
    is_delimiter_token,
    is_close_square_bracket,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Computed member expression",
	type       : "Expression",
	precedence : MEMBER_EXPRESSION,

    is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, '[')) {
            const lvalue = get_last_non_comment_node(parser);
            if (lvalue !== null) {
                // TODO: check lvalue
                return true;
            }
        }
    },

	initialize : (node, current_token, parser) => {
        const object = get_last_non_comment_node(parser);
        const prev_state = parser.current_state;

        parser.change_state("delimiter");
        const open = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        const expression = parser.parse_next_node(TERMINATION);

        parser.expect(']', is_close_square_bracket);
        const close = terminal_definition.generate_new_node(parser);

        node.object               = object;
        node.open_square_bracket  = open;
        node.expression           = expression;
        node.close_square_bracket = close;
        node.start                = object.start;
        node.end                  = close.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    },
};
