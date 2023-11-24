import dedent from "dedent";

import { allValid, defaultParserOptions, RuleTester } from "../../../../test";
import rule, { RULE_NAME } from "./no-constructed-context-value";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: defaultParserOptions,
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    ...allValid,
    dedent`
        function App() {
          const foo = useMemo(() => ({}), [])
          return <Context.Provider value={foo}></Context.Provider>
      }
    `,
    dedent`
        function App() {
          const foo = useMemo(() => [], [])
          return <Context.Provider value={foo}></Context.Provider>
      }
    `,
    dedent`
        const foo = {}
        function App() {
          return <Context.Provider value={foo}></Context.Provider>;
      }
    `,
    dedent`
        const foo = []
        function App() {
          return <Context.Provider value={foo}></Context.Provider>;
      }
    `,
    dedent`
        const foo = new Object()
        function App() {
          return <Context.Provider value={foo}></Context.Provider>;
      }
    `,
    dedent`
      const foo = () => {}
              function App() {
                  return <Context.Provider value={foo}></Context.Provider>;
              }
    `,
  ],
  invalid: [
    {
      code: dedent`
          function App() {
            const foo = {}
            return <Context.Provider value={foo}></Context.Provider>;
        }
      `,
      errors: [{ messageId: "NO_CONSTRUCTED_CONTEXT_VALUE_WITH_IDENTIFIER" }],
    },
    {
      code: dedent`
          function App() {
            const foo = []
            return <Context.Provider value={foo}></Context.Provider>
        }
      `,
      errors: [
        {
          messageId: "NO_CONSTRUCTED_CONTEXT_VALUE_WITH_IDENTIFIER",
        },
      ],
    },
    {
      code: dedent`
        function App() {
            const foo = new Object();
            return <Context.Provider value={foo}></Context.Provider>
        }
      `,
      errors: [
        {
          messageId: "NO_CONSTRUCTED_CONTEXT_VALUE_WITH_IDENTIFIER",
        },
      ],
    },
    {
      code: dedent`
          function App() {
            const foo = () => {}
            return <Context.Provider value={foo}></Context.Provider>
        }
      `,
      errors: [
        {
          messageId: "NO_CONSTRUCTED_CONTEXT_VALUE_WITH_FUNCTION",
        },
      ],
    },
    {
      code: dedent`
        function App() {
            const foo = {
                bar: () => {}
            }
            return <Context.Provider value={foo.bar}></Context.Provider>
        }
      `,
      errors: [
        {
          messageId: "NO_CONSTRUCTED_CONTEXT_VALUE_WITH_IDENTIFIER",
        },
      ],
    },
  ],
});
