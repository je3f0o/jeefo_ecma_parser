/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function.js
* Created at  : 2019-08-12
* Updated at  : 2019-08-29
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { EXPRESSION }          = require("../enums/precedence_enum");
const { is_expression }       = require("../../es5/helpers");
const { arrow_parameters }    = require("../nodes");
const { terminal_definition } = require("../../common");
const {
    is_open_curly,
    get_last_non_comment_node,
    parse_asignment_expression,
} = require("../../helpers");

const param_nodes = [ "Identifier", "Grouping expression" ];

module.exports = {
    id         : "Arrow function",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (token, parser) => {
        if (is_expression(parser) && token.id === "Arrow") {
            const node = get_last_non_comment_node(parser);
            if (node && param_nodes.includes(node.id)) {
                return node.end.line === token.start.line;
            }
        }
    },
    initialize : (node, token, parser) => {
        const prev_state  = parser.current_state;
        const parameters  = arrow_parameters.generate_new_node(parser);
        const arrow_token = terminal_definition.generate_new_node(parser);

        let body;
        parser.prepare_next_state("function_body", true);
        if (is_open_curly(parser)) {
            body = parser.generate_next_node();
        } else {
            parser.change_state("expression");
            body = parse_asignment_expression(parser);
        }

        node.parameters  = parameters;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = parameters.start;
        node.end         = body.end;

        parser.current_state = prev_state;
    }
};
