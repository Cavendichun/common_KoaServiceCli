import fs from 'fs';
import path from 'path';
import errorCodes from '../errorCodes';

//对所有认为抛出的错误码进行封装，｛ code: xxx, msg: xxx ｝
const catchError = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        if (typeof error == 'number') {  //正常的主动reject或throw的错误，error为错误码
            const errMsg = errorCodes[error] || '未知错误';
            ctx.response.body = {
                code: error,
                msg: errMsg
            }
            console.log(`---out--->  Catch Error ${JSON.stringify(ctx.response.body)}`);
            ctx.status = 200;
        } else {   //不可预知的代码错误， error未知
            console.log(error);
            //如果需要写日志
            if (process.env.WRITE_LOG == 'true') {
                writeErrorLog(ctx.request, error)
            }
            ctx.status = 500;
        }
    }
}

//process.env.WRITE_LOG == 'true'时， 记录日志
const writeErrorLog = (request, error) => {
    if (!process.env.WRITE_LOG) return;
    //是否存在logs文件夹，没有则创建
    let logsDirPath = path.resolve(__dirname, '../../logs');
    if (!fs.existsSync(logsDirPath)) {
        fs.mkdirSync(logsDirPath);
    }
    //以当天日期作为文件名，没有则创建，有则继续写入
    let logFilePath = path.resolve(__dirname, '../../logs/', new Date().toLocaleDateString().replace(/\//g, '-') + '.log');
    const { url, method } = request;
    //要写入的错误
    let errorWrite = `TIME: ${new Date().toLocaleString().replace(/\//g, '-')}\nURL: ${url}\nMETHOD: ${method}\nERROR: ${error}\n\n`;
    if (fs.existsSync(logFilePath)) {
        //如果已有当天文件
        fs.appendFile(logFilePath, errorWrite, (err) => {
            if (!err) { console.log('错误已记录！') }
        })
    } else {
        //当天还没有文件
        fs.writeFile(logFilePath, new Buffer.from(errorWrite), (err) => {
            if (!err) { console.log('错误已记录！') }
        });
    }
}

export default catchError;
