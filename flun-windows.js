/**
 * @module flun-windows 模块入口文件
 * @description 提供Windows特定功能，如提升权限、事件日志记录和服务管理
 * @author Corey Butler
 */
const os = require('os'), { elevate, sudo, isAdminUser } = require('./lib/binaries'), { kill, list } = require('./lib/cmd'),
  Service = require('./lib/daemon'), EventLogger = require('./lib/eventlog');

// 平台检查
if (!os.platform().startsWith('win')) throw new Error('flun-windows 仅支持在Windows系统上运行');

// 统一导出(二进制调用器,命令行快捷方式,守护进程管理,事件日志记录)
module.exports = {
  elevate, sudo, isAdminUser, kill, list,
  Service, EventLogger
};