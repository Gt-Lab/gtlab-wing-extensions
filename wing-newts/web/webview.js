"use strict";
var fileInfo = {
    fileType: 'class',
    fileName: '',
    inheritType: 'extends',
    inheritName: '',
    filePath: '',
    moduleType: {
        export: false,
        default: false
    }
};
// put it here so i can preview in chrome
$(document).ready(function () {
    $('.ui.checkbox').checkbox({
        onChange: function () {
            // console.log($(this).data('value'));
            // console.log($(this).attr('name'));
            // console.log($(this).parent().checkbox('is checked'));
            // $(this)获得的是 input 对象，所以要到 parent 才能调用 is checked 来判断
            // console.log(   $(this).siblings('label')[0].html()   );
            if ($(this).attr('name') == 'fileType') {
                fileInfo.fileType = $(this).data('value');
            }
            if ($(this).attr('name') == 'moduleType') {
                var t = $(this).data('value');
                fileInfo.moduleType[t] = $(this).parent().checkbox('is checked');
                // 只有当有 export 的时候，default 才有效
                if (fileInfo.moduleType.export) {
                    fileInfo.moduleType.default = $('#moduleType_default').checkbox('is checked');
                    $('#moduleType_default').checkbox('set enabled');
                }
                else {
                    fileInfo.moduleType.default = false;
                    $('#moduleType_default').checkbox('set disabled');
                }
            }
            // printInfo();
        }
    });
    $('input').on('input', function (e) {
        var field = $(this).data('value');
        var value = $(this).val();
        fileInfo[field] = value;
    });
    // change 事件只有失去焦点才会触发
    $('input').on('change', function (e) {
        // printInfo();
    });
    $('#inheritType').dropdown('set text', 'extends');
    $('#inheritType').dropdown({
        onChange: function (value, text, $selectedItem) {
            // console.log(value);
            // console.log(text);
            // console.log($selectedItem);
            fileInfo['inheritType'] = text;
            printInfo();
        }
    });
    $('#gt-form')
        .form({
        fields: {
            name: {
                identifier: 'fileName',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please enter your file name'
                    }
                ]
            },
        }
    });
});
function printInfo() {
    console.log(JSON.stringify(fileInfo));
}
// import electron = require('electron');
// import path = require('path');
// import * as electron from 'electron';
// import * as path from 'path';
// import fs = require('fs');
var fs = require('fs'); // use require() in compiled file. error in browser.
openDevTools();
function createFile() {
    // printInfo();
    // 首先进行一些必要的检查和处理
    // alert('createFile');
    console.log(fileInfo);
    // 首先获取 wing workspace 信息
    wing.webview.ipc.sendToExtensionHost('getWorkspace');
}
wing.webview.ipc.on('getWorkspaceSuccess', function (event, args) {
    // 获取 workspace 成功，开始正式创建文件
    doCreateFile(args);
});
function doCreateFile(args) {
    var rootPath = args.rootPath;
    // let fileInfo = {
    // 	fileType: 'class',
    // 	fileName: '',
    // 	inheritType: 'extends',
    // 	inheritName: '',
    // 	filePath: '',
    // 	moduleType: {
    // 		export: false,
    // 		default: false
    // 	}
    // };
    // var newClassName = document.getElementById('newClassName').value;
    // var parentClassName = document.getElementById('parentClassName').value;
    // var folderPath = document.getElementById('folderPath').value;
    var fi = fileInfo;
    var path = rootPath + '/' + fi.filePath;
    var filename = path + '/' + fi.fileName + '.ts';
    // var fileName = `{{rootPath}}/{{folderPath}}/{{newClassName}}.ts`;
    // alert(fileName);
    var data = fi.fileType + ' ' + fi.fileName + ' {\n' +
        '\t\n' +
        '}\n';
    // todo: 1. 研究其他ts类，是什么样的
    // todo: 2. 路径如果不存在，是否创建；文件如果重名，是否替换
    if (fs.existsSync(path) == false) {
        //文件夹不存在则创建一个
        fs.mkdirSync(path);
    }
    fs.writeFile(filename, data, 'utf-8', function (err) {
        if (!err) {
            console.log('writeFile success');
            wing.webview.ipc.sendToExtensionHost('openTextDocument', filename);
        }
        else {
            console.log(err);
            alert(err.message);
        }
        // if (err) throw err;
        // wing.webview.ipc.close();
    });
}
wing.webview.ipc.on('openTextDocumentSuccess', function (event, args) {
    // alert('openTextDocumentSuccess -----');
    wing.webview.ipc.close();
});
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
