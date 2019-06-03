var fs = require('fs');
var path = require('path');

//复制配置文件
var configjson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './config.json')).toString());
//设为online模式，默认写错误日志
configjson.SERVER_MODE = 'ONLINE';
configjson.WRITE_LOG = true;
//写入文件
fs.writeFileSync('./dist/config.json', new Buffer.from(JSON.stringify(configjson, null, 4)));

//读取package.json
var packagejson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json')).toString());
//只保留必要的字段
packagejson.scripts = { start: 'node App.js' };
packagejson.repository = undefined;
packagejson.bugs = undefined;
packagejson.homepage = undefined;
packagejson.devDependencies = undefined;
//写入文件
fs.writeFileSync('./dist/package.json', new Buffer.from(JSON.stringify(packagejson, null, 4)));

console.log('build finished !');
