/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : single_name_binding.js
* Created at  : 2019-09-07
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-destructuring-binding-patterns
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {EXPRESSION}          = require("../enums/precedence_enum");
const {single_name_binding} = require("../enums/states_enum");
const {
    is_assign,
    is_assign_token,
} = require("../../helpers");

const init = (node, identifier, initializer) => {
    if (identifier.id !== "Binding identifier") throw identifier;

    node.binding_identifier = identifier;
    node.initializer        = initializer;
    node.start              = identifier.start;
    node.end                = (initializer || identifier).end;
};

module.exports = {
    id         : "Single name binding",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === single_name_binding,
    initialize : (node, token, parser) => {
        let initializer = null;
        parser.change_state("binding_identifier");
        const identifier = parser.generate_next_node();

        parser.prepare_next_state("initializer", true);
        if (is_assign_token(parser.next_token)) {
            initializer = parser.generate_next_node();
        }

        init(node, identifier, initializer);
    },

    refine (node, expr, parser) {
        let initializer = null, identifier;
        switch (expr.id) {
            case "Binding identifier" :
                identifier = expr;
                break;
            case "Identifier reference" :
                identifier = parser.refine("binding_identifier", expr);
                break;
            case "Cover initialized name" :
                identifier = parser.refine(
                    "binding_identifier", expr.identifier
                );
                if (expr.initializer) {
                    initializer = expr.initializer;
                }
                break;
            case "Assignment property identifier" :
                const {identifier: ref_id} = expr;
                identifier  = parser.refine("binding_identifier", ref_id);
                initializer = expr.initializer;
                break;
            case "Assignment operator" :
                const {left} = expr;
                identifier  = parser.refine("binding_identifier", left);
                initializer = parser.refine("initializer", expr);
                break;
            case "Assignment element" :
                const {target} = expr;
                identifier  = parser.refine("binding_identifier", target);
                initializer = expr.initializer;
                break;
            case "Binding property":
                identifier = expr.identifier;
                if (is_assign(parser)) {
                    parser.change_state("initializer");
                    initializer = parser.generate_next_node();
                }
                break;
            default: parser.throw_unexpected_refine(node, expr);
        }

        init(node, identifier, initializer);
    }
};
