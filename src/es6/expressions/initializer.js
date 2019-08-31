/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : initializer.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-01
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

const { EXPRESSION }                 = require("../enums/precedence_enum");
const { initializer }                = require("../enums/states_enum");
const { parse_asignment_expression } = require("../../helpers");

module.exports = {
    id         : "Initializer",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === initializer,
    initialize : (node, token, parser) => {
        const prev_state_name = parser.get_state_name(parser.prev_state);

        let assign_operator, expression;
        if (parser.prev_node && parser.prev_node.assign_operator) {
            ({ assign_operator, expression } = parser.prev_node);
        } else {
            parser.change_state("delimiter");
            assign_operator = parser.generate_next_node(parser);

            parser.prepare_next_state(prev_state_name, true);
            expression = parse_asignment_expression(parser);
        }

        node.assign_operator = assign_operator;
        node.expression      = expression;
        node.start           = assign_operator.start;
        node.end             = expression.end;
    }
};
