/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_no_in.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-02
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

const { DECLARATION }                = require("../enums/precedence_enum");
const { variable_declaration_no_in } = require("../enums/states_enum");

module.exports = {
    id         : "Variable declaration no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is (_, parser) {
        return parser.current_state === variable_declaration_no_in;
    },
    initialize (node, token, parser) {
        parser.change_state("lexical_binding_no_in");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
