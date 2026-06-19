{
  "name": "karma",
  "version": "6.4.0",
  "port": 9876,
  "frameworks": ["jasmine", "@angular-devkit/build-angular"],
  "plugins": [
    "karma-jasmine",
    "karma-chrome-launcher",
    "karma-firefox-launcher",
    "karma-jasmine-html-reporter",
    "karma-coverage",
    "@angular-devkit/build-angular/plugins/karma"
  ],
  "client": {
    "jasmine": {
      "random": false
    },
    "clearContext": false
  },
  "jasmineHtmlReporter": {
    "suppressAll": true
  },
  "coverageReporter": {
    "dir": "coverage",
    "subdir": ".",
    "reporters": [
      { "type": "html" },
      { "type": "text-summary" }
    ]
  },
  "reporters": ["progress", "kjhtml"],
  "browsers": ["Chrome"],
  "restartOnFileChange": true
}
