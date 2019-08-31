/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ignore_comments.js
* Created at  : 2019-01-27
* Updated at  : 2019-08-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition } = require("@jeefo/parser");
const { COMMENT }             = require("../enums/precedence_enum");

const comment = new AST_Node_Definition({
    id         : "Comment",
    type       : "Primitive",
    precedence : COMMENT,

    is         : () => {},
    initialize : (node, token, parser) => {
        let previous_comment = null;
        if (parser.prev_node && parser.prev_node.id === "Comment") {
            previous_comment = parser.prev_node;
        }

        node.previous_comment = previous_comment;
        node.value            = token.comment;
        node.is_inline        = token.is_inline;
        node.start            = token.start;
        node.end              = token.end;
    }
});

module.exports = parser => {
	while (parser.next_token) {
        if (parser.next_token.id === "Comment") {
            parser.prev_node = comment.generate_new_node(parser);
            parser.previous_nodes.push(parser.prev_node);

            parser.prepare_next_node_definition();
        } else {
            break;
        }
	}
};
