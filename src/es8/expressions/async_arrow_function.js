/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_function.js
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

const { terminal_definition }  = require("../../common");
const { ASYNC_ARROW_FUNCTION } = require("../enums/precedence_enum");
const {
    expression,
    async_arrow_function,
} = require("../enums/states_enum");
const {
    arrow_parameters,
    async_function_body,
}  = require("../common");
const {
    is_open_curly,
    parse_asignment_expression,
} = require("../../helpers");

module.exports = {
    id         : "Async arrow function",
    type       : "Expression",
    precedence : ASYNC_ARROW_FUNCTION,

    is : (token, parser) => {
        return parser.current_state === async_arrow_function;
    },
    initialize : (node, token, parser) => {
        let keyword, parameters;
        if (parser.prev_node) {
            const call_expr = parser.prev_node;
            parser.next_token = call_expr.callee;
            keyword = terminal_definition.generate_new_node(parser);

            parser.prev_node = call_expr.arguments;
            parameters = arrow_parameters.generate_new_node(parser);
        } else {
            keyword = terminal_definition.generate_new_node(parser);
            parser.prepare_next_state("expression", true);

            parser.prev_node = parser.generate_next_node();
            parameters = arrow_parameters.generate_new_node(parser);
        }

        parser.prepare_next_node_definition(true);
        const arrow_token = terminal_definition.generate_new_node(parser);

        let body;
        parser.prepare_next_state("expression", true);
        if (is_open_curly(parser)) {
            body = async_function_body.generate_new_node(parser);
            parser.current_state = expression;
            parser.prepare_next_node_definition();
        } else {
            body = parse_asignment_expression(parser);
        }

        node.keyword     = keyword;
        node.parameters  = parameters;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;
    }
};
