/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : initializer_definition.js
* Created at  : 2019-08-12
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { terminal_definition } = require("../../common");
const {
    is_assign,
    parse_asignment_expression,
} = require("../../helpers");

module.exports = new AST_Node_Definition({
    id         : "Initializer",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        let assign_operator, expression;
        const expression_name = parser.get_current_state_name();

        if (parser.prev_node && parser.prev_node.assign_operator) {
            ({ assign_operator, expression } = parser.prev_node);
        } else if (is_assign(token)) {
            assign_operator = terminal_definition.generate_new_node(parser);

            parser.prepare_next_state(expression_name, true);
            expression = parse_asignment_expression(parser);
            if (! expression) {
                parser.throw_unexpected_token();
            }
        } else {
            parser.throw_unexpected_token();
        }

        node.assign_operator = assign_operator;
        node.expression      = expression;
        node.start           = assign_operator.start;
        node.end             = expression.end;
    }
});
