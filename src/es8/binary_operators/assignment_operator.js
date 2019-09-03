/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_operator.js
* Created at  : 2019-09-03
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

const { expression }                = require("../enums/states_enum");
const { ASSIGNMENT_OPERATOR }       = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Assignment operator",
    type       : "Binary operator",
    precedence : ASSIGNMENT_OPERATOR,

    is (token, parser) {
        if (parser.current_state === expression && token.id === "Operator") {
            switch (token.value) {
                case    '=' :
                case   "+=" :
                case   "-=" :
                case   "*=" :
                case   "/=" :
                case   "%=" :
                case   "&=" :
                case   "|=" :
                case   "^=" :
                case  "**=" :
                case  "<<=" :
                case  ">>=" :
                case ">>>=" :
                    return get_last_non_comment_node(parser) !== null;
            }
        }
    },
    initialize (node, token, parser) {
        let last_node = get_last_non_comment_node(parser);
        parser.change_state("left_hand_side_expression", false);
        const assignemnt = parser.next_node_definition.refine(
            last_node, parser
        );
        if (! assignemnt.is_valid_simple_assignment_target(parser)) {
            parser.throw_unexpected_token(
                "Invalid left-hand side in assignment",
                assignemnt.expression
            );
        }

        parser.change_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prev_state = parser.current_state;
        parser.prepare_next_state("assignment_expression", true);
        const expression = parser.generate_next_node();

        node.assignemnt = assignemnt;
        node.operator   = operator;
        node.expression = expression;
        node.start      = assignemnt.start;
        node.end        = expression.end;

        parser.end(node);
    }
};
