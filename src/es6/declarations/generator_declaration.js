/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_declaration.js
* Created at  : 2019-08-22
* Updated at  : 2020-09-10
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

const {DECLARATION}           = require("../enums/precedence_enum");
const {generator_declaration} = require("../enums/states_enum");
const {
    is_operator_token,
    is_identifier_token,
} = require("../../helpers");

module.exports = {
    id         : "Generator declaration",
    type       : "Generator function definitions",
    precedence : DECLARATION,
    is         : (_, {current_state: s}) => s === generator_declaration,
    initialize : (node, token, parser) => {
        parser.expect("function", is_identifier_token(token, "function"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("punctuator", true);
        parser.expect('*', is_operator_token(parser.next_token, '*'));
        const asterisk = parser.generate_next_node();

        parser.prepare_next_state("binding_identifier", true);
        const name = parser.generate_next_node();

        const prev_suffix = parser.suffixes;
        parser.suffixes = ["yield"];
        parser.prepare_next_state("formal_parameters", true);
        const parameters = parser.generate_next_node();

        parser.prepare_next_state("generator_body", true);
        const body = parser.generate_next_node();

        node.keyword     = keyword;
        node.asterisk    = asterisk;
        node.name        = name;
        node.parameters  = parameters;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.suffixes = prev_suffix;
        parser.terminate(node);
    }
};
