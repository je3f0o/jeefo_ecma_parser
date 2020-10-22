/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_binding.js
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

const {DECLARATION}     = require("../enums/precedence_enum");
const {lexical_binding} = require("../enums/states_enum");
const {
    is_assign,
    is_operator_token,
} = require("../../helpers");

module.exports = {
    id         : "Lexical binding",
    type       : "Let and Const declarations",
    precedence : DECLARATION,

    is         : (_, {current_state: s}) => s === lexical_binding,
    initialize : (node, token, parser) => {
        let is_destructuring = false;
        if (token.id === "Identifier") {
            parser.change_state("binding_identifier");
        } else {
            is_destructuring = true;
            parser.change_state("binding_pattern");
        }
        parser.context_stack.push("Lexical declaration");
        const binding = parser.generate_next_node();
        parser.context_stack.pop();

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

    refine (node, binding, parser) {
        parser.expect("ForBinding", binding.id === "For binding");

        let initializer = null;
        parser.prepare_next_state("expression", true);
        if (is_assign(parser)) {
            parser.change_state("initializer");
            initializer = parser.generate_next_node();
            parser.prepare_next_state("punctuator", true);
        }

        node.binding     = binding;
        node.initializer = initializer;
        node.start       = binding.start;
        node.end         = (initializer || binding).end;

        parser.end(node);
    }
};
