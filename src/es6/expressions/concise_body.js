/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : concise_body.js
* Created at  : 2019-09-04
* Updated at  : 2020-09-09
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

const {EXPRESSION}    = require("../enums/precedence_enum");
const {concise_body}  = require("../enums/states_enum");
const {is_open_curly} = require("../../helpers");

module.exports = {
    id         : "Concise body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === concise_body,
    initialize : (node, token, parser) => {
        let expr;
        if (is_open_curly(parser)) {
            parser.change_state("arrow_function_body");
            expr = parser.generate_next_node();
        } else {
            parser.context_stack.push(node.id);
            parser.change_state("assignment_expression");
            expr = parser.generate_next_node();
            parser.context_stack.pop();
        }

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    }
};
