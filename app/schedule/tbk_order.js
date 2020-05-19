const Subscription = require('egg').Subscription;
const Crawler = require('crawler');
var moment = require('moment');
    class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            cron: '0 0 1 * * *', // 1 分钟间隔
            // interval: '5s', // 1 分钟间隔
            type: 'all',
        };
    }
    async subscribe() {
        const data = await this.app.mysql.query('SELECT * FROM `tbk_user` WHERE DATEDIFF(now(),Registrationdate) = 1')
        const data_log = {
            '日期':moment().locale('zh-cn').add(-1, 'd').format('YYYY-MM-DD'),
            '注册人数':data.length
        }
        await this.app.mysql.insert('user_log', data_log);

        console.log('定时更新昨日注册人数成功' + moment().locale('zh-cn').format('YYYY-MM-DD'))
        console.log(data)
    }







}
module.exports = UpdateCache;