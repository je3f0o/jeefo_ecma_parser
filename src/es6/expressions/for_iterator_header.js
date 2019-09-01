/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_header.js
* Created at  : 2019-08-30
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

const { for_iterator_header }     = require("../enums/states_enum");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For iterator header",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_iterator_header,
    initialize : (node, token, parser) => {
        const { prev_node, initializer } = parser.prev_node;

        parser.prev_node = prev_node;
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
