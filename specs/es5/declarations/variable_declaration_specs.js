/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_specs.js
* Created at  : 2019-02-09
* Updated at  : 2019-03-11
* Author      : jeefo
* Purpose     : Easier to develop. Please make me happy :)
* Description : Describe what Variable declaration and unit test every single 
*             : case. Make sure it is working correctly.
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect                   = require("expect.js"),
      parser                   = require("../../../src/es5_parser.js"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum"),
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");

describe("Variable declaration >", () => {
    const test = test_cases => {
        test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const symbol   = parser.next_symbol_definition.generate_new_symbol(parser);
                const streamer = parser.tokenizer.streamer;

                it(`should be Variable declaration`, () => {
                    expect(symbol.id).to.be("Variable declaration");
                    expect(symbol.type).to.be("Declaration");
                    expect(symbol.precedence).to.be(31);
                });

                it("should be in exact range", () => {
                    expect(streamer.substring_from_token(symbol)).to.be(test_case.code);
                    expect(streamer.get_current_character()).to.be(test_case.current_character);
                    expect(streamer.cursor.index).to.be(test_case.code.length - 1);
                });

                it("should be expected declarations", () => {
                    test_case.declarations(symbol.declarations, streamer);
                });
            });
        });
    };

    describe("Semicolon terminated >", () => {
        const test_cases = [
            {
                code   : "var a;",
                source : "var a;",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(1);
                    expect(declarations[0].id).to.be("Variable declarator");
                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("a");
                    expect(streamer.substring_from_token(declarations[0])).to.be("a");
                },
                current_character : ';',
            },
            {
                code   : "var a, b,c;",
                source : "var a, b,c;",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(3);

                    "abc".split('').forEach((character, index) => {
                        expect(declarations[index].id).to.be("Variable declarator");
                        expect(declarations[index].identifier.id).to.be("Identifier");
                        expect(declarations[index].identifier.token.value).to.be(character);
                        expect(streamer.substring_from_token(declarations[index])).to.be(character);
                    });
                },
                current_character : ';',
            },
            {
                code   : "var a /*post comment 1*/\n,\n pi /*pre comment*/ = /*c*/ 3.14 /*post comment 2*/\n;",
                source : "var a /*post comment 1*/\n,\n pi /*pre comment*/ = /*c*/ 3.14 /*post comment 2*/\n;",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(2);

                    // declarator 0
                    expect(declarations[0].id).to.be("Variable declarator");

                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("a");
                    expect(declarations[0].pre_comment).to.be(null);
                    expect(declarations[0].post_comment).not.to.be(null);
                    expect(streamer.substring_from_token(declarations[0].post_comment)).to.be("/*post comment 1*/");

                    expect(streamer.substring_from_token(declarations[0])).to.be("a /*post comment 1*/");

                    // declarator 1
                    expect(declarations[1].id).to.be("Variable declarator");
                    expect(declarations[1].identifier.id).to.be("Identifier");
                    expect(declarations[1].identifier.token.value).to.be("pi");

                    expect(declarations[1].init.id).to.be("Numeric literal");
                    expect(declarations[1].init.token.value).to.be("3.14");
                    expect(streamer.substring_from_token(declarations[1].init.pre_comment)).to.be("/*c*/");

                    expect(streamer.substring_from_token(declarations[1].pre_comment)).to.be("/*pre comment*/");
                    expect(streamer.substring_from_token(declarations[1].post_comment)).to.be("/*post comment 2*/");

                    expect(streamer.substring_from_token(declarations[1])).to.be("pi /*pre comment*/ = /*c*/ 3.14 /*post comment 2*/");
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
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(1);
                    expect(declarations[0].id).to.be("Variable declarator");
                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("something");
                    expect(streamer.substring_from_token(declarations[0])).to.be("something");
                },
                current_character : 'g',
            },
            {
                code   : "var terminated",
                source : "var terminated\nb = 2",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(1);
                    expect(declarations[0].id).to.be("Variable declarator");
                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("terminated");
                    expect(streamer.substring_from_token(declarations[0])).to.be("terminated");
                },
                current_character : 'd',
            },
            {
                code   : "var\nterminated",
                source : "var\nterminated\nb = 2",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(1);
                    expect(declarations[0].id).to.be("Variable declarator");
                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("terminated");
                    expect(streamer.substring_from_token(declarations[0])).to.be("terminated");
                },
                current_character : 'd',
            },
            {
                code   : "var pi = 3.14\n, terminated",
                source : "var pi = 3.14\n, terminated\nb=2;",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(2);

                    expect(declarations[0].id).to.be("Variable declarator");
                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("pi");
                    expect(declarations[0].init.id).to.be("Numeric literal");
                    expect(declarations[0].init.token.value).to.be("3.14");
                    expect(streamer.substring_from_token(declarations[0])).to.be("pi = 3.14");

                    expect(declarations[1].id).to.be("Variable declarator");
                    expect(declarations[1].identifier.id).to.be("Identifier");
                    expect(declarations[1].identifier.token.value).to.be("terminated");
                    expect(streamer.substring_from_token(declarations[1])).to.be("terminated");
                },
                current_character : 'd',
            },
            {
                code   : "var pi = 3.14",
                source : "var pi = 3.14\n terminated",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(1);

                    expect(declarations[0].id).to.be("Variable declarator");
                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("pi");
                    expect(declarations[0].init.id).to.be("Numeric literal");
                    expect(declarations[0].init.token.value).to.be("3.14");
                    expect(streamer.substring_from_token(declarations[0])).to.be("pi = 3.14");
                },
                current_character : '4',
            },
            {
                code   : "var /*a0*/ /*a1*/ pi /*b0*/ /*b1*/ = /*c0*/ /*c1*/ 3.14",
                source : "var /*a0*/ /*a1*/ pi /*b0*/ /*b1*/ = /*c0*/ /*c1*/ 3.14",
                declarations : (declarations, streamer) => {
                    expect(declarations.length).to.be(1);

                    expect(declarations[0].id).to.be("Variable declarator");

                    // Identifier
                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("pi");
                    expect(streamer.substring_from_token(declarations[0].identifier.pre_comment)).to.be("/*a1*/");
                    expect(streamer.substring_from_token(declarations[0].identifier.pre_comment.previous_comment)).to.be("/*a0*/");

                    // Pre comment
                    expect(streamer.substring_from_token(declarations[0].pre_comment)).to.be("/*b1*/");
                    expect(streamer.substring_from_token(declarations[0].pre_comment.previous_comment)).to.be("/*b0*/");
                    
                    // Post comment
                    expect(declarations[0].post_comment).to.be(null);
                    
                    // Init
                    expect(declarations[0].init.id).to.be("Numeric literal");
                    expect(declarations[0].init.token.value).to.be("3.14");
                    expect(streamer.substring_from_token(declarations[0].init.pre_comment)).to.be("/*c1*/");
                    expect(streamer.substring_from_token(declarations[0].init.pre_comment.previous_comment)).to.be("/*c0*/");

                    expect(streamer.substring_from_token(declarations[0])).to.be("/*a0*/ /*a1*/ pi /*b0*/ /*b1*/ = /*c0*/ /*c1*/ 3.14");
                },
                current_character : '4',
            },
            {
                code   : "var a /*post comment 1*/, pi /*pre comment*/ = /*c*/ 3.14",
                source : "var a /*post comment 1*/, pi /*pre comment*/ = /*c*/ 3.14 /*comment doesn't matter*/",
                declarations : function (declarations, streamer) {
                    expect(declarations.length).to.be(2);

                    // declarator 0
                    expect(declarations[0].id).to.be("Variable declarator");

                    expect(declarations[0].identifier.id).to.be("Identifier");
                    expect(declarations[0].identifier.token.value).to.be("a");
                    expect(declarations[0].pre_comment).to.be(null);
                    expect(streamer.substring_from_token(declarations[0].post_comment)).to.be("/*post comment 1*/");

                    expect(streamer.substring_from_token(declarations[0])).to.be("a /*post comment 1*/");

                    // declarator 1
                    expect(declarations[1].id).to.be("Variable declarator");
                    expect(declarations[1].identifier.id).to.be("Identifier");
                    expect(declarations[1].identifier.token.value).to.be("pi");

                    expect(declarations[1].init.id).to.be("Numeric literal");
                    expect(declarations[1].init.token.value).to.be("3.14");
                    expect(streamer.substring_from_token(declarations[1].init.pre_comment)).to.be("/*c*/");

                    expect(streamer.substring_from_token(declarations[1].pre_comment)).to.be("/*pre comment*/");
                    expect(declarations[1].post_comment).to.be(null);

                    expect(streamer.substring_from_token(declarations[1])).to.be("pi /*pre comment*/ = /*c*/ 3.14");
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
