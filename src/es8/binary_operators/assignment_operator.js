/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_operator.js
* Created at  : 2019-09-03
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
        let last_node = get_last_non_comment_node(parser), assignment;
        parser.change_state("left_hand_side_expression");
        const def = parser.next_node_definition;

        if (token.value === '=' && def.is_destructuring(last_node)) {
            assignment = parser.refine(
                "assignment_pattern", last_node.expression
            );
        } else if (! last_node.is_valid_simple_assignment_target) {
            console.log(last_node);
            process.exit();
        } else if (! last_node.is_valid_simple_assignment_target(parser)) {
            parser.throw_unexpected_token(
                "Invalid left-hand side in assignment",
                assignment.expression
            );
        } else {
            assignment = def._refine(last_node, parser);
        }

        parser.change_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prev_state = parser.current_state;
        parser.prepare_next_state("assignment_expression", true);
        const expression = parser.generate_next_node();

        node.left     = assignment;
        node.operator = operator;
        node.right    = expression;
        node.start    = assignment.start;
        node.end      = expression.end;

        parser.end(node);
    }
};
