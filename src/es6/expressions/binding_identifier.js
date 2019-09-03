/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_identifier.js
* Created at  : 2019-08-28
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
const { is_identifier }      = require("../../helpers");
const { binding_identifier } = require("../enums/states_enum");

const valid_nodes = [
    "Identifier",
    "Identifier reference",
];

module.exports = {
    id         : "Binding identifier",
    type       : "Primitive",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === binding_identifier,
    initialize : (node, token, parser) => {
        if (parser.prev_node) {
            if (valid_nodes.includes(parser.prev_node.id)) {
                token = parser.prev_node;
            } else {
                parser.throw_unexpected_token(
                    "Invalid binding identifier", parser.prev_node
                );
            }
        } else {
            parser.change_state("expression");
            parser.expect("identifier", is_identifier);
        }

        node.value = token.value;
        node.start = token.start;
        node.end   = token.end;
    }
};
