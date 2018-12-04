module.exports = {

    // enable code coverage analysis
    coverage: false,

    // set code coverage path
    coveragePath: "./coverage.html",

    // code coverage threshold percentage
    threshold: 0,

    // enable linting
    // lint: true

    // verbose test output
    verbose: true,

    // file pattern to use for locating tests
    pattern: "test/*.test.ts",

    // javascript file that exports an array of objects ie.
    //  [{
    //    ext: ".js",
    //    transform: function (content, filename) { ... }
    //  }]
    transform: "node_modules/lab-transform-typescript",

    // ignore a list of globals for the leak detection (comma separated)
    globals: "__extends,__assign,__rest,__decorate,__param,__metadata," +
             "__awaiter,__generator,__exportStar,__values,__read,__spread," +
             "__await,__asyncGenerator,__asyncDelegator,__asyncValues," +
             "__makeTemplateObject,__importStar,__importDefault",

    // -a, --assert                    specify an assertion library module path to require and make available under Lab.assertions
    // --bail                          exit the process with a non zero exit code on the first test failure
    // -C, --colors                    enable color output (defaults to terminal capabilities)
    // -M, --context-timeout           timeout for before, after, beforeEach, afterEach in milliseconds
    // --coverage-path                 set code coverage path
    // --coverage-exclude              set code coverage excludes
    // --coverage-all                  include all files in coveragePath in report
    // --coverage-flat                 prevent recursive inclusion of all files in coveragePath in report
    // --coverage-pattern              file pattern to use for locating files for coverage
    // -p, --default-plan-threshold    minimum plan threshold to apply to all tests that don't define any plan
    // -d, --dry                       skip all tests (dry run)
    // -e, --environment               value to set NODE_ENV before tests
    // -f, --flat                      prevent recursive collection of tests within the provided path
    // -g, --grep                      only run tests matching the given pattern which is internally compiled to a RegExp
    // -h, --help                      display usage options
    // -i, --id                        test identifier
    // --inspect                       starts lab with the node.js native debugger
    // -l, --leaks                     disable global variable leaks detection
    // -n, --linter                    linter path to use
    // --lint-fix                      apply any fixes from the linter.
    // --lint-options                  specify options to pass to linting program. It must be a string that is JSON.parse(able).
    // --lint-errors-threshold         linter errors threshold in absolute value
    // --lint-warnings-threshold       linter warnings threshold in absolute value
    // -o, --output                    file path to write test results
    // -r, --reporter                  reporter type [console, html, json, tap, lcov, clover, junit]
    // --seed                          use this seed to randomize the order with `--shuffle`. This is useful to debug order dependent test failures
    // --shuffle                       shuffle script execution order
    // -s, --silence                   silence test output
    // -k, --silent-skips              don’t output skipped tests
    // -S, --sourcemaps                enable support for sourcemaps
    // -m, --timeout                   timeout for each test in milliseconds
    // -V, --version                   version information
};
