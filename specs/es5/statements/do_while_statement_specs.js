/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : do_while_statement_specs.js
* Created at  : 2019-02-21
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

const expect                       = require("expect.js");
const { UnexpectedTokenException } = require("@jeefo/parser");

const parser          = require("../parser.js");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

const {
    test_range,
    test_keyword,
    test_for_each,
    test_statement,
    test_substring,
    test_delimiter
} = require("../../helpers");

describe("Do while statement >", () => {
    const test = test_cases => {
        test_for_each(test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            test_statement(node, "Do while");

            it("should be has correct do_keyword", () => {
                test_case.do_keyword(node.do_keyword, streamer);
            });

            it("should be has correct statement", () => {
                test_case.statement(node.statement, streamer);
            });

            it("should be has correct while_keyword", () => {
                test_case.while_keyword(node.while_keyword, streamer);
            });

            it("should be has correct open_parenthesis", () => {
                test_case.open(node.open_parenthesis, streamer);
            });

            it("should be has correct expression", () => {
                test_case.expression(node.expression, streamer);
            });

            it("should be has correct close_parenthesis", () => {
                test_case.close(node.close_parenthesis, streamer);
            });

            it("should be has correct terminator", () => {
                test_case.terminator(node.terminator, streamer);
            });

            test_range(test_case, node, streamer);
        });
    };

    describe("Semicolon terminated >", () => {
        test([
            // do; while (true);
            {
                code   : "do; while (true);",
                source : "do; while (true);",

                do_keyword : (node, streamer) => {
                    test_keyword("do", null, node, streamer);
                },
                while_keyword : (node, streamer) => {
                    test_keyword("while", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
                terminator : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring(";", streamer, node);
                }
            },
        ]);
    });

    describe("Automatic semicolon insertion >", () => {
        test([
            // do ; while (true)
            {
                code   : "do ; while (true)",
                source : "do ; while (true)",

                do_keyword : (node, streamer) => {
                    test_keyword("do", null, node, streamer);
                },
                while_keyword : (node, streamer) => {
                    test_keyword("while", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // do while(false); while (true)
            {
                code   : "do while(false); while (true)",
                source : "do while(false); while (true)",

                do_keyword : (node, streamer) => {
                    test_keyword("do", null, node, streamer);
                },
                while_keyword : (node, streamer) => {
                    test_keyword("while", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring("while(false);", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // do /* comment */ a\n while (true)\n b
            {
                code   : "do /* comment */ a\n while (true)",
                source : "do /* comment */ a\n while (true)\n b",

                do_keyword : (node, streamer) => {
                    test_keyword("do", null, node, streamer);
                },
                while_keyword : (node, streamer) => {
                    test_keyword("while", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    expect(node.terminator).to.be(null);
                    test_substring("a", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // /*a*/do/*b*/a\n/*c*/while/*d*/(/*e*/true/*f*/)/*g*/; b
            {
                code   : "do/*b*/a\n/*c*/while/*d*/(/*e*/true/*f*/)/*g*/;",
                source : "/*a*/do/*b*/a\n/*c*/while/*d*/(/*e*/true/*f*/)/*g*/; b",
                offset : "/*a*/".length,

                do_keyword : (node, streamer) => {
                    test_keyword("do", "/*a*/", node, streamer);
                },
                while_keyword : (node, streamer) => {
                    test_keyword("while", "/*c*/", node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", "/*d*/", node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", "/*f*/", node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    expect(node.terminator).to.be(null);
                    test_substring("a", streamer, node);
                },
                terminator : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring(";", streamer, node);
                }
            },
        ]);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // do
            {
                source : "do",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // do while(false);
            {
                source : "do while(false);",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // do while(false); a
            {
                source : "do while(false); a",
                error : error => {
                    it("should be throw: Expected while instead saw: a", () => {
                        expect(error.message).to.be("Expected while instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // do; while();
            {
                source : "do; while();",
                error : error => {
                    it("should be throw: Missing expression", () => {
                        expect(error.message).to.be("Missing expression");
                    });

                    it("should be has token value: )", () => {
                        expect(error.token.value).to.be(")");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // do; while (/* comment */);
            {
                source : "do; while (/* comment */);",
                error : error => {
                    it("should be throw: Missing expression", () => {
                        expect(error.message).to.be("Missing expression");
                    });

                    it("should be has token value: )", () => {
                        expect(error.token.value).to.be(")");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // do; while
            {
                source : "do; while",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // do; while(false) a
            {
                source : "do; while(false) a",
                error : error => {
                    it("should be throw: Expected ; instead saw: a", () => {
                        expect(error.message).to.be("Expected ; instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // do\n while(false);
            {
                source : "do\n while(false);",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },
        ];

        test_for_each(error_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            try {
                parser.parse_next_node(precedence_enum.TERMINATION);
                expect("throw").to.be("failed");
            } catch (e) {
                test_case.error(e);
            }
        });
    });
});
