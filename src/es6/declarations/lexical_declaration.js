/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_declaration.js
* Created at  : 2019-08-24
* Updated at  : 2019-09-07
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

const { statement }     = require("../enums/states_enum");
const { DECLARATION }   = require("../enums/precedence_enum");
const { is_terminator } = require("../../helpers");

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
        const keyword = parser.generate_next_node();
        let terminator = null;

        parser.prepare_next_state("binding_list", true);
        parser.prev_node = {
            keyword,
            prev_node : parser.prev_node
        };
        const binding_list = parser.generate_next_node();

        if (parser.next_token) {
            parser.expect(';', is_terminator);
            parser.change_state("punctuator");
            terminator = parser.generate_next_node();
        }

        node.keyword      = keyword;
        node.binding_list = binding_list;
        node.terminator   = terminator;
        node.start        = keyword.start;
        node.end          = (terminator || binding_list).end;
    }
};
