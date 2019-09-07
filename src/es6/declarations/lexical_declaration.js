/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_declaration.js
* Created at  : 2019-08-24
* Updated at  : 2019-09-08
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

const { statement }                    = require("../enums/states_enum");
const { DECLARATION }                  = require("../enums/precedence_enum");
const { is_comma, is_terminator }      = require("../../helpers");
const { missing_initializer_in_const } = require("../helpers/error_reporter");

module.exports = {
    id         : "Lexical declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (token, { current_state : s }) => s === statement,
    initialize : (node, token, parser) => {
        if (token.value === "let") {
            parser.change_state("contextual_keyword");
        } else {
            parser.change_state("keyword");
        }
        const list       = [];
        const keyword    = parser.generate_next_node();
        const is_const   = keyword.value === "const";
        const delimiters = [];
        let terminator   = null;

        do {
            parser.prepare_next_state("lexical_binding", true);
            const binding = parser.generate_next_node();
            const error_occurred = (
                is_const &&
                ! binding.initializer &&
                ! parser.is_terminated
            );
            if (error_occurred) {
                missing_initializer_in_const(parser, binding);
            }
            list.push(binding);

            if (parser.next_token === null) { break; }
            else if (is_comma(parser)) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());
            }
        } while (! is_terminator(parser));

        if (parser.next_token) {
            parser.expect(';', is_terminator);
            parser.change_state("punctuator");
            terminator = parser.generate_next_node();
        }

        node.keyword      = keyword;
        node.binding_list = list;
        node.delimiters   = delimiters;
        node.terminator   = terminator;
        node.start        = keyword.start;
        node.end          = (terminator || list[list.length - 1]).end;
    }
};
