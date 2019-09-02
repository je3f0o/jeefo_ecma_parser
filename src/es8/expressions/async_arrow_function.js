/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_function.js
* Created at  : 2019-08-27
* Updated at  : 2019-09-03
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

const { is_open_curly }        = require("../../helpers");
const { async_arrow_function } = require("../enums/states_enum");
const { ASYNC_ARROW_FUNCTION } = require("../enums/precedence_enum");

module.exports = {
    id         : "Async arrow function",
    type       : "Expression",
    precedence : ASYNC_ARROW_FUNCTION,

    is : (token, parser) => {
        return parser.current_state === async_arrow_function;
    },
    initialize : (node, token, parser) => {
        const { prev_state, prev_node : { keyword, parameters } } = parser;

        parser.change_state("delimiter");
        const arrow_token = parser.generate_next_node();

        parser.prepare_next_state("async_function_body", true);
        if (! is_open_curly(parser)) {
            parser.change_state("assignment_expression");
        }
        const body = parser.generate_next_node();

        node.keyword     = keyword;
        node.parameters  = parameters;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    }
};
