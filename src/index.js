import koa from 'koa';
import { createConnectionPool } from './utils/mysql';
import MiddleRegister from './middle.register';

class MainServer {
    constructor(props = {}) {
        this.props = props;
    }

    startServer() {
        const { app_config } = this.props;
        if (!app_config) {
            console.error("实例化MainServer必须传入app_config");
            return;
        }
        this.createServer(app_config);
    }

    addMiddleWare() {  //组合中间件
        new MiddleRegister({ target: this.server }).middleRegister();
    }

    async createServer(app_config) {
        const { LISTEN_PORT } = app_config;
        this.server = new koa();
        //使用中间件
        this.addMiddleWare();
        //建立mysql连接池
        await createConnectionPool(this.props.mysql_config);
        //监听端口
        this.server.listen(LISTEN_PORT, (err) => {
            if (err) { console.log(err) }
            else { console.log(`启动成功，监听端口 ${LISTEN_PORT}`) }
        })
    }
}

export default MainServer;
