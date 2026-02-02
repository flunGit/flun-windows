const fs = require('fs').promises, path = require('path'),

    // 要复制的文件位置和文件目标位置
    packageDir = __dirname, targetDir = path.resolve(packageDir, '../..'),

    // 要拷贝的文件和目标文件路径
    sourceFile = path.join(packageDir, 'sevWin.js'), targetFile = path.join(targetDir, 'sevWin.js');

function copyFile() {
    console.log('🔍 检查 sevWin.js 文件...'), console.log(`📁 项目根目录:${projectRoot}`);
    try {
        if (fs.existsSync(targetFile)) return true;  // 如果存在sevWin.js文件，则返回true并结束函数
        console.log('⚠️ 在项目根目录未找到 sevWin.js 文件，正在创建...');

        fs.copyFileSync(sourceFile, targetFile);     // 复制sevWin.js文件到项目根目录
        console.log(`✓ 已创建 sevWin.js 示例文件:${targetFile}`);
        return true;
    } catch (error) {
        console.error('✗ 创建 sevWin.js 文件失败:', error.message);
        return false;
    }
}

// 执行脚本并导出函数
if (require.main === module) copyFile();
module.exports = { copyFile };