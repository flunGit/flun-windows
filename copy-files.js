const fs = require('fs').promises, path = require('path'),

    // 要复制的文件位置和文件目标位置
    packageDir = __dirname, targetDir = path.resolve(packageDir, '../..'),

    // 要拷贝的文件和目标文件路径
    sourceFile = path.join(packageDir, 'sevWin.js'), targetFile = path.join(targetDir, 'sevWin.js');

async function copyFile() {
    try {
        await fs.access(sourceFile);

        // 检查目标文件是否已存在
        try {
            await fs.access(targetFile), console.log(`⏭️  目标文件已存在，跳过复制: ${targetFile}`);
            return;
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;  // 如果不是"文件不存在"的错误，则抛出
        }

        // 复制文件
        await fs.copyFile(sourceFile, targetFile), console.log(`✅ 成功复制文件: ${sourceFile} -> ${targetFile}`);
    } catch (error) {
        if (error.code === 'ENOENT') console.error(`❌ 源文件不存在: ${sourceFile}`);
        else console.error(`❌ 复制文件失败:`, error.message);
    }
}

copyFile();