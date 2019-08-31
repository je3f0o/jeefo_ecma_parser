/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_of_statement.js
* Created at  : 2019-08-24
* Updated at  : 2019-08-24
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

const { for_of }                 = require("../enums/states_enum");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For of statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === for_of,
    initialize : (node, token, parser) => {
        const { keyword, expression } = parser.prev_node;

        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        node.keyword    = keyword;
        node.expression = expression;
        node.statement  = statement;
        node.start      = keyword.start;
        node.end        = statement.end;
    }
};
