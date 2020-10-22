/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_pattern.js
* Created at  : 2019-09-05
* Updated at  : 2020-08-26
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

const {EXPRESSION}      = require("../enums/precedence_enum");
const {binding_pattern} = require("../enums/states_enum");

const init = (node, pattern) => {
    node.pattern = pattern;
    node.start   = pattern.start;
    node.end     = pattern.end;
};

module.exports = {
    id         : "Binding pattern",
	type       : "Destructuring binding patterns",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === binding_pattern,
    initialize : (node, token, parser) => {
        try {
            if (token.id !== "Delimiter") throw token;
            switch (token.value) {
                case '[' :
                    parser.change_state("array_binding_pattern");
                    break;
                case '{' :
                    parser.change_state("object_binding_pattern");
                    break;
                default: throw token;
            }
        } catch (e) {
            if (e === token) {
                parser.throw_unexpected_token(
                    `Unexpected token to initialize in ${
                        node.constructor.name
                    }: ${token.id}`, token
                );
            } else throw e;
        }
        init(node, parser.generate_next_node());
    },

    refine : (node, expression, parser) => {
        let pattern_name;
        switch (expression.id) {
            case "Array literal"  :
                pattern_name = "array_binding_pattern";
                break;
            case "Object literal" :
                pattern_name = "object_binding_pattern";
                break;
            case "Assignment pattern" :
                if (expression.pattern.id === "Array assignment pattern") {
                    pattern_name = "array_binding_pattern";
                } else {
                    pattern_name = "object_binding_pattern";
                }
                expression = expression.pattern;
                break;
            default:
                console.log(expression);
                debugger
                parser.throw_unexpected_refine(node, expression);
        }
        init(node, parser.refine(pattern_name, expression));
    }
};
