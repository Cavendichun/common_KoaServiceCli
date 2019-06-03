import Router from 'koa-router';

//统一method写法
const MethodMap = {
    GET: 'get',
    POST: 'post'
}

//用来装饰每个request
export function Request({ url, method, sessionRequired }) {
    return function (target, name, descriptor) {
        let callback = descriptor.value;
        //转换成koa-router的基本方法 例如router.get
        descriptor.value = (router) => {
            //MethodMap中未定义method, 则使用get
            router[MethodMap[method.toUpperCase()] || 'get'](url, async (ctx, next) => {
                if (sessionRequired && ctx.session.userid == undefined) throw 4007  //如果指定了sessionRequired: true， 保证传进service的userid都是有值的, 不管对错
                await callback(ctx, next);
            })
        }
    }
}

//组合每个路由文件中所有的路由方法
export const Combine = ({ prefix } = {}) => {
    //分别实例router,避免混淆
    const router = new Router();
    if (prefix) {  //路由前缀
        router.prefix(prefix)
    }
    return function (target) {
        //获取所有类属性
        let requestList = Object.getOwnPropertyDescriptors(target.prototype);
        Object.keys(requestList).map(i => {
            //排除构造函数
            if (i !== 'constructor') {
                //把当前router带入实例
                requestList[i].value(router);
            }
        })
        return router;
    }
}
