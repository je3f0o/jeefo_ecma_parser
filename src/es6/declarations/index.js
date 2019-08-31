/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-08-22
* Updated at  : 2019-08-29
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

const { TERMINAL_TOKEN }           = require("../enums/precedence_enum");
const { get_pre_comment }          = require("../../helpers");
const { statement, var_statement } = require("../enums/states_enum");

const let_or_const = {
    id         : "Let or const keyword",
    type       : "Token",
    precedence : TERMINAL_TOKEN,

    is         : (token, parser) => parser.current_state === statement,
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;

        parser.current_state = var_statement;
        parser.prepare_next_node_definition(true);
    }
};

module.exports = ast_node_table => {
    [
        "lexical_declaration",
        "generator_declaration",
    ].forEach(path => {
        ast_node_table.register_node_definition(require(`./${ path }`));
    });

    [
        "class",
        "function",
    ].forEach(reserved_word => {
        const node_def = require(`./${ reserved_word }_declaration`);
        ast_node_table.register_reserved_word(reserved_word, node_def);
    });

    ast_node_table.register_reserved_words(["let", "const"], let_or_const);
};
