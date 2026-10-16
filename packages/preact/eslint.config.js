import tseslint from "typescript-eslint";
import rootConfig from "../../eslint.config.js";

export default tseslint.config(
  ...rootConfig,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              message: "This is a Preact package — import from 'preact' or 'preact/hooks' instead.",
            },
            {
              name: "react-dom",
              message: "This is a Preact package — import from 'preact' instead.",
            },
          ],
        },
      ],
    },
  },
);