/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement_specs.js
* Created at  : 2019-02-21
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
      parser                   = require("../parser.js"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("Try statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // {{{1 try {} catch (e) {}
            {
                source : "try {} catch (e) {}",
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                block : block => {
                    expect(block.id).to.be("Block statement");
                    expect(block.type).to.be("Statement");

                    expect(block.pre_comment).to.be(null);
                },
                handler : (statement, streamer) => {
                    expect(statement.id).to.be("Catch block");
                    expect(statement.type).to.be("Statement");

                    expect(statement.pre_comment).to.be(null);

                    // Parameter
                    expect(statement.parameter.identifier).not.to.be(null);
                    expect(statement.parameter.identifier.id).to.be("Identifier");
                    expect(statement.parameter.identifier.token.value).to.be('e');
                    expect(streamer.substring_from_token(statement.parameter)).to.be("(e)");

                    // open parenthesis
                    expect(statement.parameter.open_parenthesis.pre_comment).to.be(null);
                    expect(streamer.substring_from_token(statement.parameter.open_parenthesis)).to.be("(");

                    // close parenthesis
                    expect(statement.parameter.close_parenthesis.pre_comment).to.be(null);
                    expect(streamer.substring_from_token(statement.parameter.close_parenthesis)).to.be(")");

                    // Block
                    expect(statement.block).not.to.be(null);
                    expect(statement.block.id).to.be("Block statement");
                    expect(streamer.substring_from_token(statement.block)).to.be("{}");

                    expect(streamer.substring_from_token(statement)).to.be("catch (e) {}");
                },
                finalizer : statement => {
                    expect(statement).to.be(null);
                }
            },

            // {{{1 try {} finally {},
            {
                source : "try {} finally {}",
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                block : block => {
                    expect(block.id).to.be("Block statement");
                    expect(block.type).to.be("Statement");

                    expect(block.pre_comment).to.be(null);
                },
                handler : statement => {
                    expect(statement).to.be(null);
                },
                finalizer : (statement, streamer) => {
                    expect(statement.id).to.be("Finally block");
                    expect(statement.type).to.be("Statement");

                    expect(streamer.substring_from_token(statement)).to.be("finally {}");
                }
            },

            // {{{1 try {} catch (e) {} finally {},
            {
                source : "try {} catch (e) {} finally {}",
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                block : block => {
                    expect(block.id).to.be("Block statement");
                    expect(block.type).to.be("Statement");

                    expect(block.pre_comment).to.be(null);
                },
                handler : (statement, streamer) => {
                    expect(statement.id).to.be("Catch block");
                    expect(statement.type).to.be("Statement");

                    expect(statement.pre_comment).to.be(null);

                    // Parameter
                    expect(statement.parameter.identifier).not.to.be(null);
                    expect(statement.parameter.identifier.id).to.be("Identifier");
                    expect(statement.parameter.identifier.token.value).to.be('e');
                    expect(streamer.substring_from_token(statement.parameter)).to.be("(e)");

                    // open parenthesis
                    expect(statement.parameter.open_parenthesis.pre_comment).to.be(null);
                    expect(streamer.substring_from_token(statement.parameter.open_parenthesis)).to.be("(");

                    // close parenthesis
                    expect(statement.parameter.close_parenthesis.pre_comment).to.be(null);
                    expect(streamer.substring_from_token(statement.parameter.close_parenthesis)).to.be(")");

                    // Block
                    expect(statement.block).not.to.be(null);
                    expect(statement.block.id).to.be("Block statement");
                    expect(streamer.substring_from_token(statement.block)).to.be("{}");

                    expect(streamer.substring_from_token(statement)).to.be("catch (e) {}");
                },
                finalizer : (statement, streamer) => {
                    expect(statement.id).to.be("Finally block");
                    expect(statement.type).to.be("Statement");

                    expect(streamer.substring_from_token(statement)).to.be("finally {}");
                }
            },

            // {{{1 /*a*/try/*b*/{}/*c*/catch/*d*/(/*e*/e/*f*/)/*g*/{}/*h*/finally/*i*/{}
            {
                source : "/*a*/try/*b*/{}/*c*/catch/*d*/(/*e*/e/*f*/)/*g*/{}/*h*/finally/*i*/{}",
                pre_comment : (comment, streamer) => {
                    expect(comment).not.to.be(null);
                    expect(streamer.substring_from_token(comment)).to.be("/*a*/");
                },
                block : (block, streamer) => {
                    expect(block.id).to.be("Block statement");
                    expect(block.type).to.be("Statement");

                    expect(block.pre_comment).not.to.be(null);
                    expect(streamer.substring_from_token(block)).to.be("/*b*/{}");
                },
                handler : (statement, streamer) => {
                    expect(statement.id).to.be("Catch block");
                    expect(statement.type).to.be("Statement");

                    expect(statement.pre_comment).not.to.be(null);
                    expect(streamer.substring_from_token(statement.pre_comment)).to.be("/*c*/");

                    // Parameter
                    expect(statement.parameter.identifier).not.to.be(null);

                    expect(statement.parameter.identifier.id).to.be("Identifier");
                    expect(statement.parameter.identifier.token.value).to.be("e");
                    expect(streamer.substring_from_token(statement.parameter.identifier.pre_comment)).to.be("/*e*/");
                    expect(streamer.substring_from_token(statement.parameter.identifier)).to.be("/*e*/e");

                    expect(streamer.substring_from_token(statement.parameter)).to.be("/*d*/(/*e*/e/*f*/)");

                    // open parenthesis
                    expect(streamer.substring_from_token(statement.parameter.open_parenthesis.pre_comment)).to.be("/*d*/");
                    expect(streamer.substring_from_token(statement.parameter.open_parenthesis)).to.be("/*d*/(");

                    // close parenthesis
                    expect(streamer.substring_from_token(statement.parameter.close_parenthesis.pre_comment)).to.be("/*f*/");
                    expect(streamer.substring_from_token(statement.parameter.close_parenthesis)).to.be("/*f*/)");

                    expect(streamer.substring_from_token(statement.parameter.identifier)).to.be("/*e*/e");
                    expect(streamer.substring_from_token(statement.parameter)).to.be("/*d*/(/*e*/e/*f*/)");

                    // Block
                    expect(statement.block).not.to.be(null);
                    expect(statement.block.id).to.be("Block statement");
                    expect(streamer.substring_from_token(statement.block)).to.be("/*g*/{}");

                    expect(streamer.substring_from_token(statement)).to.be("/*c*/catch/*d*/(/*e*/e/*f*/)/*g*/{}");
                },
                finalizer : (statement, streamer) => {
                    expect(statement.id).to.be("Finally block");
                    expect(statement.type).to.be("Statement");

                    expect(streamer.substring_from_token(statement)).to.be("/*h*/finally/*i*/{}");
                }
            }
            // }}}1
        ];

        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const symbol   = parser.get_next_symbol(precedence_enum.TERMINATION);
                const streamer = parser.tokenizer.streamer;

                it("should be Do while statement", () => {
                    expect(symbol.id).to.be("Try statement");
                    expect(symbol.type).to.be("Statement");
                });

                it("should be has correct pre_comment", () => {
                    test_case.pre_comment(symbol.pre_comment, streamer);
                });

                it("should be has correct Block statement", () => {
                    test_case.block(symbol.block, streamer);
                });

                it("should be has correct handler", () => {
                    test_case.handler(symbol.handler, streamer);
                });

                it("should be has correct finalizer", () => {
                    test_case.finalizer(symbol.finalizer, streamer);
                });

                it(`cursor index should be move ${ test_case.source.length } characters to right`, () => {
                    const last_index = test_case.source.length - 1;
                    expect(streamer.get_current_character()).to.be(test_case.source.charAt(last_index));
                    expect(streamer.cursor.index).to.be(last_index);
                });

                it(`should be in correct range`, () => {
                    expect(streamer.substring_from_token(symbol)).to.be(test_case.source);
                });
            });
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // {{{1 try
            {
                source : "try",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 try {}
            {
                source : "try {}",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 try /*c*/ a
            {
                source : "try /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 try {} /*c*/ a
            {
                source : "try {} /*c*/ a",
                error : error => {
                    it("should be throw: Expected catch or finally after try instead saw: a", () => {
                        expect(error.message).to.be("Expected catch or finally after try instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 try {} catch
            {
                source : "try {} catch",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 try {} catch /*c*/ a
            {
                source : "try {} catch /*c*/ a",
                error : error => {
                    it("should be throw: Expected ( instead saw: a", () => {
                        expect(error.message).to.be("Expected ( instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 try {} catch (/* comment */)
            {
                source : "try {} catch (/* comment */)",
                error : error => {
                    it("should be throw: Missing identifier", () => {
                        expect(error.message).to.be("Missing identifier");
                    });

                    it("should be has token value: )", () => {
                        expect(error.token.value).to.be(")");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 try {} catch (e)
            {
                source : "try {} catch (e)",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 try {} catch (e) /*c*/ a
            {
                source : "try {} catch (e) /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 try {} finally
            {
                source : "try {} finally",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 try {} finally /*c*/ a
            {
                source : "try {} finally /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 try {} catch (e) {} finally /*c*/ a
            {
                source : "try {} catch (e) {} finally /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            }
            // }}}1
        ];

        error_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
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
