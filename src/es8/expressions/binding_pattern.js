/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_pattern.js
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

const { EXPRESSION }      = require("../enums/precedence_enum");
const { binding_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Binding pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, { current_state : s }) => s === binding_pattern,
    refine : (node, expression, parser) => {
        let pattern_name;
        switch (expression.id) {
            case "Array literal"  :
                pattern_name = "array_binding_pattern";
                break;
            case "Object literal" :
                pattern_name = "object_binding_pattern";
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }
        const pattern = parser.refine(pattern_name, expression);

        node.pattern = pattern;
        node.start   = pattern.start;
        node.end     = pattern.end;
    }
};
