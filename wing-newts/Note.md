
## 打开指定文档
// 必须先 openTextDocument，然后 showTextDocument 才能让文档显示
// 而且文档必须处于当前打开的工程中才能打开
// 并且只是预览状态，不在 working files 中


## 调试
默认的进程不能编译web目录下的文件，所以要单独跑一个进程
node ./node_modules/egretwing/bin/compile -watch -p ./web

## webview 主题
webview 使用了这里的样式
/Applications/Egret Wing 3.app/Contents/Resources/app/out/vs/workbench/parts/html/electron-browser/media/webview.css

其实主题只有两种基本类型，所有基于 light 的和基于 dark 的。

对于基于dark的主题，body 会加入一个 vs-dark 的 class。制作的时候要特别注意。


## d.ts
src/typings/index.d.ts 引用了 node_modules/egretwing/typings/index.d.ts 里面有关于wing和dom的声明，让编辑器可以智能提示，并且不会报错

