import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
	},
	{
		languageOptions: { globals: globals.browser },
	},
	pluginJs.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		rules: {
			// Example rule for turning a rule into a warning
			'no-console': 'warn', // Show a warning if console is used
			'react/prop-types': 'warn', // Show a warning if prop-types are missing
			'react/jsx-no-duplicate-props': 'warn', // Show a warning for duplicate props
			// You can add more rules and set them to "warn" as needed
		},  
	},
]
