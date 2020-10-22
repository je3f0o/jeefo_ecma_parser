/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_expression.js
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

const {EXPRESSION} = require("../enums/precedence_enum");
const {
    expression,
    generator_expression,
} = require("../enums/states_enum");
const {
    is_operator_token,
    is_open_parenthesis,
} = require("../../helpers");

module.exports = {
    id         : "Generator expression",
    type       : "Generator function definitions",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === generator_expression,
    initialize : (node, token, parser) => {
        let name = null;
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("punctuator");
        parser.expect('*', is_operator_token(parser.next_token, '*'));
        const asterisk = parser.generate_next_node();

        // Name
        const prev_suffix = parser.suffixes;
        parser.prepare_next_state("binding_identifier", true);
        if (! is_open_parenthesis(parser)) {
            name = parser.generate_next_node();
            parser.suffixes = ["yield"];
            parser.prepare_next_state("formal_parameters", true);
        } else {
            parser.suffixes = ["yield"];
            parser.change_state("formal_parameters");
        }

        // Parameters
        const parameters = parser.generate_next_node();

        // Body
        parser.prepare_next_state("generator_body", true);
        const body = parser.generate_next_node();

        node.keyword     = keyword;
        node.asterisk    = asterisk;
        node.name        = name;
        node.parameters  = parameters;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.suffixes      = prev_suffix;
        parser.is_terminated = false;
        parser.current_state = expression;
    }
};
