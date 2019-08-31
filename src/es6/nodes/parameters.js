/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parameters.js
* Created at  : 2019-08-19
* Updated at  : 2019-08-22
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-function-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition } = require("@jeefo/parser");
const binding_rest            = require("./binding_rest_element");
const binding_element         = require("./binding_element");
const { terminal_definition } = require("../../common");

const {
    is_comma,
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");

module.exports = new AST_Node_Definition({
    id         : "Formal parameter list",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const params     = [];
        const delimiters = [];

        parser.expect('(', is_open_parenthesis);
        const open = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        while (! is_close_parenthesis(parser)) {
            if (parser.next_token.value === "...") {
                params.push(binding_rest.generate_new_node(parser));

                if (parser.next_token.value !== ')') {
                    parser.throw_unexpected_token(
                        "Rest parameter must be last formal parameter"
                    );
                }
            } else {
                params.push(binding_element.generate_new_node(parser));
            }

            if (parser.next_token === null) {
                parser.throw_unexpected_end_of_stream();
            }

            if (! is_close_parenthesis(parser)) {
                parser.change_state("delimiter");
                parser.expect('(', is_comma);
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("expression", true);
            }
        }

        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.parameter_list    = params;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    }
});
