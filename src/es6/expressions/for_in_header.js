/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_header.js
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
const { for_in_header } = require("../enums/states_enum");

module.exports = {
    id         : "For in header",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === for_in_header,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine (node, input_node, parser) {
        let state_name;
        switch (input_node.id) {
            case "Variable statement" :
                if (input_node.declaration_list[0].initializer) {
                    state_name = "variable_declaration_no_in";
                } else {
                    state_name = "for_binding";
                }
                break;
            case "Lexical declaration" :
                state_name = "for_declaration";
                break;
            case "Expression" :
                input_node = input_node.list[0].expression;
                state_name = "left_hand_side_expression";
                break;
            default:
                parser.throw_unexpected_refine(node, input_node);
        }
        const binding = parser.refine(state_name, input_node);

        parser.change_state("keyword");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("expression_expression", true);
        const expression = parser.generate_next_node();

        node.binding    = binding;
        node.operator   = operator;
        node.expression = expression;
        node.start      = binding.start;
        node.end        = expression.end;
    }
};
