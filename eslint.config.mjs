import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = [
	// ✅ Standalone ignore block
	{
		ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", ".swc/**", "jest.config.js"]
	},

	// ✅ Extend the Next.js config
	...compat.extends("next/core-web-vitals", "next/typescript"),

	// ✅ Your overrides
	{
		rules: {
			"prefer-const": "off",
			"no-unused-vars": "off",
			"react-hooks/exhaustive-deps": "off"
		}
	}
];

export default eslintConfig;
