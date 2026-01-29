const path = require('path'), bin = path.join(__dirname, '..', 'bin'), { exec } = require('child_process'),

  // 参数处理函数,用于标准化 options 和 callback 参数
  params = (options = {}, callback) => {
    callback = callback || function () { };
    if (typeof options === 'function') callback = options, options = {};
    if (typeof options !== 'object') throw '参数 options 无效。';
    return { options, callback };
  },

  /**
   * @method elevate
   * @member flun-windows
   * elevate 类似于 Linux/Mac 上的 `sudo`;它会尝试将当前用户的权限提升为本地管理员;
   * 使用此方法不需要密码,但要求当前用户具有管理员权限;
   * 若无管理员权限,命令将失败并返回 `access denied` 错误;
   *
   * 在启用了 UAC 的系统上,可能会提示用户是否允许继续：
   * 语法：`elevate(cmd[, options][, callback])`
   * @param {String} cmd 要使用提升权限执行的命令;可以是任何在命令行中输入的字符串;
   * @param {Object} [options]
   * 将传递给 `require('child_process').exec(cmd,<OPTIONS>,callback)` 的任何选项;
   * @param {Function} [callback]
   * 传递给 `require('child_process').exec(cmd,options,<CALLBACK>)` 的回调函数;
   */
  elevate = (cmd, options, callback) => {
    const p = params(options, callback);
    exec(`"${path.join(bin, 'elevate', 'elevate.cmd')}" ${cmd}`, p.options, p.callback);
  },

  /**
   * @method sudo
   * @member flun-windows
   * sudo 与 Linux/Mac 上的 `sudo` 类似;与 _elevate_ 不同,它需要密码,但不会提示用户确认;
   * 与 _elevate_ 一样,这 _仍要求用户具有管理员权限_,否则命令将失败;
   * 此方法与 _elevate()_ 的主要区别在于提示行为;
   *
   * 语法：`sudo(cmd, password[, options][, callback])`
   * @param {String} password 用户的密码
   * 其它参数同elevate方法...;
   */
  sudo = (cmd, password = '', options, callback) => {
    if (typeof password !== 'string') callback = options, options = password, password = '';

    const p = params(options, callback);
    exec(`${path.join(bin, 'sudowin', 'sudo.exe')} ${password !== '' ? `-p ${password}` : ''}${cmd}`, p.options, p.callback);
  }

module.exports = { elevate, sudo }