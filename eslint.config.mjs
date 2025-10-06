import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import noNativeButton from "./eslint-rules/no-native-button.js"; // Pfad zu deiner Rule
import noNativeMain from "./eslint-rules/no-native-main.js";
import noNativeTextinput from "./eslint-rules/no-native-textinput.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Base Next.js Config
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom Rules
  {
    plugins: {
      custom: {
        rules: {
          "no-native-button": noNativeButton,
          "no-native-main": noNativeMain,
          "no-native-textinput" : noNativeTextinput,
        },
      },
    },
    rules: {
      "custom/no-native-button": "warn", // Warnung für <button>
      "custom/no-native-main": "warn",
      "custom/no-native-textinput": "warn",
    },
  },
];

export default eslintConfig;
