/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_of_header.js
* Created at  : 2019-08-29
* Updated at  : 2019-09-08
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

const { EXPRESSION }    = require("../enums/precedence_enum");
const { for_of_header } = require("../enums/states_enum");

const error_message = (
    "for-of loop variable declaration may not have an initializer."
);

module.exports = {
    id         : "For of header",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === for_of_header,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine (node, input_node, parser) {
        let state_name;
        switch (input_node.id) {
            case "Variable statement" :
                if (input_node.declaration_list[0].initializer) {
                    parser.throw_unexpected_token(
                        error_message,
                        input_node.declaration_list[0]
                    );
                } else {
                    state_name = "for_binding";
                }
                break;
            case "Lexical declaration" :
                state_name = "for_declaration";
                break;
            default:
                parser.throw_unexpected_refine(node, input_node);
        }
        const binding = parser.refine(state_name, input_node);

        parser.change_state("contextual_keyword");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const expression = parser.generate_next_node();

        node.binding    = binding;
        node.operator   = operator;
        node.expression = expression;
        node.start      = binding.start;
        node.end        = expression.end;
    }
};
