/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : spread_element.js
* Created at  : 2019-08-26
* Updated at  : 2019-08-26
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

const { AST_Node_Definition }        = require("@jeefo/parser");
const { terminal_definition }        = require("../../common");
const { parse_asignment_expression } = require("../../helpers");

module.exports = new AST_Node_Definition({
    id         : "Spread element",
	type       : "Expression",
	precedence : -1,

    is         : () => {},
	initialize : (node, token, parser) => {
        const ellipsis = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        const expression = parse_asignment_expression(parser);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.ellipsis   = ellipsis;
        node.expression = expression;
        node.start      = ellipsis.start;
        node.end        = expression.end;
    },
});
