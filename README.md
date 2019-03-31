# jeefo_javascript_parser

"ECMA Script 5" and "ECMA Script 6" Abstract syntax tree parser written in
NodeJS.

Very fast execution and clean code design.

## Goal

There are many existed parsers do not get any information about (,) comma separator
or delimiter characters like (, ), {, }, etc...
So I wanted to write a parser do not lose a single non whitespace character from
the source code. Also I don't want to get complicated AST objects has leading
comments and trailing comments or inner comments... Which is very confusing in
some complicated statements. In this javascript parser AST objects has only
`pre_comment`. All `pre_comment`s are attached to next statement or next
token. Which is very useful for parsing documentations like function declaration
or function expressions. The only way to get individual AST comment object is
source code ends with comment.

## Install

`yarn add jeefo_javascript_parser`

## Dependencies

- [@jeefo/parser](https://github.com/je3f0o/jeefo_parser)

## Documantation

Coming soon...

## Author

- Д.Батхишиг (A.K.A [je3f0o](https://github.com/je3f0o))

## Maintainer

- [https://github.com/je3f0o](https://github.com/je3f0o) (je3f0o@gmail.com)

## References

- ECMA Script 5.1 specs - <https://www.ecma-international.org/ecma-262/5.1>

## LICENSE
The MIT License

Copyright (C) 2017 - jeefo_javascript_parser
