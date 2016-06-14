

$(document).ready(function () {
	console.log('ready');
	initSplit();
	// initRuler();
});

function initSplit() {
    Split(['#gt-list', '#gt-canvas', '#gt-properties'], {
		sizes: [20, 60, 20],
		minSize: 50,
		gutterSize: 8,
		cursor: 'col-resize'
    })

	// Split(['#gt-list', '#gt-canvas', '#gt-properties'], {
	// 	minSize: [50, 200, 50]
	// });


    // Split(['#gt-files', '#gt-layers'], {
	// 	direction: 'vertical',
	// 	sizes: [50, 50],
	// 	gutterSize: 8,
	// 	cursor: 'row-resize'
    // })
}


import electron = require('electron');
import path = require('path');
import fs = require('fs');


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

wing.webview.ipc.on('pong', function (event) {
	alert('Message From Extension: pong');
});