const { Service } = require('flun-windows');

const serviceName = 'TestApp', scriptPath = 'D:\\test\\dev.js',
	svc = new Service({
		name: serviceName,
		description: 'Node.js 开发服务器',
		script: scriptPath,
		nodeOptions: ['--harmony', '--max-old-space-size=4096'],
		env: { name: "NODE_ENV", value: "production" }
	});

installService();
function installService() {
	console.log('🚀 开始安装服务...');
	svc.on('install', () => svc.start());
	svc.on('start', () => console.log('✅ 安装成功,服务已启动!!'));
	svc.install();
}