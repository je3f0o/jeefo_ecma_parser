/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_reference.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-04
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

const { EXPRESSION } = require("../enums/precedence_enum");
const {
    expression,
    primary_expression,
    identifier_reference,
} = require("../enums/states_enum.js");

module.exports = {
    id         : "Identifier reference",
    type       : "Expression",
    precedence : EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression) {
            return token.id === "Identifier";
        }
        return parser.current_state === identifier_reference;
    },

    initialize (node, token, parser) {
        const prev_state = parser.current_state;

        parser.change_state("binding_identifier");
        parser.next_node_definition.initialize(node, token, parser);

        if (prev_state === expression) {
            parser.ending_index -= 1;
            parser.current_state = primary_expression;
        }
    },

    protos : {
        is_valid_simple_assignment_target () {
            // 12.1.3 eval or arguments are invalid in strict mode
            return ! ["eval", "arguments"].includes(this.value);
        }
    }
};
