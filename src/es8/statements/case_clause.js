/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : case_clause.js
* Created at  : 2020-09-07
* Updated at  : 2020-09-07
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

const {switch_statement}       = require("../enums/states_enum");
const {STRUCTURE, TERMINATION} = require("../enums/precedence_enum");
const {
    is_colon,
    is_identifier_token,
    get_last_non_comment_node,
} = require("../../helpers");

const is_break_point = ({id, value}) =>
    id === "Identifier" && ["case", "default"].includes(value) ||
    id === "Delimiter"  && value === '}';

module.exports = {
    id         : "Case clause",
    type       : "The switch statement",
    precedence : STRUCTURE,
    is         : (token, {current_state: s}) => s === switch_statement,

    initialize (node, token, parser) {
        parser.expect("case", is_identifier_token(token, "case"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        parser.parse_next_node(TERMINATION);
        const expr = get_last_non_comment_node(parser, true);
        parser.end(expr);

        parser.prepare_next_state("punctuator", true);
        parser.expect(':', is_colon);
        const colon = parser.generate_next_node();

        const statements = [];
        do {
            const next_token = parser.look_ahead(true);
            if (is_break_point(next_token)) break;
            parser.prepare_next_state("statement", true);
            parser.parse_next_node(TERMINATION);
            statements.push(get_last_non_comment_node(parser, true));
        } while (true);

        node.keyword    = keyword;
        node.expression = expr;
        node.colon      = colon;
        node.statements = statements;
        node.start      = keyword.start;
        node.end        = (statements[statements.length - 1] || colon).end;
    }
};
