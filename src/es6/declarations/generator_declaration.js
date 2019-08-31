/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_declaration.js
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

const { DECLARATION }                  = require("../enums/precedence_enum");
const { terminal_definition }          = require("../../common");
const { generator_declaration }        = require("../enums/states_enum");
const { is_identifier, is_open_curly } = require("../../helpers");

module.exports = {
    id         : "Generator declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        return parser.current_state === generator_declaration;
    },
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_node_definition();
        const asterisk = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        parser.expect("identifier", is_identifier);
        const name = parser.generate_next_node();

        parser.prepare_next_state("formal_parameter_list", true);
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

        parser.terminate(node);
    }
};
