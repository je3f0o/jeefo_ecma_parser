/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_expression.js
* Created at  : 2019-08-22
* Updated at  : 2020-08-31
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
const {is_open_parenthesis} = require("../../helpers");
const {
    expression,
    function_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Function expression",
    type       : "Primary expression",
    precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === function_expression,

    initialize : (node, token, parser) => {
        let name = null;
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        const prev_suffix = parser.suffixes;
        parser.suffixes = ["in"];

        parser.prepare_next_state("binding_identifier", true);
        if (parser.next_token.id === "Identifier") {
            name = parser.generate_next_node();
            parser.prepare_next_state("formal_parameters", true);
        } else {
            parser.change_state("formal_parameters");
        }
        const parameters = parser.generate_next_node();

        parser.prepare_next_state("function_body", true);
        const body = parser.generate_next_node();

        node.keyword     = keyword;
        node.name        = name;
        node.parameters  = parameters;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.suffixes      = prev_suffix;
        parser.current_state = expression;
    }
};
