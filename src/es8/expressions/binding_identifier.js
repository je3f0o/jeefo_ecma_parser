/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_identifier.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-03
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

const is_keyword = node_definition => {
    if (node_definition) {
        return node_definition.id === "Keyword";
    }
};

const valid_terminal_values = ["yield", "await"];

module.exports = {
    id         : "Binding identifier",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        if (parser.current_state === binding_identifier) {
            return token.id === "Identifier";
        }
    },
    initialize (node, token, parser) {
        if (parser.suffixes.includes(token.value)) {
            parser.throw_unexpected_token("Unexpected keyword");
        } else if (! valid_terminal_values.includes(token.value)) {
            parser.change_state("keyword");
            if (is_keyword(parser.next_node_definition)) {
                parser.throw_unexpected_token("Unexpected identifier");
            }
        }

        parser.change_state("identifier_name");
        parser.next_node_definition.initialize(node, token, parser);
    }
};
