/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_pattern.js
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
const { assignment_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === assignment_pattern,
	initialize : (node, token, parser) => {
        console.log(node.id);
        switch (parser.prev_node.id) {
            case "Array literal"  :
                parser.change_state("array_assignment_pattern");
                break;
            case "Object literal" :
                parser.change_state("object_assignment_pattern");
                break;
            default:
                parser.throw_unexpected_token(null, parser.prev_node);
        }
        const pattern = parser.generate_next_node();

        node.pattern = pattern;
        node.start   = pattern.start;
        node.end     = pattern.end;
    },
};
