/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ignore_comments.js
* Created at  : 2019-01-27
* Updated at  : 2019-09-03
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
	while (parser.next_token) {
        if (parser.next_token.id === "Comment") {
            parser.pre_comment = parser.generate_next_node();
            parser.prepare_next_node_definition();
        } else {
            break;
        }
	}
};
