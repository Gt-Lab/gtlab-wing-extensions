"use strict";
var path = require('path');
var _fileName;
openDevTools();
console.log('webview: before init');
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 250;
    // scene
    scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);
    // model
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) { };
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setBaseUrl( 'obj/male02/' );
    // mtlLoader.setPath( 'obj/male02/' );
    // var path = 'file:///Users/guanxu/Documents/GitHub/GameEngine/Egret/gtlab-wing-extensions/wing-3dviewer/web/obj/male02/';
    // alert(_fileName);
    var dirname = path.dirname(_fileName) + '/';
    var basename = path.basename(_fileName);
    var mtlname = basename.substr(0, basename.length - 4) + '.mtl';
    mtlLoader.setBaseUrl(dirname);
    mtlLoader.setPath(dirname);
    mtlLoader.load(mtlname, function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        // objLoader.setPath( 'obj/male02/' );
        objLoader.setPath(dirname);
        objLoader.load(basename, function (object) {
            object.position.y = -95;
            scene.add(object);
        }, onProgress, onError);
    });
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    //
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
}
//
function animate() {
    requestAnimationFrame(animate);
    render();
}
function render() {
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY - camera.position.y) * .05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
sendToExtension();
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
    // alert('sendToExtension');
    // wing.webview.ipc.sendToExtensionHost('ping', '1', '2');
    wing.webview.ipc.sendToExtensionHost('getFileName');
}
function closeWebView() {
    wing.webview.ipc.close();
}
wing.webview.ipc.on('pong', function (event) {
    alert('Message From Extension: pong');
});
wing.webview.ipc.on('getFileNameSuccess', function (event, args) {
    // alert(JSON.stringify(args));
    _fileName = args;
    init();
    animate();
});
