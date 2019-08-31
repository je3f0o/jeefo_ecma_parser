/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_condition.js
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

const { is_terminator }           = require("../../helpers");
const { terminal_definition }     = require("../../common");
const { for_iterator_condition }  = require("../enums/states_enum");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For iterator condition",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (_, parser) => {
        return parser.current_state === for_iterator_condition;
    },
    initialize : (node, token, parser) => {
        parser.change_state("expression");
        const expression = parser.parse_next_node(TERMINATION);

        let terminator;
        if (is_terminator(parser)) {
            terminator = terminal_definition.generate_new_node(parser);
        } else if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        } else {
            parser.throw_unexpected_token();
        }

        node.expression = expression;
        node.terminator = terminator;
        node.start      = (expression || terminator).start;
        node.end        = terminator.end;
    }
};
