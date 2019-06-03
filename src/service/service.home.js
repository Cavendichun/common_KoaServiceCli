import fs from 'fs';
import path from 'path';
import { HomeDao } from '../dao';

class HomeService {
    constructor(props) {
        this.props = props;
    }
    //帮助文档
    async help() {
        //过一遍所有的路由文件
        let res = [], pathList = [];
        fs.readdirSync(path.resolve(__dirname, '../routes')).filter(i => i.indexOf('.js') != -1).map(p => {
            let currentRoute = require(path.resolve(__dirname, '../routes', p));
            res.push(currentRoute.default);
        })
        //取出需要的数据
        res.map(i => {
            i.stack.map(s => {
                pathList.push({
                    path: s.path,
                    method: s.methods[s.methods.length - 1]
                })
            })
        })
        return pathList;
    }
    async help1() {
        let res = await HomeDao.example();
        return res;
    }
}

export default HomeService;
