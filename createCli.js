#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
let copy = require('recursive-copy');
const Enquirer = require('enquirer');

let log = {
    error: (str) => {
        console.log('\033[31m' + str + '\033[0m');
    },
    info: (str) => {
        console.log('\033[36m' + str + '\033[0m');
    },
    warn: (str) => {
        console.log('\033[34m' + str + '\033[0m');
    }
}

let staticFileArr = ['src', '.babelrc', 'App.js', 'build.config.js', 'config.json', 'package.temp.json', 'readme.md'];

function doCopyFile(targetFullPath, AppName) {
    log.info('开始生成');
    //检查路径是否存在
    let needCreateDic = false;  //是否需要创建目录
    let canDo = false;
    try {
        let stat = fs.statSync(targetFullPath);
        if (stat.isDirectory()) {  //如果是个目录的话
            //存在且是目录就需要检查是否为空
            let fileArr = fs.readdirSync(targetFullPath);
            if (fileArr.length > 0) {  //如果目录不是空的，不允许创建
                log.error('目录不为空，禁止创建');
                return false;
            } else {
                canDo = true;  //可以创建
            }
        } else {
            log.error('不是一个目录，请检查参数');
            return false;
        }
    } catch (error) {
        //到这里说明不存在
        needCreateDic = true;
    }
    //开始判断是否需要创建目录
    if (needCreateDic == true) {
        fs.mkdirSync(targetFullPath, () => { });
        canDo = true;
    }
    //判断是否可以创建
    if (canDo == false) {
        log.error('异常终止');
        return false;
    } else {
        let AppName = 'Koa-Test-Cli';
        let prompt = new Enquirer.Input({
            name: 'appname',
            message: 'Input your app name: (enter to skip)'
        });
        prompt.run()
            .then(
                answer => {
                    if (answer != undefined && answer.length != 0) { AppName = answer }
                    log.info('AppName: ' + AppName);
                    var packagejson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json')).toString());
                    //只保留必要的字段
                    packagejson.repository = undefined;
                    packagejson.bin = undefined;
                    packagejson.version = '1.0.0';
                    packagejson.bugs = undefined;
                    packagejson.name = AppName;
                    fs.writeFileSync(path.resolve(__dirname, './package.temp.json'), new Buffer.from(JSON.stringify(packagejson, null, 4)));
                    fs.writeFileSync(targetFullPath + '/' + '.gitignore', new Buffer.from('/node_modules/\n/dist/\n/logs/\n/package-lock.json'));
                    staticFileArr.map(i => {
                        let _i = i;
                        console.log(targetFullPath + '/' + _i);
                        copy(__dirname + '/' + _i, targetFullPath + '/' + (_i == 'package.temp.json' ? 'package.json' : _i), (error, results) => {
                            if (error) {
                                console.error('Copy failed: ' + error);
                            } else {
                                // console.info('Copied ' + results.length + ' files');
                            }
                        })
                    })
                    log.warn('生成完成, 请到相应目录下执行npm install, 并修改config.json相关配置以保证正常运行');
                }
            )
    }
}

//正则判断路径是否合法
let isFilePath = /^[a-zA-Z]:(((\\(?! )[^/:*?<>\""|\\]+)+\\?)|(\\)?)\s*$/g;
let isFilePathReg = new RegExp(isFilePath);

//获取当前执行指令的路径
let currentExecutionPath = process.cwd();
//获取当前执行指令后面的附加参数
const [nodePath, binFilePath, wishCreatePath] = process.argv;
//没传入参数的情况
if (wishCreatePath == undefined) {
    log.error('执行caven-koa-cli指令必须附加路径参数，如；caven-koa-cli test 或 caven-koa-cli test/a 或 caven-koa-cli .');
    return false;
} else if (wishCreatePath.indexOf('/') != -1) {
    log.error('执行caven-koa-cli指令附加的参数，不能以“/”开始或包含多级目录');
    return false;
} else if (wishCreatePath == '.') {
    let targetFullPath = currentExecutionPath;
    doCopyFile(targetFullPath);
} else if (typeof wishCreatePath == 'string') {
    let targetFullPath = path.resolve(currentExecutionPath, wishCreatePath);
    if (isFilePathReg.test(targetFullPath) == false) {
        log.error('路径名不合法');
        return false;
    } else {
        doCopyFile(targetFullPath);
    }
} else {
    log.error('执行caven-koa-cli指令必须附加路径参数，如；caven-koa-cli test 或 caven-koa-cli test/a 或 caven-koa-cli .');
    return false;
}
