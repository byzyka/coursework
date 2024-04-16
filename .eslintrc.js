module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    "indent": "off",
    "no-tabs": ["error", {
        "allowIndentationTabs": true
     }],

     "spaced-comment": ["error", "always", {
        "line": {
            "markers": ["/", "#region", "#endregion", "region", "endregion"],
            "exceptions": ["-", "+"]
        },
        "block": {
            "markers": ["!"],
            "exceptions": ["*"],
            "balanced": true 
        }
    }],
    
    "linebreak-style": 0,
    "eqeqeq": "off",
    "prefer-const": "off",
    "no-console": "off",
    "prefer-destructuring": ["error", {
    "object": true,
    "array": false,
    "eol-last": 0,
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }]
     }]
  },
};
