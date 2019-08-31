/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_declaration.js
* Created at  : 2019-08-24
* Updated at  : 2019-08-29
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { STATEMENT }           = require("../enums/precedence_enum");
const { lexical_declaration } = require("../enums/states_enum");
const { terminal_definition } = require("../../common");
const {
    is_comma,
    is_terminator,
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");
const get_variable_bindings_list = require(
    "../helpers/get_variable_binding_list"
);

const lexical_binding_list = new AST_Node_Definition({
    id         : "Binding list",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const list       = [];
        const delimiters = [];

        parser.prev_node      = null;
        parser.previous_nodes = [];
        parser.change_state("binding_element");

        LOOP:
        while (! is_terminator(parser)) {
            list.push(parser.generate_next_node());

            if (parser.next_token === null) {
                break;
            } else if (parser.next_token.id !== "Delimiter") {
                parser.throw_unexpected_token();
            }

            switch (parser.next_token.value) {
                case ',' :
                    delimiters.push(
                        terminal_definition.generate_new_node(parser)
                    );
                    parser.prepare_next_state("expression", true);
                    break;
                case ';' : break LOOP;
                default:
                    parser.throw_unexpected_token();
            }
        }

        node.list       = list;
        node.delimiters = delimiters;
        node.start      = list[0].start;
        node.end        = list[list.length - 1].end;
    }
});

module.exports = {
    id         : "Lexical declaration",
    type       : "Declaration",
    precedence : STATEMENT,

    is : (token, parser) => {
        return parser.current_state === lexical_declaration;
    },
    initialize : (node, token, parser) => {
        let terminator           = null;
        let { keyword, binding } = parser.prev_node;
        let list, comma, delimiters;
        let binding_list;

        if (keyword) {
            parser.prev_node = binding;
            //binding = lexical_binding.generate_new_node(parser);
            if (is_comma(parser)) {
                comma = terminal_definition.generate_new_node(parser);
                parser.prepare_next_state("expression");
                ({
                    list,
                    delimiters
                } = get_variable_bindings_list(parser, true));

                list.unshift(binding);
                delimiters.unshift(comma);
            } else {
                list       = [binding];
                delimiters = [];
            }
        } else {
            keyword = get_last_non_comment_node(parser);
            binding_list = lexical_binding_list.generate_new_node(parser);
        }

        if (parser.next_token) {
            if (! is_delimiter_token(parser.next_token, ';')) {
                parser.throw_unexpected_token();
            }
            terminator = terminal_definition.generate_new_node(parser);
        }

        node.keyword      = keyword;
        node.binding_list = binding_list;
        node.terminator   = terminator;
        node.start        = keyword.start;
        node.end          = (terminator || binding_list).end;

        parser.terminate(node);
    }
};
