/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_expression.js
* Created at  : 2019-08-30
* Updated at  : 2019-08-30
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

const { for_iterator_expression } = require("../enums/states_enum");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For iterator expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (_, parser) => {
        return parser.current_state === for_iterator_expression;
    },
    initialize : (node, token, parser) => {
        const { initializer } = parser.prev_node;

        parser.prepare_next_state("for_iterator_condition", true);
        const condition = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        const update = parser.parse_next_node(TERMINATION);

        node.initializer = initializer;
        node.condition   = condition;
        node.update      = update;
        node.start       = initializer.start;
        node.end         = (update || condition).end;
    }
};
