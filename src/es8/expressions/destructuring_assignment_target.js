/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : destructuring_assignment_target.js
* Created at  : 2019-09-05
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

const {EXPRESSION}                      = require("../enums/precedence_enum");
const {destructuring_assignment_target} = require("../enums/states_enum");

module.exports = {
    id         : "Destructuring assignment target",
	type       : "Expression",
	precedence : EXPRESSION,

    is (_, { current_state }) {
        return current_state === destructuring_assignment_target;
    },
	refine (node, expression, parser) {
        parser.change_state("left_hand_side_expression");
        const def = parser.next_node_definition;

        let target;
        if (def.is_destructuring(expression)) {
            target = parser.refine(
                "assignment_pattern",
                // left hand ->
                // new expression ->
                // member expresssion ->
                // primary expression ->
                // and array or object
                expression.expression
            );
        } else if (! expression.is_valid_simple_assignment_target(parser)) {
            parser.throw_unexpected_token(
                "Invalid destructuring assignment target",
                expression
            );
        } else {
            target = def._refine(expression, parser);
        }

        node.target = target;
        node.start  = target.start;
        node.end    = target.end;
    },
};
