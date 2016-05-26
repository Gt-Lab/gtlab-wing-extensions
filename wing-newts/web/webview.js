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
    },
    rootPath: ''
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
var path = require('path');
var MyClass_1 = require('./MyClass');
openDevTools();
// 按钮点击事件
function test() {
    var myclass = new MyClass_1.default();
    myclass.print();
}
// 按钮点击事件
function createFile() {
    console.log(fileInfo);
    // 首先请求 wing workspace 信息
    wing.webview.ipc.sendToExtensionHost('getWorkspace');
}
// wing 返回 workspace 数据
wing.webview.ipc.on('getWorkspaceSuccess', function (event, args) {
    console.log('web - getWorkspaceSuccess');
    // 获取 workspace 成功，开始正式创建文件
    doCreateFile(args);
});
// 实际的操作
function doCreateFile(args) {
    // wing.workspace.rootPath
    var fi = fileInfo;
    fi.rootPath = args.rootPath;
    // 用新的字符串语法
    var path = fi.rootPath + "/" + fi.filePath;
    var filename = path + "/" + fi.fileName + ".ts";
    // 如果继承了其他class或者interface，可能要导入相应的类型
    // todo 查找父类文件，通过里面是 export 还是 export default 来决定用哪种import方式
    var importStr = '';
    var importStrExport = "import {" + fi.inheritName + "} from './" + fi.inheritName + "'";
    var importStrExportDefault = "import " + fi.inheritName + " from './" + fi.inheritName + "'";
    var inheritFileName = path + "/" + fi.inheritName + ".ts";
    if (!fs.existsSync(inheritFileName)) {
        console.log('');
        // 如果文件不存在，默认提供注释的形式
        importStr =
            "// *** uncomment to import ***\n// " + importStrExport + "\n// " + importStrExportDefault + "\n";
    }
    else {
        var content = fs.readFileSync(inheritFileName, 'utf-8');
        // alert(content);
        if (content.indexOf('export default') >= 0) {
            importStr =
                "// *** you may need another import ***\n// " + importStrExport + "\n" + importStrExportDefault + "\n";
        }
        else {
            importStr =
                "// *** you may need another import ***\n" + importStrExport + "\n// " + importStrExportDefault + "\n";
        }
    }
    var commentStr = "\n/**\n * ClassName: type_name\n * @Description: todo\n * @author yokoboy\n * @date date\n */\n";
    var moduleType = "" + (fi.moduleType.export ? 'export ' : '') + (fi.moduleType.default ? 'default ' : '');
    var inheritInfo = "" + (fi.inheritName == '' ? '' : fi.inheritType + ' ') + fi.inheritName;
    // 如果继承了类，constructor中一定要调用super
    var constructorStr = "\tconstructor() {\n\t\t" + ((fi.inheritType == 'extends' && fi.inheritName != '') ? 'super();' : '') + "\n\t}";
    // 文件内容
    // export default interface MyInterface 会报错，去掉 default 就不会。但是两个都能运行
    var data = "\n" + (fi.inheritName != '' ? importStr : '') + "\n" + commentStr + "\n" + moduleType + fi.fileType + " " + fi.fileName + " " + inheritInfo + "{\n" + (fi.fileType == 'class' ? constructorStr : '') + "\t\n}\n";
    // todo: 1. 研究其他ts类，是什么样的
    // todo: 2. 路径如果不存在，是否创建；文件如果重名，是否替换
    // todo: 3. input 无法复制粘贴
    if (!fs.existsSync(path)) {
        //文件夹不存在则创建一个
        fs.mkdirSync(path);
    }
    if (fs.existsSync(filename)) {
        // 如果文件存在，弹框询问是否覆盖
        $('#gt-replace-modal')
            .modal({
            closable: false,
            onDeny: function () {
                console.log('do not replace file');
                // return false;
            },
            onApprove: function () {
                console.log('replace file');
                writeFile(filename, data);
            }
        })
            .modal('show');
    }
    else {
        writeFile(filename, data);
    }
}
function writeFile(filename, data) {
    console.log('web - writeFile');
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
    console.log('web - openTextDocumentSuccess');
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
