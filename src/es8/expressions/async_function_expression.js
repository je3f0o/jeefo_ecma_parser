/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_function_expression.js
* Created at  : 2019-08-27
* Updated at  : 2019-08-27
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { terminal_definition }       = require("../../common");
const { async_function_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Async function expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (token, parser) => {
        return parser.current_state === async_function_expression;
    },
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        let fn;
        parser.prepare_next_state("expression", true);
        if (parser.is_next_node("Function expression")) {
            fn = parser.generate_next_node();
        } else {
            parser.throw_unexpected_token();
        }

        node.keyword  = keyword;
        node.function = fn;
        node.start    = keyword.start;
        node.end      = fn.end;

        parser.next_token = token;
    }
};
