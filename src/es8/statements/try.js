/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-08
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.14
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {STATEMENT}           = require("../enums/precedence_enum");
const {statement}           = require("../enums/states_enum");
const {is_identifier_token} = require("../../helpers");

module.exports = {
    id         : "Try statement",
    type       : "The try statement",
    precedence : STATEMENT,
    is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        parser.expect("try", is_identifier_token(token, "try"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("block_statement", true);
        const block = parser.generate_next_node();

        let _catch   = null;
        let _finally = null;
        parser.prepare_next_state("try_statement", true);
        const {id} = parser.next_node_definition || {};
        switch (id) {
            case "Catch" :
                _catch = parser.generate_next_node();
                const next_token = parser.look_ahead();
                if (next_token && is_identifier_token(next_token, "finally")) {
                    parser.prepare_next_state("try_statement", true);
                    _finally = parser.generate_next_node();
                }
                break;
            case "Finally" :
                _finally = parser.generate_next_node();
                break;
            default:
                parser.throw_unexpected_token("catch or finally after try");
        }

        node.keyword = keyword;
        node.block   = block;
        node.catch   = _catch;
        node.finally = _finally;
        node.start   = keyword.start;
        node.end     = (_finally || _catch).end;

        parser.terminate(node);
    }
};
