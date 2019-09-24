/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_concise_body.js
* Created at  : 2019-09-07
* Updated at  : 2019-09-21
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

const array_remove           = require("@jeefo/utils/array/remove");
const { EXPRESSION }         = require("../enums/precedence_enum");
const { async_concise_body } = require("../enums/states_enum");
const { is_delimiter_token } = require("../../helpers");

module.exports = {
    id         : "Async concise body",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === async_concise_body,
    initialize : (node, token, parser) => {
        const prev_suffixes = parser.suffixes;
        const new_suffixes = prev_suffixes.concat();
        array_remove(new_suffixes, "yield");
        if (! new_suffixes.includes("await")) {
            new_suffixes.push("await");
        }
        parser.suffixes = new_suffixes;

        if (is_delimiter_token(token, '{')) {
            parser.change_state("async_arrow_function_body");
        } else {
            parser.change_state("assignment_expression");
        }
        const expression = parser.generate_next_node();

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;

        parser.suffixes = prev_suffixes;
    }
};
