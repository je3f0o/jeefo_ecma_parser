/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : continue_statement_specs.js
* Created at  : 2019-03-01
* Updated at  : 2019-03-31
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
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception"),
	  parser                   = require("../../../src/es5/parser"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("Continue statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // {{{1 continue;
            {
                code   : "continue;",
                source : "continue;",
                asi    : false,
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                post_comment : comment => {
                    expect(comment).to.be(null);
                },
                identifier : identifier => {
                    expect(identifier).to.be(null);
                }
            },

            // {{{1 continue id;
            {
                code   : "continue id;",
                source : "continue id;",
                asi    : false,
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                post_comment : comment => {
                    expect(comment).to.be(null);
                },
                identifier : identifier => {
                    expect(identifier).not.to.be(null);
                    expect(identifier.id).to.be("Identifier");
                }
            },

            // {{{1 continue /* comment */ \n id;
            {
                code   : "continue",
                source : "continue \n id;",
                asi    : true,
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                post_comment : comment => {
                    expect(comment).to.be(null);
                },
                identifier : identifier => {
                    expect(identifier).to.be(null);
                }
            },

            // {{{1 /* pre comment */ continue /* id comment */ id /* post comment */;
            {
                code   : "/* pre comment */ continue /* id comment */ id /* post comment */;",
                source : "/* pre comment */ continue /* id comment */ id /* post comment */;",
                asi    : false,
                pre_comment : (comment, streamer) => {
                    expect(comment).not.to.be(null);
                    expect(streamer.substring_from_token(comment)).to.be("/* pre comment */");
                },
                post_comment : (comment, streamer) => {
                    expect(comment).not.to.be(null);
                    expect(streamer.substring_from_token(comment)).to.be("/* post comment */");
                },
                identifier : (identifier, streamer) => {
                    expect(identifier).not.to.be(null);
                    expect(identifier.id).to.be("Identifier");
                    expect(identifier.pre_comment).not.to.be(null);
                    expect(streamer.substring_from_token(identifier.pre_comment)).to.be("/* id comment */");
                }
            },
            // }}}1
        ];

        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const streamer = parser.tokenizer.streamer;
                let symbol;
                try {
                    symbol = parser.next_symbol_definition.generate_new_symbol(parser);
                } catch (e) {}

                it("should be Continue statement", () => {
                    expect(symbol.id).to.be("Continue statement");
                });

                it("should be has correct pre_comment", () => {
                    test_case.pre_comment(symbol.pre_comment, streamer);
                });

                it("should be has correct post_comment", () => {
                    test_case.post_comment(symbol.post_comment, streamer);
                });

                it("should be has correct identifier", () => {
                    test_case.identifier(symbol.identifier, streamer);
                });

                it("should be right ASI", () => {
                    expect(symbol.ASI).to.be(test_case.asi);
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

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // {{{1 continue
            {
                source : "continue",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 continue 1
            {
                source : "continue 1",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be has token value: 1", () => {
                        expect(error.token.value).to.be("1");
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
