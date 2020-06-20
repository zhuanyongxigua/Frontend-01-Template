/**
 * Created by yuxin on 2018/1/25.
 */

"use strict";
var browserSync = require("browser-sync").create();

browserSync.init({
    files: ['./**/*.html'],
    server: true,
    startPath: "./week11/trafficLight.html",
    localOnly: false,
    // host: "192.168.199.166",
    port: 8081,
    notify: false,
});
