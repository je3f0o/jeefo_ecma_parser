/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : single_name_binding.js
* Created at  : 2019-09-07
* Updated at  : 2019-09-07
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-destructuring-binding-patterns
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { EXPRESSION }          = require("../enums/precedence_enum");
const { single_name_binding } = require("../enums/states_enum");

module.exports = {
    id         : "Single name binding",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === single_name_binding,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine : (node, expression, parser) => {
        let initializer = null, identifier;
        switch (expression.id) {
            case "Identifier reference" :
                identifier = expression;
                break;
            case "Cover initialized name" :
                identifier  = expression.identifier;
                initializer = expression.initializer;
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.identifier  = identifier;
        node.initializer = initializer;
        node.start       = identifier.start;
        node.end         = (initializer || identifier).end;
    }
};
