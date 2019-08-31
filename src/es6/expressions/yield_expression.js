/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : yield_expression.js
* Created at  : 2019-08-23
* Updated at  : 2019-08-23
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

const { expression }          = require("../enums/states_enum");
const { YIELD_EXPRESSION }    = require("../enums/precedence_enum");
const { terminal_definition } = require("../../common");
const {
    is_asterisk,
    parse_asignment_expression
} = require("../../helpers");

module.exports = {
    id         : "Yield expression",
    type       : "Expression",
    precedence : YIELD_EXPRESSION,

    is         : (token, parser) => parser.current_state === expression,
    initialize : (node, token, parser) => {
        let asterisk  = null;
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_node_definition(true);
        if (is_asterisk(parser.next_token)) {
            asterisk = terminal_definition.generate_new_node(parser);
            parser.prepare_next_node_definition(true);
        }
        const expression = parse_asignment_expression(parser);

        node.keyword    = keyword;
        node.asterisk   = asterisk;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;
    }
};
