module.exports = {
    root: true,
    extends: [
        "@nuxt/eslint-config",
        "eslint:recommended",
        "plugin:vue/vue3-recommended",
    ],
    rules: {
        // enable additional rules
        "curly": ["warn", "all"],
        "indent": ["warn", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["warn", "double"],
        "semi": ["warn", "never"],
        
        // override configuration set by extending "eslint:recommended"
        "comma-dangle": ["warn", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline",
        }],
        "no-empty": "warn",
        "no-cond-assign": ["error", "always"],
        "no-unused-vars": ["warn", {
            "args": "all",
            "argsIgnorePattern": "^_",
            "caughtErrors": "all",
            "caughtErrorsIgnorePattern": "^_",
            "destructuredArrayIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "ignoreRestSiblings": true,
        }],
        "@typescript-eslint/no-unused-vars": ["warn", {
            "args": "all",
            "argsIgnorePattern": "^_",
            "caughtErrors": "all",
            "caughtErrorsIgnorePattern": "^_",
            "destructuredArrayIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "ignoreRestSiblings": true,
        }],
        "vue/html-indent": ["warn", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": [],
        }],
        "vue/max-attributes-per-line": ["warn", {
            "singleline": {
                "max": 2,
            },      
            "multiline": {
                "max": 1,
            },
        }],
        "vue/multi-word-component-names": "off",
        "vue/no-unused-vars": ["warn", {
            "ignorePattern": "^_",
        }],
        
        // disable rules from base configurations
        "for-direction": "off",
        "no-undef": "off",
        "vue/require-default-prop": "off",
    },
}
