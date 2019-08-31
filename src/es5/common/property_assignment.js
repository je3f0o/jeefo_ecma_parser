/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_assignment.js
* Created at  : 2019-08-28
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

const { property_assign }        = require("../enums/states_enum");
const { terminal_definition }    = require("../../common");
const { COMMA, PROPERTY_ASSIGN } = require("../enums/precedence_enum");
const {
    is_colon,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Property assignment",
    type       : "Expression",
    precedence : PROPERTY_ASSIGN,

    is         : (_, parser) => parser.current_state === property_assign,
    initialize : (node, token, parser) => {
        const property_name = get_last_non_comment_node(parser);

        parser.expect(':', is_colon);
        const delimiter = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        const expression = parser.parse_next_node(COMMA);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.property_name = property_name;
        node.delimiter     = delimiter;
        node.expression    = expression;
        node.start         = property_name.start;
        node.end           = expression.end;
    }
};
