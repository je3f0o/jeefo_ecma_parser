/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : precedence_enum.js
* Created at  : 2019-02-13
* Updated at  : 2020-09-10
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

module.exports = {
    TERMINAL_SYMBOL           : -1,
    TERMINATION               : 0,
    COMMA                     : 1,

    // TODO: yield

    // Expressions
    ASSIGNMENT_EXPRESSION     : 3,
    CONDITIONAL_EXPRESSION    : 4,
    NULLISH                   : 5, // TODO:
    LOGICAL_OR_EXPRESSION     : 6,
    LOGICAL_AND_EXPRESSION    : 7,
    BITWISE_OR_EXPRESSION     : 8,
    BITWISE_XOR_EXPRESSION    : 9,
    BITWISE_AND_EXPRESSION    : 10,
    EQUALITY_EXPRESSION       : 11,
    RELATIONAL_EXPRESSION     : 12,
    SHIFT_EXPRESSION          : 13,
    ADDITIVE_EXPRESSION       : 14,
    MULTIPLICATIVE_EXPRESSION : 15,
    EXPONENTIATION_EXPRESSION : 16,
    UNARY_PREFIX_EXPRESSION   : 17,
    UNARY_POSTFIX_EXPRESSION  : 18,
    NEW_WITHOUT_ARGS          : 19,
    NEW_WITH_ARGS             : 20,
    MEMBER_EXPRESSION         : 20,
    CALL_EXPRESSION           : 20,
    GROUPING_EXPRESSION       : 21,

    LEFT_HAND_SIDE_EXPRESSION : 20,

    // WTF are these ???
    PRIMITIVE                 : 31,
    PROPERTY_ASSIGN           : 32,
    METHOD_DEFINITION         : 33,
    GETTER_METHOD             : 34,
    SETTER_METHOD             : 34,
    PROPERTY_NAME             : 34,
    PROPERTY_CONTROL          : 35,
    EXPRESSION                : 40,
    EXPRESSION_STATEMENT      : 45,
    STATEMENT                 : 46,
    DECLARATION               : 47,

    SYNTAX                    : 99,
    COMMENT                   : 99,
    STRUCTURE                 : 99,
    IDENTIFIER                : 90,
};
