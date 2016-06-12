import * as wing from 'wing';
import * as path from 'path';


let _fileName;

export function activate(context: wing.ExtensionContext) {
	// console.log('activate');
	// wing.window.showInformationMessage('activate');
	
	let html = wing.Uri.file(path.join(context.extensionPath, 'web/index.html'));

	wing.window.webviews.forEach(webview => {
		webviewAdded(webview);
	});

	wing.window.onDidCreateWebView((webview) => {
		webviewAdded(webview);
	});

	wing.window.onDidDeleteWebView((webview) => {
		webviewRemoved(webview);
	});

	wing.commands.registerCommand('extension.gtlab.wingPsMaster.show', () => {
		previewWebView(html);
	});
	// wing.commands.registerCommand('extension.showWebViewPopup', () => {
	// 	showWebViewPopup(html);
	// });
	
	
	
	// // workspace
	// wing.workspace.onDidChangeTextDocument((e: any) => {
	// 	wing.window.showInformationMessage('onDidChangeTextDocument');
	// });
	
	// wing.workspace.onDidOpenTextDocument((e: any) => {
	// 	wing.window.showInformationMessage('onDidOpenTextDocument');
	// });
	
	
	
	// // window
	// wing.window.onDidChangeTextEditorOptions((e:any) => {
	// 	wing.window.showInformationMessage('onDidChangeTextEditorOptions');
	// });
	
	// wing.window.onDidChangeTextEditorSelection((e:any)=>{
	// 	wing.window.showInformationMessage('onDidChangeTextEditorSelection');
	// });
	
	// wing.window.onDidChangeTextEditorViewColumn((e:any)=>{
	// 	wing.window.showInformationMessage('onDidChangeTextEditorViewColumn');
	// });
	
	
	
	
	// wing.window.onDidChangeActiveTextEditor((texteditor) => {
	// 	wing.window.showInformationMessage('onDidChangeActiveTextEditor');
	// 	// console.log('onDidChangeActiveTextEditor');
	// 	// previewWebView(html);
		
	// 	// showFileName(context);
	// });
	// // showFileName(context);
	
	// wing.window.showInformationMessage('setInterval');
	// setInterval( function () {
	// 	showFileName(context)
	// }, 2000);
}


function showFileName(context) {
	wing.window.showInformationMessage('showFileName');
	
	let editor = wing.window.activeTextEditor;
	if (!editor) {
		return;
	}
	let doc = editor.document;
	let fileName = doc.fileName;
	wing.window.showInformationMessage(fileName);
	
	
	// if (fileName.indexOf('.psd')>=0 || fileName.indexOf('.psb')>=0) {
	// 	// wing.window.showInformationMessage('obj file');
	// 	_fileName = fileName;
		
	// 	let html = wing.Uri.file(path.join(context.extensionPath, 'web/index.html'));
	// 	// showWebViewPopup(html);
	// 	previewWebView(html);
	// }
}


function webviewAdded(webview: wing.WebView) {
	webview.addEventListener('ipc-message', (message) => {
		wing.window.showInformationMessage('Message From WebView: ' + message.channel, ...message.args);
		webview.send('pong');
	});
}

function webviewRemoved(webview: wing.WebView) {
}

function previewWebView(html: wing.Uri) {
	wing.complexCommands.previewWebView(html, 'WebViewTest');
}

function showWebViewPopup(html: wing.Uri) {
	wing.window.showPopup<wing.IWebViewOptions>(wing.PopupType.WebView, {
		uri: html
	}, {
		position: wing.PopupPosition.MIDDLE,
		width: 600,
		height: 400,
		title: '测试',
		movable: true,
		closeButton: true,
		modal: true
	});
}