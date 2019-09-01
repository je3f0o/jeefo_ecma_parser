/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_declaration_no_in.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-01
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

const { DECLARATION }               = require("../enums/precedence_enum");
const { is_terminator }             = require("../../helpers");
const { lexical_declaration_no_in } = require("../enums/states_enum");

module.exports = {
    id         : "Lexical declaration no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        return parser.current_state === lexical_declaration_no_in;
    },
    initialize : (node, token, parser) => {
        const { keyword } = parser.prev_node;

        parser.change_state("binding_list_no_in");
        const binding_list = parser.generate_next_node();

        parser.expect(';', is_terminator);
        const terminator = parser.generate_next_node();

        node.keyword      = keyword;
        node.binding_list = binding_list;
        node.terminator   = terminator;
        node.start        = keyword.start;
        node.end          = terminator.end;
    }
};
