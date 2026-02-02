# flun-windows

本工具库能将您的 Node.js 应用程序作为 Windows 后台服务来运行和管理,支持服务的安装、启动、停止及卸载全流程;
还提供事件日志等功能,它主要用于面向生产环境应用程序的部署与运维;
如需联系，邮箱: [cn@flun.top](mailto:cn@flun.top)

## 功能概述

flun-windows 提供以下功能：

- **服务管理**：将 Node.js 脚本作为原生 Windows 服务运行（含监控功能）
- **事件日志**：写入 Windows 事件日志
- **系统命令**：
  - _权限提升_：以管理员权限运行命令（可能触发 UAC 确认）
  - _Sudo 执行_：以管理员身份执行命令
  - _权限检测_：检测当前用户是否具有管理员权限
  - _进程列表_：列出运行中的 Windows 进程/服务
  - _终止进程_：通过 PID 终止特定进程

## 安装

推荐通过 npm 全局安装：`npm i -g flun-windows`

然后在项目根目录执行：`npm link flun-windows`

局部安装:`npm i flun-windows`

## 无原生模块依赖

Windows 上的原生 Node 模块安装复杂,通常需要 Visual Studio 和 node-gyp 进行编译;flun-windows **不依赖任何原生模块**,所有二进制工具均已预打包,无需安装 Visual Studio 等编译环境;

---

# Windows 服务管理

flun-windows 可将 Node.js 脚本转换为 Windows 服务;注意：创建服务需要管理员权限!!

基础示例：

```js
const { Service } = require('flun-windows');

// 创建服务对象
const svc = new Service({
  name: 'Hello World',
  description: 'nodejs.org 示例服务器',
  script: 'C:\\path\\to\\helloworld.js',
  nodeOptions: [
    '--harmony',
    '--max-old-space-size=4096'
  ]
  // ===== 其它可选配置 =====
  //, maxRetries: null             // 最大重试次数（默认null，表示忽略）
  //, maxRestarts: 3               // 60秒内最大重启次数（默认3）
  //, stoptimeout: 30              // 停止服务超时时间（秒，默认30）
  //, wait: 1                      // 重启等待时间（秒，默认1）
  //, scriptOptions: ''            // 传递给脚本的参数（默认空字符串）
  //, stopparentfirst: false       // 是否先停止父进程（默认false）
  //, abortOnError: false          // 遇到错误是否退出进程（默认false）
  //, grow: 0.25                   // 重启等待时间增长比例（默认0.25即25%）
  //, logpath: null                // 日志文件路径（默认null，使用默认路径）
  //, logmode: 'rotate'            // 日志模式（默认'rotate'）
  //, execPath: process.execPath   // Node.js可执行文件路径（默认当前Node）
  //, user: {}                     // 管理服务的用户凭据（默认空对象）
  //, logOnAs: {}                  // 服务运行的用户凭据（默认空对象）
  //, sudo: {}                     // 提升权限配置（默认空对象）
  //, env: undefined               // 环境变量（默认undefined）
  //, logging: null                // 日志配置（默认null）
  //, allowServiceLogon: undefined // 允许服务登录（默认undefined）
  //, workingDirectory: process.cwd() // 工作目录（默认当前目录）
});

// 监听安装完成事件
svc.on('install', ()=>{
  svc.start();
});

svc.install();
```

服务创建后可通过 Windows 服务管理器、`NET START/STOP` 或 `sc` 命令管理。

### 支持的事件

- _install_ - 服务安装完成
- _alreadyinstalled_ - 服务已存在
- _invalidinstallation_ - 安装文件不完整
- _uninstall_ - 卸载完成
- _alreadyuninstalled_ - 服务未安装
- _start_ - 服务启动
- _stop_ - 服务停止
- _error_ - 发生错误

### 脚本参数传递

通过 `scriptOptions` 配置：

```js
const { Service } = require('flun-windows');
const svc1 = new Service({
  ...,          // 基本配置略...
  scriptOptions: '-c C:\\config\\special.conf -i'
});
```

### 环境变量设置

