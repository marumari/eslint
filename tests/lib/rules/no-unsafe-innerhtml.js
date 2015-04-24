/**
 * @fileoverview Test for no-unsafe-innerhtml rule
 * @author Frederik Braun
 * @copyright 2015 Mozilla Corporation. All rights reserved (but still
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
  ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-unsafe-innerhtml", {

  // Examples of code that should not trigger the rule
  valid: [
    "a.innerHTML = ''",
    "c.innerHTML = ``",
    "g.innerHTML = Tagged.escapeHTML``",
    "h.innerHTML = Tagged.escapeHTML`foo`",
    "i.innerHTML = Tagged.escapeHTML`foo${bar}baz`",
    // hint:  below same as above but '+='
    "a.innerHTML += ''",
    "b.innerHTML += \"\"",
    "c.innerHTML += ``",
    "d.innerHTML += 'foo'",
    "e.innerHTML += \"foo\"",
    "f.innerHTML += `foo`",
    "g.innerHTML += Tagged.escapeHTML``",
    "h.innerHTML += Tagged.escapeHTML`foo`",
    "i.innerHTML += Tagged.escapeHTML`foo${bar}baz`"
  ], //XXX this does not find z['innerHTML'] and the like.
  //XXX define a valid pattern that is for seemingly evil patterns, e.g. '//approved by fxossec bug <id>'

  // Examples of code that should trigger the rule
  invalid: [
    /*XXX "Unsafe assignment to innerHTML spotted" is now a SEO-ish term
          if someone stumbles upon this, they will find an MDN page that
          tells them to use the tagged-library
     */
    {
      code: "m.innerHTML = moo;",
      errors: [
        { message: "Unsafe assignment to innerHTML spotted.",
          type: "AssignmentExpression" }
      ]
    },
    {
      code: "a.innerHTML += something;",
      errors: [
        {
          message: "Unsafe assignment to innerHTML spotted. Please see ",
            type: "AssignmentExpression"
        }
      ]
    }
  ]
});
