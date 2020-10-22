/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration.js
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

const {STATEMENT}            = require("../enums/precedence_enum");
const {is_operator_token}    = require("../../helpers");
const {variable_declaration} = require("../enums/states_enum");

module.exports = {
    id         : "Variable declaration",
    type       : "Variable statement",
    precedence : STATEMENT,

    is         : (_, {current_state: s}) => s === variable_declaration,
    initialize : (node, {id, value}, parser) => {
        let is_destructuring;
        switch (id) {
            case "Identifier" :
                parser.change_state("binding_identifier");
                break;
            case "Delimiter" :
                // I'm expected BindingPattern but I typed VaraibleDeclaration
                // here. Because for error message. Only for debugging.
                parser.expect("VaraibleDeclaration", ['[','{'].includes(value));
                is_destructuring = true;
                parser.change_state("binding_pattern");
                break;
            default: parser.throw_unexpected_token();
        }
        const binding = parser.generate_next_node();

        let initializer = null;
        parser.change_state("punctuator");
        const next_token = parser.look_ahead();
        if (next_token && is_operator_token(next_token, '=')) {
            parser.prepare_next_state("initializer");
            initializer = parser.generate_next_node();
        }

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;

        parser.end(node);
    },
};
