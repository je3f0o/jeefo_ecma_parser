/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_expression.js
* Created at  : 2019-08-22
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { terminal_definition } = require("../../common");
const {
    is_identifier,
    is_open_curly,
} = require("../../helpers");
const {
    expression,
    generator_expression,
} = require("../enums/states_enum");
const {
    function_body,
    parameters_definition,
} = require("../common");

const is_function = (token, parser) => {
    if (parser.current_state === expression) {
        return token.id === "Identifier" && token.value === "function";
    }
};

module.exports = {
    id         : "Function expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (token, parser) => {
        if (is_function(token, parser)) {
            const next_token = parser.look_ahead(true);
            if (next_token.id === "Operator" && next_token.value === '*') {
                parser.prev_state    = parser.current_state;
                parser.current_state = generator_expression;
                return false;
            }
            return true;
        }
    },
    initialize : (node, token, parser) => {
        let name      = null;
        const keyword = terminal_definition.generate_new_node(parser);

        const { current_state } = parser;
        parser.prepare_next_state("expression", true);
        if (is_identifier(parser)) {
            name = parser.generate_next_node();
            parser.prepare_next_state("delimiter", true);
        }
        const parameters = parameters_definition.generate_new_node(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect('{', is_open_curly);
        const body = function_body.generate_new_node(parser);

        node.keyword     = keyword;
        node.name        = name;
        node.parameters  = parameters;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.next_token    = token;
        parser.current_state = current_state;
    }
};
