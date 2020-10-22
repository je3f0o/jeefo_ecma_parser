/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_expression.js
* Created at  : 2019-08-27
* Updated at  : 2020-08-25
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

const {EXPRESSION}          = require("../enums/precedence_enum");
const {function_expression} = require("../enums/states_enum");
const {terminal_definition} = require("../../common");

const {
    is_identifier,
    is_open_curly,
} = require("../../helpers");

module.exports = {
    id         : "Function expression",
    type       : "Function definition",
    precedence : EXPRESSION,

    is : (token, parser) => {
        return parser.current_state === function_expression;
    },
    initialize : (node, token, parser) => {
        let name             = null;
        const keyword        = terminal_definition.generate_new_node(parser);
        const { prev_state } = parser;

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
        node.name        = name;
        node.parameters  = parameters;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.current_state = prev_state;
    }
};
