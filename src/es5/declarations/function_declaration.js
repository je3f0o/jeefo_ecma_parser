/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration.js
* Created at  : 2019-01-29
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { DECLARATION }         = require("../enums/precedence_enum");
const { is_expression }       = require("../helpers");
const { terminal_definition } = require("../../common");
const {
    statement,
    function_expression,
} = require("../enums/states_enum");
const {
    is_identifier,
    is_open_curly,
} = require("../../helpers");

module.exports = {
    id         : "Function declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        if (parser.current_state === statement) {
            return true;
        } else if (is_expression(parser)) {
            parser.prev_state    = parser.current_state;
            parser.current_state = function_expression;
        }
    },

    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        parser.expect("identifier", is_identifier);
        const name = parser.generate_next_node();

        parser.prepare_next_state("formal_parameter_list", true);
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

        parser.terminate(node);
    }
};
