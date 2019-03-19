/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_list_specs.js
* Created at  : 2019-03-18
* Updated at  : 2019-03-19
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

const expect                   = require("expect.js"),
      parser                   = require("../../../src/es5_parser.js"),
      test_substring           = require("../../helpers/test_substring"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum"),
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");

describe("Variable declaration list >", () => {
    const test = test_cases => {
        test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const symbol   = parser.next_symbol_definition.generate_new_symbol(parser);
                const streamer = parser.tokenizer.streamer;

                it("should be Variable declaration list", () => {
                    expect(symbol.id).to.be("Variable declaration list");
                    expect(symbol.type).to.be("Statement");
                    expect(symbol.precedence).to.be(31);
                });

                it("should be in correct range", () => {
                    const last_index = test_case.code.length - 1;

                    expect(streamer.substring_from_token(symbol)).to.be(test_case.code);
                    expect(streamer.get_current_character()).to.be(test_case.source.charAt(last_index));
                    expect(streamer.cursor.index).to.be(last_index);
                });

                it("should be expected declaration list", () => {
                    test_case.list(symbol.list, streamer);
                });
            });
        });
    };

    describe("Semicolon terminated >", () => {
        const test_cases = [
            {
                code   : "var a;",
                source : "var a;",
                list   : (list, streamer) => {
                    expect(list.length).to.be(1);
                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("a");
                    test_substring("a", streamer, list[0]);
                },
                current_character : ';',
            },
            {
                code   : "var a, b,c;",
                source : "var a, b,c;",
                list : (list, streamer) => {
                    expect(list.length).to.be(3);

                    "abc".split('').forEach((character, index) => {
                        expect(list[index].id).to.be("Variable declarator");
                        expect(list[index].identifier.id).to.be("Identifier");
                        expect(list[index].identifier.token.value).to.be(character);
                        test_substring(character, streamer, list[index]);
                    });
                },
                current_character : ';',
            },
            {
                code   : "var a /*post comment 1*/\n,\n pi /*pre comment*/ = /*c*/ 3.14 /*post comment 2*/\n;",
                source : "var a /*post comment 1*/\n,\n pi /*pre comment*/ = /*c*/ 3.14 /*post comment 2*/\n;",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);

                    // declarator 0
                    expect(list[0].id).to.be("Variable declarator");

                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("a");
                    expect(list[0].operator).to.be(null);
                    expect(list[0].post_comment).not.to.be(null);

                    test_substring("/*post comment 1*/", streamer, list[0].post_comment);
                    test_substring("a /*post comment 1*/", streamer, list[0]);

                    // declarator 1
                    expect(list[1].id).to.be("Variable declarator");
                    expect(list[1].identifier.id).to.be("Identifier");
                    expect(list[1].identifier.token.value).to.be("pi");

                    expect(list[1].initializer.id).to.be("Numeric literal");
                    expect(list[1].initializer.token.value).to.be("3.14");

                    test_substring("/*c*/", streamer, list[1].initializer.pre_comment);

                    expect(list[1].operator).not.to.be(null);
                    expect(list[1].operator.id).to.be("Operator");
                    expect(list[1].operator.type).to.be("Operator");
                    expect(list[1].operator.token).not.to.be(null);
                    expect(list[1].operator.token.value).to.be("=");
                    test_substring("/*pre comment*/", streamer, list[1].operator.pre_comment);
                    test_substring("/*pre comment*/ =", streamer, list[1].operator);

                    test_substring("/*post comment 2*/", streamer, list[1].post_comment);

                    test_substring("pi /*pre comment*/ = /*c*/ 3.14 /*post comment 2*/", streamer, list[1]);
                },
                current_character : ';',
            },
        ];

        test(test_cases);
    });

    describe("Automatic semicolon insertion >", () => {
        const test_cases = [
            {
                code   : "var something",
                source : "var something",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("something");
                    expect(streamer.substring_from_token(list[0])).to.be("something");
                },
                current_character : 'g',
            },
            {
                code   : "var terminated",
                source : "var terminated\nb = 2",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("terminated");
                    expect(streamer.substring_from_token(list[0])).to.be("terminated");
                },
                current_character : 'd',
            },
            {
                code   : "var\nterminated",
                source : "var\nterminated\nb = 2",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("terminated");
                    expect(streamer.substring_from_token(list[0])).to.be("terminated");
                },
                current_character : 'd',
            },
            {
                code   : "var pi = 3.14\n, terminated",
                source : "var pi = 3.14\n, terminated\nb=2;",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);

                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("pi");
                    expect(list[0].initializer.id).to.be("Numeric literal");
                    expect(list[0].initializer.token.value).to.be("3.14");
                    test_substring("pi = 3.14", streamer, list[0]);

                    expect(list[1].id).to.be("Variable declarator");
                    expect(list[1].identifier.id).to.be("Identifier");
                    expect(list[1].identifier.token.value).to.be("terminated");
                    test_substring("terminated", streamer, list[1]);
                },
                current_character : 'd',
            },
            {
                code   : "var pi = 3.14",
                source : "var pi = 3.14\n terminated",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("pi");
                    expect(list[0].initializer.id).to.be("Numeric literal");
                    expect(list[0].initializer.token.value).to.be("3.14");
                    test_substring("pi = 3.14", streamer, list[0]);
                },
                current_character : '4',
            },
            {
                code   : "var /*a0*/ /*a1*/ pi /*b0*/ /*b1*/ = /*c0*/ /*c1*/ 3.14",
                source : "var /*a0*/ /*a1*/ pi /*b0*/ /*b1*/ = /*c0*/ /*c1*/ 3.14",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);

                    expect(list[0].id).to.be("Variable declarator");

                    // Identifier
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("pi");
                    test_substring("/*a1*/", streamer, list[0].identifier.pre_comment);
                    test_substring("/*a0*/", streamer, list[0].identifier.pre_comment.previous_comment);

                    // Pre comment
                    test_substring("/*b1*/", streamer, list[0].operator.pre_comment);
                    test_substring("/*b0*/", streamer, list[0].operator.pre_comment.previous_comment);
                    test_substring("/*b0*/ /*b1*/ =", streamer, list[0].operator);

                    // Post comment
                    expect(list[0].post_comment).to.be(null);

                    // Init
                    expect(list[0].initializer.id).to.be("Numeric literal");
                    expect(list[0].initializer.token.value).to.be("3.14");
                    test_substring("/*c1*/", streamer, list[0].initializer.pre_comment);
                    test_substring("/*c0*/", streamer, list[0].initializer.pre_comment.previous_comment);

                    test_substring("/*a0*/ /*a1*/ pi /*b0*/ /*b1*/ = /*c0*/ /*c1*/ 3.14", streamer, list[0]);
                },
                current_character : '4',
            },
            {
                code   : "var a /*post comment 1*/, pi /*pre comment*/ = /*c*/ 3.14",
                source : "var a /*post comment 1*/, pi /*pre comment*/ = /*c*/ 3.14 /*comment doesn't matter*/",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);

                    // declarator 0
                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.token.value).to.be("a");
                    expect(list[0].operator).to.be(null);
                    test_substring("/*post comment 1*/", streamer, list[0].post_comment);
                    test_substring("a /*post comment 1*/", streamer, list[0]);

                    // declarator 1
                    expect(list[1].id).to.be("Variable declarator");
                    expect(list[1].identifier.id).to.be("Identifier");
                    expect(list[1].identifier.token.value).to.be("pi");
                    expect(list[1].initializer.id).to.be("Numeric literal");
                    expect(list[1].initializer.token.value).to.be("3.14");
                    test_substring("/*c*/", streamer, list[1].initializer.pre_comment);

                    expect(list[1].operator).not.to.be(null);
                    test_substring("/*pre comment*/", streamer, list[1].operator.pre_comment);
                    test_substring("/*pre comment*/ =", streamer, list[1].operator);

                    expect(list[1].post_comment).to.be(null);

                    test_substring("pi /*pre comment*/ = /*c*/ 3.14", streamer, list[1]);
                },
                current_character : '4',
            },
        ];

        test(test_cases);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // {{{1 var
            {
                source : "var",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 var a a
            {
                source : "var a a",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 var a =
            {
                source : "var a =",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 var a,
            {
                source : "var a,",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 var 3
            {
                source : "var 3",
                error : error => {
                    it("should be throw: Expected identifier instead saw: 3", () => {
                        expect(error.message).to.be("Expected identifier instead saw: 3");
                    });

                    it("should be has token value: 3", () => {
                        expect(error.token.value).to.be("3");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 var a, ,
            {
                source : "var a, ,",
                error : error => {
                    it("should be throw: Expected identifier instead saw: ,", () => {
                        expect(error.message).to.be("Expected identifier instead saw: ,");
                    });

                    it("should be has token value: ,", () => {
                        expect(error.token.value).to.be(",");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },
            // }}}1
        ];

        error_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                try {
                    parser.get_next_symbol(precedence_enum.TERMINATION);
                    expect("throw").to.be("failed");
                } catch (e) {
                    test_case.error(e);
                }
            });
        });
    });
});
