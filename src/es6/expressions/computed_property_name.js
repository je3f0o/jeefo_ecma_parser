/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_property_name.js
* Created at  : 2019-09-06
* Updated at  : 2019-09-06
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

const array_remove               = require("@jeefo/utils/array/remove");
const { EXPRESSION }             = require("../enums/precedence_enum");
const { computed_property_name } = require("../enums/states_enum");
const {
    is_open_square_bracket,
    is_close_square_bracket,
} = require("../../helpers");

module.exports = {
    id         : "Computed property name",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === computed_property_name,
    initialize : (node, token, parser) => {
        if (! is_open_square_bracket(parser)) {
            parser.throw_unexpected_token();
        }
        const has_in = parser.suffixes.includes("in");
        if (! has_in) {
            parser.suffixes.push("in");
        }

        parser.change_state("punctuator");
        const open = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const expression = parser.generate_next_node();

        parser.expect(']', is_close_square_bracket);
        parser.change_state("punctuator");
        const close = parser.generate_next_node();

        node.open_square_bracket  = open;
        node.expression           = expression;
        node.close_square_bracket = close;
        node.start                = open.start;
        node.end                  = close.end;

        if (! has_in) {
            array_remove(parser.suffixes, "in");
        }
    }
};
