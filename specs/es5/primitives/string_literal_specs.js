/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : string_literal_specs.js
* Created at  : 2019-02-25
* Updated at  : 2019-02-25
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect = require("expect.js"),
      parser = require("../../../src/es5_parser.js");

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
        describe(`Test against source text '${ test_case.source }'`, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state("expression");

            const symbol   = parser.next_symbol_definition.generate_new_symbol(parser);
            const streamer = parser.tokenizer.streamer;

            it(`cursor index should be move ${ test_case.source.length } characters to right`, () => {
                expect(streamer.get_current_character()).to.be(test_case.quote);
                expect(streamer.cursor.index).to.be(test_case.source.length - 1);
            });

            it(`should be in correct range`, () => {
                expect(streamer.substring_from_token(symbol)).to.be(test_case.source);
            });

            it("should be String literal", () => {
                expect(symbol.id).to.be("String literal");
                expect(symbol.token.value).to.be("abc");
                expect(symbol.token.quote).to.be(test_case.quote);
            });

            it("should be Primitive", () => {
                expect(symbol.type).to.be("Primitive");
                expect(symbol.precedence).to.be(31);
            });
        });
    });
});
