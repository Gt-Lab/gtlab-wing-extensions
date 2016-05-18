"use strict";
// put it here so i can preview in chrome
$(document).ready(function () {
    $('.ui.checkbox')
        .checkbox({
        // check all children
        onChange: function () {
            // console.log('checked');
            // console.log($(this).siblings('label').first().text());
            console.log($(this).data('name'));
            // $(this)获得的是 input 对象，所以要到 parent 才能调用 is checked 来判断
            console.log($(this).parent().checkbox('is checked'));
            // console.log(   $(this).siblings('label')[0].html()   );
        }
    });
    // $('.ui.dropdown').dropdown('set selected', 0);
    // $('.ui.dropdown').dropdown('refresh');
    $('#inheritType').dropdown('set text', 'extends');
    $('#inheritType').dropdown({
        onChange: function (value, text, $selectedItem) {
            console.log(value);
            console.log(text);
            console.log($selectedItem);
        }
    });
});
// import electron = require('electron');
// import path = require('path');
// import fs = require('fs');
// import * as electron from 'electron';
// import * as path from 'path';
var fs = require('fs'); // use require() in compiled file. error in browser.
openDevTools();
function newTsClass() {
    wing.webview.ipc.sendToExtensionHost('getWorkspace');
}
wing.webview.ipc.on('getWorkspaceSuccess', function (event, args) {
    doNewTsClass(args);
});
wing.webview.ipc.on('openTextDocumentSuccess', function (event, args) {
    // alert('openTextDocumentSuccess -----');
    wing.webview.ipc.close();
});
function doNewTsClass(args) {
    var rootPath = args.rootPath;
    var newClassName = document.getElementById('newClassName').value;
    var parentClassName = document.getElementById('parentClassName').value;
    var folderPath = document.getElementById('folderPath').value;
    var folderFullPath = rootPath + '/' + folderPath;
    var fileName = folderFullPath + '/' + newClassName + '.ts';
    // var fileName = `{{rootPath}}/{{folderPath}}/{{newClassName}}.ts`;
    // alert(fileName);
    var data = parentClassName;
    // todo: 1. 研究其他ts类，是什么样的
    // todo: 2. 路径如果不存在，是否创建；文件如果重名，是否替换
    if (fs.existsSync(folderFullPath) == false) {
        //文件夹不存在则创建一个
        fs.mkdirSync(folderFullPath);
    }
    fs.writeFile(fileName, data, 'utf-8', function (err) {
        if (!err) {
            console.log('writeFile success');
            wing.webview.ipc.sendToExtensionHost('openTextDocument', fileName);
        }
        else {
            console.log(err);
            alert(err.message);
        }
        // if (err) throw err;
        // wing.webview.ipc.close();
    });
}
function showAlert() {
    alert('Hello WebView');
}
function nodeApiTest() {
    var packagePath = path.join(__dirname, '../package.json');
    alert(packagePath);
}
function openDevTools() {
    wing.webview.ipc.sendToHost('openDevTools');
}
function sendToExtension() {
    wing.webview.ipc.sendToExtensionHost('ping', '1', '2');
}
function closeWebView() {
    wing.webview.ipc.close();
}
wing.webview.ipc.on('pong', function (event, args) {
    console.log(event);
    console.log(args);
    // rootPath = args;
    // alert('Message From Extension: pong');
});
