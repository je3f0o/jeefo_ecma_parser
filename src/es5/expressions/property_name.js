/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_name.js
* Created at  : 2019-08-27
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

const { PROPERTY_NAME }   = require("../enums/precedence_enum");
const { identifier_name } = require("../../common");
const {
    property_name,
    property_assign,
} = require("../enums/states_enum");

const literal_property_names = ["Number", "String"];

module.exports = {
    id         : "Property name",
    type       : "Expression",
    precedence : PROPERTY_NAME,

    is         : (_, parser) => parser.current_state === property_name,
    initialize : (node, token, parser) => {
        let name;

        if (token.id === "Identifier") {
            name = identifier_name.generate_new_node(parser);
        } else if (literal_property_names.includes(token.id)) {
            parser.change_state("expression");
            name = parser.generate_next_node();
        } else {
            parser.throw_unexpected_token();
        }

        node.name  = name;
        node.start = name.start;
        node.end   = name.end;

        parser.change_state = property_assign;
    }
};
