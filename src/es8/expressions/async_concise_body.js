/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_concise_body.js
* Created at  : 2019-09-07
* Updated at  : 2020-09-02
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

const {STRUCTURE}          = require("../enums/precedence_enum");
const {async_concise_body} = require("../enums/states_enum");
const {is_delimiter_token} = require("../../helpers");

module.exports = {
    id         : "Async concise body",
    type       : "Virtual node",
    precedence : STRUCTURE,

    is         : (_, {current_state: s}) => s === async_concise_body,
    initialize : (node, token, parser) => {
        if (is_delimiter_token(token, '{')) {
            parser.change_state("async_arrow_function_body");
        } else {
            const prev_suffix = parser.suffixes;
            parser.suffixes = ["in", "await"];
            parser.change_state("assignment_expression");
            parser.suffixes = prev_suffix;
        }
        const expr = parser.generate_next_node();

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    }
};
