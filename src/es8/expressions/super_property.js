/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : super_property.js
* Created at  : 2019-09-03
* Updated at  : 2020-08-30
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

const {MEMBER_EXPRESSION} = require("../enums/precedence_enum");
const {
    expression,
    super_call,
    computed_super_property,
} = require("../enums/states_enum");

module.exports = {
    id         : "Super property",
    type       : "Member expression",
    precedence : MEMBER_EXPRESSION,

    is (token, parser) {
        if (parser.current_state !== expression) return;

        const next_token = parser.look_ahead(true);
        switch (next_token.id) {
            case "Operator"  : return next_token.value === '.';
            case "Delimiter" :
                switch (next_token.value) {
                    case '[' :
                        parser.current_state = computed_super_property;
                        break;
                    case '(' :
                        parser.current_state = super_call;
                        break;
                    default: parser.throw_unexpected_token();
                }
                break;
        }
    },

    initialize (node, token, parser) {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("identifier_name", true);
        const property = parser.generate_next_node();

        node.keyword  = keyword;
        node.operator = operator;
        node.property = property;
        node.start    = keyword.start;
        node.end      = property.end;

        parser.end(node);
        parser.current_state = expression;
    },
};
