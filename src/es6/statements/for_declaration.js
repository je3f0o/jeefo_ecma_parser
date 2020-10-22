/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_declaration.js
* Created at  : 2019-09-01
* Updated at  : 2020-09-07
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

const {STATEMENT}       = require("../enums/precedence_enum");
const {for_declaration} = require("../enums/states_enum");

const is_let_or_const = ({id, value}) =>
    id === "Identifier" && ["const", "let"].includes(value);

module.exports = {
    id         : "For declaration",
    type       : "Iteration statements",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === for_declaration,

    initialize (node, token, parser) {
        parser.expect("LetOrConst", is_let_or_const(parser.next_token));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("for_binding");
        const binding = parser.generate_next_node();

        node.keyword = keyword;
        node.binding = binding;
        node.start   = keyword.start;
        node.end     = binding.end;
    },

    refine (node, lexical_declaration, parser) {
        console.log("DEPRECATED");
        debugger
        const {
            keyword,
            binding_list : [binding_element]
        } = lexical_declaration;

        if (binding_element.initializer) {
            parser.throw_unexpected_token(
                `for-${
                    parser.next_token.value
                } loop variable declaration may not have an initializer.`,
                binding_element
            );
        }

        node.keyword = keyword;
        node.binding = binding_element.binding;
        node.start   = keyword.start;
        node.end     = binding_element.end;

    }
};
