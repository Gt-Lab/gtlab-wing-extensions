

function log(msg: string) {
	console.log(msg);
}

$(document).ready(function () {
	initSplit();
	initRuler();
});


// window.onload = function () {
// 	// console.log('onload');

// 	initSplit();
// 	initRuler();
// }

function initSplit() {
    Split(['#gt-split-left', '#gt-split-right'], {
		sizes: [25, 75],
		gutterSize: 8,
		cursor: 'col-resize'
    })

    Split(['#gt-files', '#gt-layers'], {
		direction: 'vertical',
		sizes: [50, 50],
		gutterSize: 8,
		cursor: 'row-resize'
    })
}

function initRuler() {
	// $('#gt-image-view').ruler({
    //     vRuleSize: 18,
    //     hRuleSize: 18,
    //     showCrosshair : false,
    //     showMousePos: false
    // });
	  
	// var imageView = document.getElementById('gt-image-view');
	// imageView.addEventListener('resize', function () {
	// 	console.log('gt-image-view resize')
	// })
	
	// $('#gt-image-view').resize(function () {
	// 	console.log('resize');
	// });
}


// import electron = require('electron');
// import path = require('path');
// import fs = require('fs');



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

// wing.webview.ipc.on('pong', function (event) {
// 	alert('Message From Extension: pong');
// });