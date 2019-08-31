/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration_specs.js
* Created at  : 2017-08-18
* Updated at  : 2019-08-06
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const expect          = require("expect.js");
const parser          = require("../parser");
const test_substring  = require("../../helpers/test_substring");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Function declaration >", () => {
    const valid_test_cases = [
        {
            code   : "function name () {}",
            source : "function name () {}",
            pre_comment : comment => {
                expect(comment).to.be(null);
            },
            name : name => {
                expect(name.id).to.be("Identifier");
            },
            parameters : node => {
                expect(node.id).to.be("Parameters");
                expect(node.type).to.be("Notation");

                expect(node.open_parenthesis.pre_comment).to.be(null);
                expect(node.close_parenthesis.pre_comment).to.be(null);

                expect(node.parameters.length).to.be(0);
            }
        },

        {
            code   : "function name (a,b,c) {}",
            source : "function name (a,b,c) {}",
            pre_comment : comment => {
                expect(comment).to.be(null);
            },
            name : name => {
                expect(name.id).to.be("Identifier");
            },
            parameters : node => {
                expect(node.id).to.be("Parameters");
                expect(node.type).to.be("Notation");

                expect(node.open_parenthesis.pre_comment).to.be(null);
                expect(node.close_parenthesis.pre_comment).to.be(null);

                expect(node.parameters.length).to.be(3);

                expect(node.parameters[0].id).to.be("Parameter");
                expect(node.parameters[0].identifier.id).to.be("Identifier");
                expect(node.parameters[0].identifier.value).to.be("a");

                expect(node.parameters[1].id).to.be("Parameter");
                expect(node.parameters[1].identifier.id).to.be("Identifier");
                expect(node.parameters[1].identifier.value).to.be("b");

                expect(node.parameters[2].id).to.be("Parameter");
                expect(node.parameters[2].identifier.id).to.be("Identifier");
                expect(node.parameters[2].identifier.value).to.be("c");
            }
        },
    ];

    describe("Valid cases >", () => {
        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const streamer = parser.tokenizer.streamer;
                let node;
                try {
                    node = parser.generate_next_node();
                } catch (e) {}

                it("should be Function declaration", () => {
                    expect(node.id).to.be("Function declaration");
                    expect(node.type).to.be("Declaration");
                    expect(node.precedence).to.be(precedence_enum.STATEMENT);
                });

                it("should be has correct keyword", () => {
                    expect(node.keyword.id).to.be("Keyword");
                    expect(node.keyword.precedence).to.be(-1);
                    test_substring("function", streamer, node.keyword);
                });

                it("should be has correct parameters", () => {
                    test_case.parameters(node.parameters, streamer);
                });

                it(`cursor index should be move ${ test_case.code.length } characters to right`, () => {
                    const last_index = test_case.code.length - 1;
                    expect(streamer.get_current_character()).to.be(
                        test_case.source.charAt(last_index)
                    );
                    expect(streamer.cursor.position.index).to.be(last_index);
                });

                it(`should be in correct range`, () => {
                    expect(streamer.substring_from_token(node)).to.be(
                        test_case.code
                    );
                });
            });
        });
    });
});
