//此文件用来注册中间件，并加载路由
import fs from 'fs';
import path from 'path';
import compose from 'koa-compose';
import bodyparser from 'koa-bodyparser';
import koaSession from 'koa-session';
import MiddleWares from './middlewares';
import koaTimeout from 'koa-timeout-v2';

class MiddleRegister {
    constructor(props) {
        this.target = props.target
    }

    //注册路由中间件
    createRoutesCompose() {
        let res = [];
        fs.readdirSync(path.resolve(__dirname, 'routes')).filter(i => i.indexOf('.js') != -1).map(p => {
            let currentRoute = require(path.resolve(__dirname, 'routes', p));
            res.push(currentRoute.default.routes()), res.push(currentRoute.default.allowedMethods());
        })
        //组合所有路由
        return compose(res);
    }

    //排列中间件
    middleRegister() {
        const timeout = koaTimeout(1000, {
            callback: () => {
                console.log('Request Timeout');
            }
        });
        let sessionConfig = {
            key: 'koa:sess',
            maxAge: 7200000,
            overwrite: true,
            httpOnly: true,
            signed: true
        }
        this.target.keys = ['some secret hurr'];
        this.target
            .use(MiddleWares.logger.request)
            .use(timeout)
            .use(MiddleWares.catchError)
            .use(koaSession(sessionConfig, this.target))
            .use(bodyparser())
            .use(this.createRoutesCompose())
            .use(MiddleWares.wrapResult)
            .use(MiddleWares.logger.response)
    }
}

export default MiddleRegister;
