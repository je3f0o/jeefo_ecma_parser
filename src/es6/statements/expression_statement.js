/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-28
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

const { statement } = require("../enums/states_enum");
const { STATEMENT } = require("../enums/precedence_enum");

const es5_expression_statement = require(
    "../../es5/statements/expression_statement"
);

const expression_delimiters = ['[', '('];
const expression_keywords = [
    "new",
    "void",
    "yield",
    "delete",
    "typeof",

    "null",
    "true",
    "false",
    "undefined",
];
const unary_expressions = [ "~", "!", "+", "-", "++", "--" ];

module.exports = {
    id         : "Expression statement",
    type       : "Statement",
    precedence : STATEMENT,

    is : (token, parser) => {
        if (parser.current_state !== statement) { return; }

        switch (token.id) {
            case "Slash"    :
            case "String"   :
            case "Number"   :
            case "Backtick" :
                return true;
            case "Identifier" :
                if (expression_keywords.includes(token.value)) {
                    return true;
                }
                return ! parser.is_reserved_word(token.value);
            case "Delimiter" :
                return expression_delimiters.includes(token.value);
            case "Operator" :
                return unary_expressions.includes(token.value);
        }
    },

    initialize : es5_expression_statement.initialize
};
