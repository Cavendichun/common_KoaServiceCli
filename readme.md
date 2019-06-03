#Node.js Koa Service Cli

------
##一.安装与运行
> * npm install
> * npm start

##二.编译
> * npm run dist
会在dist文件夹下生成转译好的文件，结构相同，复制并进入此文件夹并执行 npm install 然后执行 npm start 即可

##三.代码结构
> * 1.config.json
项目启动的相关配置

    {
        "SERVER_MODE": "DEV",  //当前运行模式，dist后自动变为ONLINE
        "WRITE_LOG": false,  //是否记录异常日志， dist后自动变为true
        "APP_CONFIG": {
            "LISTEN_PORT": 3000  //监听端口号，默认3000
        },
        "MYSQL_CONFIG": {  //mysql相关配置
            "HOST": "127.0.0.1",
            "PORT": 3306,
            "USER": "aaa",
            "PASSWORD": "aaaaaaa",
            "DATABASE": "aaaaaaa"
        }
    }
        

> * 2.build.config.js 

项目打包的相关设置

> * 3.App.js

项目入口文件，可以在此文件做启动前的准备工作，实例化忘之前可以传入相关的props

> * 4.src

文件夹分为routes（路由层）、service（服务层）、dao（数据层）、 middles（中间件）和 utils（公共方法）

单独文件分为：
>errCodes.js 所有期望人为抛出的异常码，在这里定义

>index.js 定义service的class，一般不需要变动

>middle.register.js 将中间件文件夹里的中间件进行排列组合

>routeDistribute.js 实现Request和Combine路由的装饰器、不需要变动


##四.新增路由（无需再其他文件中引用，已经动态引用）

>在routes文件夹，新建或修改路由文件，使用Combine装饰器组合路由，接受的参数是 prefix，即指定一级路由，如 prefix: '/home', 就会在该文件所有路由url前添加 /home

>新建路由方法，使用Request装饰器，接受的参数是 url 和 method， 路由方法采用async函数形式，例如

    @Request({ url: '/', method: 'GET' })
    async homePage(ctx, next) {
        ctx.response.no_wrapper = true;
        ctx.response.body = '<h1>INDEX</h1>';
        await next();
    }
    
##五.新增service

>在service文件夹中，新建或修改service文件，并在index中引用并实例化，然后暴露，方法均采用async/await

##五.新增dao

>在dao文件夹中，新建或修改dao文件，并在index中引用并实例化，实例化汇集收一个query的props，可在dao文件中通过this.props.Query来调用，用途是执行sql语句，dao方法均采用await/async

##六.新增中间件

>再middlewares文件夹中，根据需要新建中间件（纯async函数），并在需要的地方引用
