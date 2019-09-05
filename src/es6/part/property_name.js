/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_name.js
* Created at  : 2019-08-19
* Updated at  : 2019-09-06
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

const { EXPRESSION }    = require("../enums/precedence_enum");
const { property_name } = require("../enums/states_enum");

const literal_property_names = ["Number", "String"];

module.exports = {
    id         : "Property name",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === property_name,
    initialize : (node, token, parser) => {
        if (token.id === "Identifier") {
            parser.change_state("identifier_name");
        } else if (literal_property_names.includes(token.id)) {
            parser.change_state("expression");
        } else {
            parser.change_state("computed_property_name");
        }
        const name = parser.generate_next_node();

        node.name  = name;
        node.start = name.start;
        node.end   = name.end;
    }
};
