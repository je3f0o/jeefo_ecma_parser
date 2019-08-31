/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : string_literal_specs.js
* Created at  : 2019-02-25
* Updated at  : 2019-08-05
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
const test_source     = require("../../helpers/test_source");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("String literal >", () => {
    const test_cases = [
        {
            source : "'abc'",
            quote  : "'"
        },
        {
            source : '"abc"',
            quote  : '"'
        },
    ];

    test_cases.forEach(test_case => {
        test_source(test_case.source, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state("expression");

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.generate_next_node();
            } catch (e) {}

            it(`cursor index should be move ${ test_case.source.length } characters to right`, () => {
                expect(streamer.get_current_character()).to.be(test_case.quote);
                expect(streamer.cursor.position.index).to.be(test_case.source.length - 1);
            });

            it(`should be in correct range`, () => {
                expect(streamer.substring_from_token(node)).to.be(test_case.source);
            });

            it("should be String literal", () => {
                expect(node.id).to.be("String literal");
                expect(node.value).to.be("abc");
                expect(node.quote).to.be(test_case.quote);
            });

            it("should be Primitive", () => {
                expect(node.type).to.be("Primitive");
                expect(node.precedence).to.be(precedence_enum.PRIMITIVE);
            });
        });
    });
});
