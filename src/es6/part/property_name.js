/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_name.js
* Created at  : 2019-08-19
* Updated at  : 2020-09-02
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {EXPRESSION}             = require("../enums/precedence_enum");
const {property_name}          = require("../enums/states_enum");
const {is_open_square_bracket} = require("../../helpers");

module.exports = {
    id         : "Property name",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === property_name,
    initialize : (node, token, parser) => {
        if (token.id === "Identifier") {
            parser.change_state("identifier_name");
        } else if (["Number", "String"].includes(token.id)) {
            parser.change_state("expression");
        } else if (token.value === '[') {
            parser.change_state("computed_member_access");
        } else {
            parser.throw_unexpected_token(`Invalid token in ${
                node.constructor.name
            }: ${token.id}`, token);
        }
        const expr = parser.generate_next_node();

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    },

    refine (node, expr, parser) {
        switch (expr.id) {
            case "Binding identifier" :
                expr = expr.identifier.identifier_name;
                break;
            case "Number" :
            case "String" :
                parser.change_state("expression");
                expr = parser.generate_next_node();
                break;
            case "Delimiter" :
                parser.expect('[', is_open_square_bracket);
                parser.change_state("computed_member_access");
                expr = parser.generate_next_node();
                break;
            default: parser.throw_unexpected_refine(node, expr);
        }

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;
    }
};
