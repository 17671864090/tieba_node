const Subscription = require('egg').Subscription;
var http = require('http');
const moment = require('moment');

class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '1m', //
            type: 'worker', // 指定所有的 worker 都需要执行
        };
    }
    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        console.log('开始执行')
        const pp = await this.app.mysql.select('article');
        for(let i=0;i<pp.length;i++){
            function randomNum(minNum,maxNum){
                switch(arguments.length){
                    case 1:
                        return parseInt(Math.random()*minNum+1,10);
                        break;
                    case 2:
                        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                        break;
                    default:
                        return 0;
                        break;
                }
            }
            const nuber = randomNum(10,30)
            const data = await this.app.mysql.query(`update article set  visit_count = visit_count + ${nuber}  where id = ${pp[i].id}`);
        }
    }
}

module.exports = UpdateCache;




