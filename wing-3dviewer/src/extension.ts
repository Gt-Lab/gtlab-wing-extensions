import * as wing from 'wing';
import * as path from 'path';


let _fileName;

export function activate(context: wing.ExtensionContext) {
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

	wing.commands.registerCommand('extension.previewWebView', () => {
		previewWebView(html);
	});
	wing.commands.registerCommand('extension.showWebViewPopup', () => {
		showWebViewPopup(html);
	});
	
	
	wing.window.onDidChangeActiveTextEditor((texteditor) => {
		// console.log('onDidChangeActiveTextEditor');
		// previewWebView(html);
		
		showFileName(context);
	});
	showFileName(context);
	
	// wing.workspace.onDidChangeTextDocument((event)=>{
	// 	wing.window.showInformationMessage('wing.workspace.onDidChangeTextDocument');
	// });
	
	
}

function showFileName(context) {
	let editor = wing.window.activeTextEditor;
	if (!editor) {
		return;
	}
	let doc = editor.document;
	let fileName = doc.fileName;
	// wing.window.showInformationMessage(fileName);
	
	
	if (fileName.indexOf('.obj')>=0) {
		// wing.window.showInformationMessage('obj file');
		_fileName = fileName;
		
		let html = wing.Uri.file(path.join(context.extensionPath, 'web/index.html'));
		// showWebViewPopup(html);
		previewWebView(html);
	}
}

function webviewAdded(webview: wing.WebView) {
	webview.addEventListener('ipc-message', (message) => {
		// wing.window.showInformationMessage('Message From WebView: ' + message.channel, ...message.args);
		// webview.send('pong');
		if (message.channel == 'getFileName') {
			webview.send('getFileNameSuccess', _fileName);
		}
	});
}

function webviewRemoved(webview: wing.WebView) {
}

function previewWebView(html: wing.Uri) {
	wing.complexCommands.previewWebView(html, 'WebViewTest');
	// wing.complexCommands.previewWebView(html, 'WebViewTest', wing.ViewColumn.Two);
}

function showWebViewPopup(html: wing.Uri) {
	wing.window.showPopup<wing.IWebViewOptions>(wing.PopupType.WebView, {
		uri: html
	}, {
		position: wing.PopupPosition.MIDDLE,
		width: 600,
		height: 400,
		title: '测试1234',
		movable: true,
		closeButton: true,
		modal: true
	});
}