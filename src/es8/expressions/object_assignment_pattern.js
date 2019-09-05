/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_assignment_pattern.js
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { object_assignment_pattern } = require("../enums/states_enum");

module.exports = {
    id         : "Object assignment pattern",
	type       : "Expression",
	precedence : EXPRESSION,

    is (_, { current_state }) {
        return current_state === object_assignment_pattern;
    },
	initialize (node, token, parser) {
        const {
            delimiters,
            properties,
            open_curly_bracket,
            close_curly_bracket,
        } = parser.prev_node;

        const property_list = properties.map(property => {
            console.log(property);
            process.exit();
        });

        node.open_curly_bracket  = open_curly_bracket;
        node.property_list       = property_list;
        node.delimiters          = delimiters;
        node.close_curly_bracket = close_curly_bracket;
        node.start               = open_curly_bracket.start;
        node.end                 = close_curly_bracket.end;
    },
};
