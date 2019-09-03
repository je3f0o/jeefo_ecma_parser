/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_expression.js
* Created at  : 2019-08-22
* Updated at  : 2019-09-04
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { is_open_parenthesis } = require("../../helpers");
const {
    primary_expression,
    function_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Function expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === function_expression,
    initialize : (node, token, parser) => {
        let name = null;
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        const prev_suffix = parser.suffixes;
        parser.suffixes = [];

        parser.prepare_next_state("binding_identifier", true);
        if (! is_open_parenthesis(parser)) {
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
        parser.current_state = primary_expression;
    }
};
