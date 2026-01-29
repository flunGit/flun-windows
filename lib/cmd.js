const { exec } = require('child_process'), bin = require('./binaries'),

  /**
     * @method isAdminUser 此异步命令用于判断当前用户是否拥有管理员权限;
     * @member flun-windows
     * 它会向回调函数传递一个布尔值,如果用户是管理员则返回 `true`,否则返回 `false`;
     * @param {Function} callback
     * @param {Boolean} callback.isAdmin 回调函数接收 true/false 作为参数;
     */
  isAdminUser = callback => {
    exec('NET SESSION', (err, so, se) => {
      if (se.length !== 0) bin.elevate('NET SESSION', (_err, _so, _se) => callback(_se.length === 0));
      else callback(true);
    });
  },

  /**
   * @method kill 结束指定进程
   * @member flun-windows
   * @param {Number} PID 进程ID
   * @param {Boolean} [force=false] 是否强制结束进程。
   * @param {Function} [callback]
   */
  kill = (pid, force, callback) => {
    if (!pid) throw new Error('PID是kill操作必需的参数。');
    if (typeof isNaN(pid)) throw new Error('PID必须为数字。');

    callback = callback || function () { };
    if (typeof force == 'function') callback = force, force = false;
    exec(`taskkill /PID ${pid}${force == true ? ' /f' : ''}`, callback);
  },

  /**
   * @method list 列出服务器上正在运行的进程
   * @member flun-windows
   * @param {Function} callback 接收进程对象作为唯一的回调参数
   * @param {Boolean} [verbose=false] 是否显示详细信息
   */
  list = (callback, verbose = false) => {
    exec(`tasklist /FO CSV${verbose ? ' /V' : ''}`, (err, stdout, stderr) => {
      const lines = stdout.split('\r\n'), processes = [],
        commaQuoteRegex = /",/g, quoteRegex = /['"]/g, whitespaceRegex = /\s/g; // 预编译正则表达式(匹配 CSV 格式)
      let headers = null;
      for (const line of lines.slice(1, -1)) {
        if (!line.trim()) continue;  // 跳过空行
        // 替换 CSV 中的字段分隔符,移除所有引号
        let record = line.replace(commaQuoteRegex, '";').replace(quoteRegex, '').split(';');
        if (!headers) headers = record.map(header => header.replace(whitespaceRegex, ''));
        else {
          const processObj = {};
          record.forEach((value, index) => processObj[headers[index]] = value.replace(quoteRegex, ''));
          processes.push(processObj);
        }
      }
      callback(processes);
    });
  }
module.exports = { isAdminUser, kill, list };