/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-24
* Updated at  : 2019-09-01
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

const { STATEMENT }       = require("../enums/precedence_enum");
const { get_pre_comment } = require("../../helpers");
const {
    statement,
    var_statement,
} = require("../enums/states_enum");

const var_keyword = {
    id         : "Var keyword",
    type       : "Terminal symbol token",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === statement,
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;

        parser.current_state = var_statement;
    }
};

module.exports = ast_node_table => {
    [
        "variable",
        "expression",
    ].forEach(path => {
        const node_def = require(`./${ path }_statement`);
        ast_node_table.register_node_definition(node_def);
    });

    const for_stmt = require("./for_statement");
    ast_node_table.register_reserved_word("for", for_stmt);
    ast_node_table.register_reserved_word("var", var_keyword);
};
