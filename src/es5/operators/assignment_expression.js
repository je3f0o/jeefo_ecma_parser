/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_expression.js
* Created at  : 2019-09-09
* Updated at  : 2020-08-25
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
const { ASSIGNMENT_EXPRESSION }     = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Assignment operator",
    type       : "Assignment expression",
    precedence : ASSIGNMENT_EXPRESSION,

    is ({ id, value }, parser) {
        if (parser.current_state === expression && id === "Operator") {
            switch (value) {
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
        const last_node = get_last_non_comment_node(parser);
        if (! last_node.is_valid_simple_assignment_target(parser)) {
            parser.throw_unexpected_token(
                "Invalid left-hand side in assignment",
                last_node
            );
        }
        const assignment = parser.refine(last_node, parser);

        parser.change_state("punctuator");
        const operator = parser.generate_next_node();

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
