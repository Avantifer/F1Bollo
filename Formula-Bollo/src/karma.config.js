/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-sonarqube-reporter"),
      require("karma-jasmine"),
      require("karma-chrome-launcher")
    ],
    client: {
      clearContext: false
    },
    coverageReporter: {
      type : "lcov",
      dir : "coverage/",
      subdir: ".",
      file : "lcov.info"
    },
    sonarqubeReporter: {
      basePath: "src",
      filePattern: "**/*.spec.ts",
      encoding: "utf-8",
      outputFolder: "reports",
      legacyMode: false,
      reportName: "sonarqube_report.xml",
    },
    reporters: ["progress", "kjhtml", "coverage", "sonarqube"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    browserNoActivityTimeout: 100000
  });
};
