/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_formal_parameters.js
* Created at  : 2019-09-04
* Updated at  : 2019-09-07
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

const { EXPRESSION }              = require("../enums/precedence_enum");
const { arrow_formal_parameters } = require("../enums/states_enum");

module.exports = {
    id         : "Arrow formal parameters",
	type       : "Expression",
	precedence : EXPRESSION,

    is     : (_, { current_state : s }) => s === arrow_formal_parameters,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },
	refine : (node, expression, parser) => {
        let open, list, delimiters, close;
        switch (expression.id) {
            case "Arguments" :
                list = expression.list;
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        ({
            delimiters,
            open_parenthesis  : open,
            close_parenthesis : close,
        } = expression);

        list = list.map(item => {
            return parser.refine("formal_parameter", item);
        });

        node.open_parenthesis  = open;
        node.list              = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    },
};
