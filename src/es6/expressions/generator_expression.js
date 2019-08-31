/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_expression.js
* Created at  : 2019-08-22
* Updated at  : 2019-08-28
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

const { terminal_definition }          = require("../../common");
const { generator_expression }         = require("../enums/states_enum");
const { GENERATOR_EXPRESSION }         = require("../enums/precedence_enum");
const { is_open_curly, is_identifier } = require("../../helpers");

module.exports = {
    id         : "Generator expression",
    type       : "Expression",
    precedence : GENERATOR_EXPRESSION,

    is : (token, parser) => {
        return parser.current_state === generator_expression;
    },
    initialize : (node, token, parser) => {
        let name             = null;
        const keyword        = terminal_definition.generate_new_node(parser);
        const { prev_state } = parser;

        parser.prepare_next_node_definition();
        const asterisk = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        if (is_identifier(parser)) {
            name = parser.generate_next_node();
            parser.prepare_next_state("formal_parameter_list", true);
        } else {
            parser.change_state("formal_parameter_list");
        }

        const parameters = parser.generate_next_node();

        parser.prepare_next_state("function_body", true);
        parser.expect('{', is_open_curly);
        const body = parser.generate_next_node();

        node.keyword     = keyword;
        node.asterisk    = asterisk;
        node.name        = name;
        node.parameters  = parameters;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    }
};
