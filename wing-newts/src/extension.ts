import * as wing from 'wing';
import * as path from 'path';

export function activate(context: wing.ExtensionContext) {
	console.log('activate');

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

	// wing.commands.registerCommand('extension.previewWebView', () => {
	// 	previewWebView(html);
	// });
	// hello
	wing.commands.registerCommand('extension.showNewTsClassPopup', () => {
		showWebViewPopup(html);
	});
}

function webviewAdded(webview: wing.WebView) {

	webview.addEventListener('ipc-message', (message) => {
		// wing.window.showInformationMessage('Message From WebView: ' + message.channel, ...message.args);

		if ('getWorkspace' == message.channel) {
			webview.send('getWorkspaceSuccess', wing.workspace);
		}

		if ('openTextDocument' == message.channel) {
			// webview.send('getWorkspaceSuccess', wing.workspace);
			var fileName = message.args[0];
			
			
			// 必须先 openTextDocument，然后 showTextDocument 才能让文档显示
			// 而且文档必须处于当前打开的工程中才能打开
			// 并且只是预览状态，不在 working files 中
			wing.workspace.openTextDocument(fileName).then(doc => {
				console.log('ext - openTextDocument');
				console.log(doc);
				wing.window.showTextDocument(doc, wing.ViewColumn.One);
				// 直接发送消息
				// 如果当前已经打开了要替换的文档，onDidOpenTextDocument不会触发，窗口就没法关闭
				webview.send('openTextDocumentSuccess');
			});;

			
			// wing.workspace.onDidOpenTextDocument((event) => {
			// 	console.log('ext - onDidOpenTextDocument');
			// 	webview.send('openTextDocumentSuccess');
			// });
		}
	});
}


function webviewRemoved(webview: wing.WebView) {
}

function previewWebView(html: wing.Uri) {
	wing.complexCommands.previewWebView(html, 'WebViewTest');
}

function showWebViewPopup(html: wing.Uri) {
	// var fileName = '/Users/guanxu/Documents/Tutorials/Game/Egret/ext-tut/ext-tut-code/src/chapters/C10_menu.ts';
	// // wing.workspace.openTextDocument(wing.Uri.parse('untitled:' + fileName));
	// wing.workspace.openTextDocument(fileName).then(doc => {
	// 	console.log(doc);
	// 	wing.window.showTextDocument(doc, wing.ViewColumn.One);
	// });


	// wing.window.showInformationMessage('hello');

	wing.window.showPopup<wing.IWebViewOptions>(wing.PopupType.WebView, {
		uri: html
	}, {
			position: wing.PopupPosition.MIDDLE,
			width: 600,
			height: 400,
			title: 'New TypeScript File',
			movable: true,
			closeButton: true,
			modal: true
		});
}

