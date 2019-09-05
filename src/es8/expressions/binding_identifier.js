/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_identifier.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-05
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

const { EXPRESSION }         = require("../enums/precedence_enum");
const { binding_identifier } = require("../enums/states_enum");
const { is_identifier_name } = require("../../helpers");

const valid_terminal_values = ["yield", "await"];

module.exports = {
    id         : "Binding identifier",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        return parser.current_state === binding_identifier;
    },

    initialize (node, token, parser) {
        parser.expect("identifier", is_identifier_name);

        if (parser.suffixes.includes(token.value)) {
            parser.throw_unexpected_token("Unexpected keyword");
        } else if (! valid_terminal_values.includes(token.value)) {
            parser.change_state("keyword");
            if (parser.next_node_definition) {
                parser.throw_unexpected_token("Unexpected identifier");
            }
        }

        parser.change_state("identifier_name");
        parser.next_node_definition.initialize(node, token, parser);
    },

    refine (node, identifier, parser) {
        if (identifier.id !== "Identifier reference") {
            parser.throw_unexpected_refine(node, identifier);
        }

        node.pre_comment = identifier.pre_comment;
        node.value       = identifier.value;
        node.start       = identifier.start;
        node.end         = identifier.end;
    }
};
