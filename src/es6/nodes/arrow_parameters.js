/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_parameters.js
* Created at  : 2019-08-27
* Updated at  : 2019-08-27
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

const { AST_Node_Definition } = require("@jeefo/parser");

module.exports = new AST_Node_Definition({
    id         : "Arrow parameters",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        let list              = [];
        let delimiters        = [];
        let open_parenthesis  = null;
        let close_parenthesis = null;

        if (parser.prev_node.id === "Identifier") {
            list.push(parser.prev_node);
        } else {
            ({
                list,
                delimiters,
                open_parenthesis,
                close_parenthesis
            } = parser.prev_node);
        }

        const end = (close_parenthesis || list[list.length - 1]).end;

        node.open_parenthesis  = open_parenthesis;
        node.list              = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close_parenthesis;
        node.start             = (open_parenthesis  || list[0]).start;
        node.end               = end;
    }
});
