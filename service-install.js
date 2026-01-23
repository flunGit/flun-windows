const { Service } = require('node-windows');

const serviceName = 'NodeApp';
const scriptPath = 'D:\\服务器\\NodeApp\\index.js';

console.log('正在检查服务状态...');

const svc = new Service({
	name: serviceName,
	description: 'Node.js 开发服务器',
	script: scriptPath,
	nodeOptions: [
		'--harmony',
		'--max_old_space_size=4096'
	],
	env: {
		name: "NODE_ENV",
		value: "production"
	}
});

// 检查服务是否存在
svc.exists((error, exists) => {
	if (error) {
		console.error('检查服务时出错:', error);
		return;
	}

	if (exists) {
		console.log('✅ 服务已存在，跳过安装');
		// 检查服务状态
		svc.status((error, status) => {
			if (!error) console.log(`服务状态: ${status}`);
		});
	} else {
		console.log('🔄 服务不存在，开始安装...');
		installService();
	}
});

function installService() {
	svc.on('install', () => {
		console.log('✅ 服务安装成功');
		svc.start();
	});

	svc.on('start', () => {
		console.log('✅ 服务启动成功');
	});

	svc.on('error', (err) => {
		console.error('❌ 错误:', err.message || err);
	});

	svc.on('alreadyinstalled', () => {
		console.log('⚠️ 检测到已安装记录，尝试卸载后重装...');
		svc.uninstall();

		svc.on('uninstall', () => {
			console.log('🗑️ 旧记录已清理，重新安装...');
			installService();
		});
	});

	console.log('🚀 开始安装服务...');
	svc.install();
}