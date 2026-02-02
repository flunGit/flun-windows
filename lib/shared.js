// 引入必要的Node.js内置模块
const { exec, execSync, fork } = require('child_process'), { promisify } = require('util'), domain = process.env.COMPUTERNAME,
    path = require('path'), fs = require('fs'), net = require('net'), { EventEmitter } = require('events');

/**
 * 检查错误是否为权限不足的错误
 * @param {string|Error} error - 错误信息或错误对象
 * @returns {boolean} 是否为权限错误
 */
function isPermissionError(error) {
    const errorMessage = error?.message || error?.toString() || String(error),
        permissionErrors = ['拒绝访问', 'Access is denied', '权限不足', 'Insufficient privileges', 'AccessDenied', '需要提升权限',
            'requires elevation', 'Administrator', 'admin', '权限被拒绝'],
        lowerMessage = errorMessage.toLowerCase();
    return permissionErrors.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
}

// 统一导出
module.exports = { exec, execSync, fork, promisify, path, fs, net, EventEmitter, isPermissionError };