/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : empty_statement_specs.js
* Created at  : 2019-04-02
* Updated at  : 2019-08-08
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

const expect          = require("expect.js");
const parser          = require("../parser.js");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

const {
    test_range,
    test_for_each,
    test_statement,
    test_substring,
} = require("../../helpers");

describe("Empty statement >", () => {
    const valid_test_cases = [
        // ;
        {
            code   : ";",
            source : ";",

            pre_comment : node => {
                expect(node).to.be(null);
            },
        },

        // // comment\n ;
        {
            code   : ";",
            source : "// comment\n ;",
            offset : "// comment\n ".length,

            pre_comment : (node, streamer) => {
                expect(node).not.to.be(null);
                test_substring("// comment\n", streamer, node);
            },
        },

        // /* comment */ ;
        {
            code   : ";",
            source : "/* comment */ ;",
            offset : "/* comment */ ".length,

            pre_comment : (node, streamer) => {
                expect(node).not.to.be(null);
                test_substring("/* comment */", streamer, node);
            },
        },
    ];

    test_for_each(valid_test_cases, test_case => {
        parser.tokenizer.init(test_case.source);
        parser.prepare_next_state();

        const streamer = parser.tokenizer.streamer;
        let node;
        try {
            node = parser.parse_next_node(precedence_enum.TERMINATION);
        } catch (e) {}

        test_statement(node, "Empty");

        it("should be has correct pre_comment", () => {
            test_case.pre_comment(node.pre_comment, streamer);
        });

        it("should be has correct value", () => {
            expect(node.value).to.be(';');
        });

        test_range(test_case, node, streamer);
    });
});
