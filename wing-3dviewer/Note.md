
## Build
直接Build会报错

```
Failed to launch external program npm run compile --loglevel silent.
spawn npm ENOENT
```

必须手动启用

```
npm run compile --loglevel silent
npm run compileweb --loglevel silent
```

