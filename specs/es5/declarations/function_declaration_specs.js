/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration_specs.js
* Created at  : 2017-08-18
* Updated at  : 2019-03-05
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect = require("expect.js"),
	  parser = require("../../../src/es5_parser");

describe("Function declaration >", () => {
    const valid_test_cases = [
        // {{{1 function name () {}
        {
            code   : "function name () {}",
            source : "function name () {}",
            pre_comment : comment => {
                expect(comment).to.be(null);
            },
            name : name => {
                expect(name.id).to.be("Identifier");
            },
            parameters : symbol => {
                expect(symbol.id).to.be("Parameters");
                expect(symbol.type).to.be("Notation");

                expect(symbol.open_parenthesis.pre_comment).to.be(null);
                expect(symbol.close_parenthesis.pre_comment).to.be(null);

                expect(symbol.parameters.length).to.be(0);
            }
        },

        // {{{1 function name (a,b,c) {}
        {
            code   : "function name (a,b,c) {}",
            source : "function name (a,b,c) {}",
            pre_comment : comment => {
                expect(comment).to.be(null);
            },
            name : name => {
                expect(name.id).to.be("Identifier");
            },
            parameters : symbol => {
                expect(symbol.id).to.be("Parameters");
                expect(symbol.type).to.be("Notation");

                expect(symbol.open_parenthesis.pre_comment).to.be(null);
                expect(symbol.close_parenthesis.pre_comment).to.be(null);

                expect(symbol.parameters.length).to.be(3);

                expect(symbol.parameters[0].id).to.be("Parameter");
                expect(symbol.parameters[0].identifier.id).to.be("Identifier");
                expect(symbol.parameters[0].identifier.token.value).to.be("a");

                expect(symbol.parameters[1].id).to.be("Parameter");
                expect(symbol.parameters[1].identifier.id).to.be("Identifier");
                expect(symbol.parameters[1].identifier.token.value).to.be("b");

                expect(symbol.parameters[2].id).to.be("Parameter");
                expect(symbol.parameters[2].identifier.id).to.be("Identifier");
                expect(symbol.parameters[2].identifier.token.value).to.be("c");
            }
        },
        // }}}1
    ];

    describe("Valid cases >", () => {
        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const streamer = parser.tokenizer.streamer;
                let symbol;
                try {
                    symbol = parser.next_symbol_definition.generate_new_symbol(parser);
                } catch (e) {}

                it("should be Function declaration", () => {
                    expect(symbol.id).to.be("Function declaration");
                });

                it("should be has correct pre_comment", () => {
                    test_case.pre_comment(symbol.pre_comment, streamer);
                });

                it("should be has correct parameters", () => {
                    test_case.parameters(symbol.parameters, streamer);
                });

                it(`cursor index should be move ${ test_case.code.length } characters to right`, () => {
                    const last_index = test_case.code.length - 1;
                    expect(streamer.get_current_character()).to.be(test_case.source.charAt(last_index));
                    expect(streamer.cursor.index).to.be(last_index);
                });

                it(`should be in correct range`, () => {
                    expect(streamer.substring_from_token(symbol)).to.be(test_case.code);
                });
            });
        });
    });
});
