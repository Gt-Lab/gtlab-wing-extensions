# wing-newts

## Notes
在wing中点击 F1，输入"New TypeScript File"启动插件，即可快速创建TS类文件。

在以下环境测试通过：
1. Windows 10, Wing 3.0.7, Nodejs 6.1.0
2. Mac 10.11.2, Wing 3.0.7, Nodejs 6.1.0

## Build

安装所有依赖库

```
npm i
```

单独监控web目录

```
node ./node_modules/egretwing/bin/compile -watch -p ./web
```

## TODO
1. 优化编译流程，不用单独监控web目录
2. 加入本地化翻译，支持多种语言
3. 解析工程中文件结构，更智能地导入父类模块

