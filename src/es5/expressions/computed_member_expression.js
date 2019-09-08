/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-09-08
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

const { MEMBER_EXPRESSION } = require("../enums/precedence_enum");
const {
    expression,
    member_expression,
} = require("../enums/states_enum");
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
        if (parser.current_state !== expression) { return; }

        if (is_delimiter_token(token, '[')) {
            const lvalue = get_last_non_comment_node(parser);
            if (lvalue !== null) {
                // TODO: check lvalue
                return true;
            }
        }
    },

	initialize : (node, current_token, parser) => {
        const object = get_last_non_comment_node(parser);

        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("expression_expression", true);
        const expression = parser.generate_next_node();

        parser.expect(']', is_close_square_bracket);
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.object               = object;
        node.open_square_bracket  = open;
        node.expression           = expression;
        node.close_square_bracket = close;
        node.start                = object.start;
        node.end                  = close.end;

        parser.current_state = member_expression;
    },

    protos : {
        is_valid_simple_assignment_target () { return true; }
    }
};
