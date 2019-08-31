/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_variable_declarator.js
* Created at  : 2019-03-15
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     : Hiding long named variables and make it simple short named
*             : function for easier to use.
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition } = require("@jeefo/parser");
const precedence_enum         = require("../enums/precedence_enum");
const get_right_value         = require("./get_right_value");
const prepare_next_expression = require("./prepare_next_expression");
const { terminal_definition } = require("../../common");

// variable_declarator_node_definition
const variable_declarator_node_definition = new AST_Node_Definition({
    id         : "Variable declarator",
    type       : "Declarator",
    precedence : precedence_enum.STATEMENT,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        let init = null, operator = null;
        const identifier = parser.prev_node;

        // We don't want to use prepare_next_state("expression") here.
        // Because we want don't want to forget last node for automatic
        // semicolon insertion.
        parser.prepare_next_node_definition();

        if (parser.next_token !== null) {
            switch (parser.next_token.value) {
                case '=' :
                    if (parser.prev_node.id === "Identifier") {
                        parser.prev_node = null;
                    }
                    operator = terminal_definition.generate_new_node(parser);
                    prepare_next_expression(parser, true);
                    parser.post_comment = null;
                    init = get_right_value(parser, precedence_enum.COMMA);
                    if (parser.post_comment !== null) {
                        parser.prev_node = parser.post_comment;
                    }
                    break;
                case ',' :
                case ';' :
                    break;
                default:
                    parser.throw_unexpected_token();
            }
        }

        node.identifier      = identifier;
        node.assign_operator = operator;
        node.initializer     = init;
        node.start           = identifier.start;
        node.end             = (init || identifier).end;
    }
});

function get_variable_declarator (parser) {
    if (! parser.prev_node || parser.prev_node.id === "Comment") {
        parser.expect("identifier", parser => {
            if (parser.next_node_definition) {
                return parser.next_node_definition.id === "Identifier";
            }
        });
        parser.prev_node = parser.generate_next_node();
    }

    return variable_declarator_node_definition.generate_new_node(parser);
}

module.exports = get_variable_declarator;