```js
const { Service } = require('flun-windows');
const svc1 = new Service({
  ...,          // 基本配置略...
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
});

// 或多个变量
const svc2 = new Service({
  ...,          // 基本配置略...
  env: [{
    name: "HOME",
    value: process.env["USERPROFILE"]
  },{
    name: "TEMP",
    value: path.join(process.env["USERPROFILE"],"/temp")
  }]
});
```

### 指定 Node 执行路径

```js
const { Service } = require('flun-windows');
const svc = new Service({
  ...,          // 基本配置略...
  execPath: 'C:\\特定路径\\node.exe'
});
```

### 用户账户配置

```js
const { Service } = require('flun-windows');
const svc = new Service({
  ...,          // 基本配置略...
});
svc.logOnAs.domain = 'mydomain.local';
svc.logOnAs.account = 'username';
svc.logOnAs.password = 'password';

// 或使用 sudo 方式
svc.sudo.password = '当前用户密码';
```

### 服务卸载

```js
const { Service } = require('flun-windows');
const svc = new Service({
  ...,          // 基本配置略...
});
svc.on('uninstall', ()=>{
  console.log('卸载完成');
  console.log('服务是否存在：', svc.exists);
  // svc.exists 返回值说明：
  // 0: 服务和相关文件没有
  // 1: 服务已注册但相关文件不存在（异常情况）
  // 2: 服务未注册但相关文件存在（文件残留）
  // 3: 服务已注册且相关文件存在（正常状态）
});

svc.uninstall();
```

注：卸载仅移除服务相关文件，**不会删除您的 Node.js 脚本**;

### 智能重启机制

flun-windows 提供可配置的重启策略：

```js
const { Service } = require('flun-windows');
const svc = new Service({
  ...,          // 基本配置略...
  wait: 2,      // 初始等待时间（秒）
  grow: 0.5,    // 等待时间增长比例（50%）
  maxRetries: 5, // 最大重试次数
  maxRestarts: 3 // 60秒内最大重启次数
});
```

### 服务实现原理

使用 [winsw]为每个服务生成独立的 `.exe` 和 `.xml` 配置文件,存储在脚本所在目录的 `daemon` 子文件夹中;服务日志可通过 Windows 事件查看器查看;

---

# 事件日志系统

flun-windows 提供非 C++ 依赖的事件日志功能：

```js
const {EventLogger} = require('flun-windows');
const eLog1 = new EventLogger('服务名称');

eLog1.info('基本信息');
eLog1.warn('警告信息');
eLog1.error('错误信息');
eLog1.auditSuccess('审计成功');
eLog1.auditFailure('审计失败');

// 自定义事件代码
eLog1.error('特殊事件', 1002, ()=>{
  console.log('日志已写入');
});

// 使用 SYSTEM 日志
const eLog2 = new EventLogger({
  source: '自定义日志源名称',
  eventLog: 'SYSTEM'
});
```

---

# 系统命令工具

## elevate（权限提升）

```js
const win = require('flun-windows');
win.elevate('net start MyService', {}, (error, stdout, stderr)=>{
  // 回调处理
});
```

## sudo（管理员执行）

```js
const win = require('flun-windows');
win.sudo('net start MyService', '用户密码', {}, callback);
```

## 管理员权限检测

```js
const win = require('flun-windows');
win.isAdminUser(isAdmin=>{
   if (isAdmin) {
        console.log('当前用户是管理员');
    }
    else {
        console.log('当前用户不是管理员');
    }
});
```

## 进程列表

```js
const win = require('flun-windows');
win.list(processes=>{
  console.log(processes);
}, true); // true 显示详细信息
```

## 终止进程

```js
const win = require('flun-windows');
win.kill(进程PID, ()=>{
  console.log('进程已终止');
});
```

---

# 故障排除
- `invalidinstallation` 错误通常表示 daemon 目录文件不完整
- 卸载时若文件被锁定,可重新运行卸载或手动删除 `daemon` 目录

# 致谢!!!

感谢所有贡献者,特别感谢 @arthurblake、@hockeytim11 等开发者的贡献;

# 许可证

winsw 和 sudowin 遵循各自所有者的许可证;flun-windows 核心代码采用 ISC 许可证(具体内容请见许可证文档)

