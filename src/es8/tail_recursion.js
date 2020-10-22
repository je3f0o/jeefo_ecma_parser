/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tail_recursion.js
* Created at  : 2020-08-27
* Updated at  : 2020-08-27
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

const fibonacci = (n) => {
    switch (n) {
        case 0 :
            debugger
            return n;
        case 1 :
            debugger
            return n;
    }
    return fibonacci(n-1) + fibonacci(n-2);
};

// tail feb
const fibonacci_tail = (n) => {
    switch (n) {
        case 0 :
        case 1 : return n;
    }

    let a = 0;
    let b = 1;
    let c;
    for (let i = 2; i <= n; i += 1) {
        c = a + b;
        a = b;
        b = c;
    }
    debugger
    return b;
};

console.log(fibonacci(10));
console.log(fibonacci_tail(10));
