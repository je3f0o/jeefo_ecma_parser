/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : await_experession.js
* Created at  : 2019-08-22
* Updated at  : 2020-09-08
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

const {expression}       = require("../enums/states_enum");
const {AWAIT_EXPRESSION} = require("../enums/precedence_enum");
const {
    is_identifier_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Await expression",
    type       : "Unary expression",
    precedence : AWAIT_EXPRESSION,

    is: (_, {current_state: s, suffixes}) => (
        s === expression && suffixes.includes("await")
    ),
    /*
    parser.throw_unexpected_token(
        "await is only valid in async function", token
    );
    */

    initialize (node, token, parser) {
        parser.expect("await", is_identifier_token(token, "await"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        parser.parse_next_node(AWAIT_EXPRESSION);
        const expr = get_last_non_comment_node(parser, true);

        node.keyword    = keyword;
        node.expression = expr;
        node.start      = keyword.start;
        node.end        = expr.end;
    }
};
