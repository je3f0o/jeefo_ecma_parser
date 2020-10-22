/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ignore_comments.js
* Created at  : 2019-01-27
* Updated at  : 2020-09-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

module.exports = parser => {
	while (parser.next_token && parser.next_token.id === "Comment") {
        if (! parser. next_node_definition) {
            parser.log(parser.next_token);
            debugger
        }
        parser.set_prev_node(parser.generate_next_node());
        parser.prepare_next_node_definition();
	}
};
