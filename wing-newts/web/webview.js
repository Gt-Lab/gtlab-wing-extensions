"use strict";
var fs = require('fs');
var path = require('path');
// import process = require('process'); // process is global, no need to import
// global variables, store all information
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
    extraInfo: {
        import: true,
        comment: true
    },
    rootPath: '',
    fullPath: '',
    fullName: ''
};
var osInfo = {
    platform: 'darwin',
    slash: '/'
};
// jQuery ready. put it here so i can preview in chrome
$(document).ready(function () {
    osInfo.platform = process.platform;
    osInfo.slash = (osInfo.platform == 'win32') ? '\\' : '/';
    $('#projectPathLabel').html("{Project Path}" + osInfo.slash);
    $('#fileNamePreviewLabel').html(osInfo.slash + "{YourFile}.ts");
    // class/interface, export, default
    $('.ui.checkbox').checkbox({
        onChange: function () {
            // console.log($(this).data('value'));
            // console.log($(this).attr('name'));
            // console.log($(this).parent().checkbox('is checked'));
            // $(this)获得的是 input 对象，所以要到 parent 才能调用 is checked 来判断
            // console.log(   $(this).siblings('label')[0].html()   );
            var name = $(this).data('name');
            var type = $(this).attr('type');
            var value = $(this).data('value');
            // class/interface
            if (type == 'radio') {
                fileInfo[name] = value;
            }
            // export, default
            if (type == 'checkbox') {
                fileInfo[name][value] = $(this).parent().checkbox('is checked');
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
            printInfo();
        }
    });
    // <input class="gt-input" name="fileName" data-value="fileName" type="text" ...> --- will trigger this
    // <input type="radio" ...>		--- not trigger
    // <input type="checkbox" ...>	--- not trigger
    // fileName, inheritName, filePath
    $('input').on('input', function (e) {
        console.log('input --- ');
        var field = $(this).data('name');
        var value = $(this).val();
        fileInfo[field] = value;
        if (field == 'fileName') {
            value = (value == '') ? '{YourFile}' : value;
            $('#fileNamePreviewLabel').html("" + osInfo.slash + value + ".ts");
        }
    });
    // change event handler only called when input blured
    $('input').on('change', function (e) {
        // printInfo();
    });
    // inheritType
    $('#inheritType').dropdown('set text', 'extends');
    $('#inheritType').dropdown({
        onChange: function (value, text, $selectedItem) {
            fileInfo['inheritType'] = text;
            printInfo();
        }
    });
    // form validation
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
    // 如果 filePath 存在就用上一次的。
    var filePath = localStorage.getItem('gtlab_wingNewTS_filePath');
    if (filePath) {
        fileInfo.filePath = filePath;
        $('#filePath').val(filePath);
    }
}); // ready
// wing.webview.ipc.sendToHost('openDevTools');
// test 
// import MyClass from './MyClass'
// function test() {
// openDevTools();
// 	// let myclass = new MyClass();
// 	// myclass.print();
// 	alert(os.platform());
// 	alert(process.platform);
// }
// log info
function printInfo() {
    console.log(JSON.stringify(fileInfo));
}
// Create Button
function createFile() {
    // console.log(fileInfo);
    // first get wing.workspace
    wing.webview.ipc.sendToExtensionHost('getWorkspace');
}
// wing.workspace returned
wing.webview.ipc.on('getWorkspaceSuccess', function (event, args) {
    // console.log('web - getWorkspaceSuccess');
    // create file
    doCreateFile(args);
});
// create file
function doCreateFile(args) {
    var fi = fileInfo; // for short
    var oi = osInfo; // for short
    fi.rootPath = args.rootPath; // wing.workspace.rootPath
    // todo 如果文件名包含 .ts 要处理 ---- 因为修改名称时会有提示，暂不处理
    // todo 如果路径是windows的斜杠、路径两边有斜杠，要处理 ---- path.join() 可以自动处理
    // fi.fullPath = `${fi.rootPath}${oi.slash}${fi.filePath}`;
    // fi.fullName = `${fi.fullPath}${oi.slash}${fi.fileName}.ts`;
    localStorage.setItem('gtlab_wingNewTS_filePath', fi.filePath);
    // fullPath 文件夹绝对路径，fullName 文件绝对路径
    fi.fullPath = path.join(fi.rootPath, fi.filePath);
    fi.fullName = path.join(fi.fullPath, fi.fileName + '.ts');
    fileInfo = fi; // save back
    var data = fileContent(fi); // file content
    // todo: 1. 研究其他ts类，是什么样的 ---- xx
    // todo: 2. 路径如果不存在，是否创建；文件如果重名，是否替换 ---- 已经弹框
    // todo: 3. input 无法复制粘贴 ---- 未找到解决方法
    if (!fs.existsSync(fi.fullPath)) {
        // if no such folder, create it
        fs.mkdirSync(fi.fullPath);
    }
    if (fs.existsSync(fi.fullName)) {
        // replace file with the same name?
        $('#gt-replace-modal')
            .modal({
            closable: false,
            onDeny: function () {
                console.log('do not replace file');
                // return false;	// if return false, the modal will not close
            },
            onApprove: function () {
                console.log('replace file');
                writeFile(fi.fullName, data);
            }
        })
            .modal('show');
    }
    else {
        writeFile(fi.fullName, data);
    }
} // doCreateFile
function fileContent(fi) {
    // indents are strange in this function 
    // `` multiline string will use the indent of each line
    // 1. import ---
    var importStr = '';
    var importNote = '// *** may need some changes to make "import" work ***';
    var importStrExport = "import {" + fi.inheritName + "} from './" + fi.inheritName + "'";
    var importStrExportDefault = "import " + fi.inheritName + " from './" + fi.inheritName + "'";
    var inheritFileName = fi.fullPath + "/" + fi.inheritName + ".ts";
    if (!fs.existsSync(inheritFileName)) {
        // 如果文件不存在，默认提供注释的形式
        importStr =
            importNote + "\n// " + importStrExport + "\n// " + importStrExportDefault + "\n";
    }
    else {
        var inheritFileContent = fs.readFileSync(inheritFileName, 'utf-8');
        if (inheritFileContent.indexOf('export default') >= 0) {
            // export defalut
            importStr =
                importNote + "\n// " + importStrExport + "\n" + importStrExportDefault + "\n";
        }
        else if (inheritFileContent.indexOf('export') >= 0) {
            // export
            importStr =
                importNote + "\n" + importStrExport + "\n// " + importStrExportDefault + "\n";
        }
        else {
            // no export
            importStr =
                importNote + "\n// " + importStrExport + "\n// " + importStrExportDefault + "\n";
        }
    }
    // 2. comment ---
    var author = '';
    var packageJsonPath = fi.rootPath + "/package.json";
    if (fs.existsSync(packageJsonPath)) {
        var packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        var packageJsonObj = JSON.parse(packageJsonContent);
        author = packageJsonObj.hasOwnProperty('publisher') ? packageJsonObj.publisher : '';
    }
    var date = new Date();
    var commentStr = "/**\n * " + fi.fileName + "\n * @author " + author + "\n * @version \n * @date " + date.toISOString() + "\n */\n";
    // 3. export default ---
    var moduleType = "" + (fi.moduleType.export ? 'export ' : '') + (fi.moduleType.default ? 'default ' : '');
    var inheritInfo = "" + (fi.inheritName == '' ? '' : fi.inheritType + ' ') + fi.inheritName;
    // 4. constructor ---
    // if extends，constructor() must call super()
    var constructorStr = "\tconstructor() {\n\t\t" + ((fi.inheritType == 'extends' && fi.inheritName != '') ? 'super();' : '') + "\n\t}";
    // --- file content ---
    // export default interface MyInterface will lint error，
    // no error when "default" removed. actually both work.
    var data = (fi.extraInfo.import ? importStr : '') + "\n" + (fi.extraInfo.comment ? commentStr : '') + "\n" + moduleType + fi.fileType + " " + fi.fileName + " " + inheritInfo + "{\n" + (fi.fileType == 'class' ? constructorStr : '') + "\t\n}\n";
    return data;
} // fileContent
// write file to project
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
    });
}
// if created file opened successfully, close the webview
wing.webview.ipc.on('openTextDocumentSuccess', function (event, args) {
    console.log('web - openTextDocumentSuccess');
    wing.webview.ipc.close();
});
// -------- template ----------
// function showAlert() {
// 	alert('Hello WebView');
// }
// function nodeApiTest() {
// 	var packagePath = path.join(__dirname, '../package.json');
// 	alert(packagePath);
// }
// function openDevTools() {
// 	wing.webview.ipc.sendToHost('openDevTools');
// }
// function sendToExtension() {
// 	wing.webview.ipc.sendToExtensionHost('ping', '1', '2');
// }
// function closeWebView() {
// 	wing.webview.ipc.close();
// }
// wing.webview.ipc.on('pong', function (event, args) {
// 	console.log(event);
// 	console.log(args);
// });
