module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "dot-notation": "error",
        "eqeqeq": "error",
        "no-delete-var": "error",
        "quotes": ["error", "single"],
        "no-unused-expressions": "error"
    }
};