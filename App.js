import fs from 'fs';
import path from 'path';
import MainServer from './src/index';
//加载配置文件
const { SERVER_MODE, APP_CONFIG, MYSQL_CONFIG, WRITE_LOG } = JSON.parse(fs.readFileSync(path.resolve(__dirname, './config.json')).toString());
//设置环境变量，DEV, PRODUCT, ONLINE
process.env.NODE_ENV = SERVER_MODE;
//是否记录错误日志
process.env.WRITE_LOG = WRITE_LOG;
//各种启动前的准备工作，写在这......
//
//启动服务
const main_server = new MainServer({
    app_config: APP_CONFIG,
    mysql_config: MYSQL_CONFIG
});
main_server.startServer()
