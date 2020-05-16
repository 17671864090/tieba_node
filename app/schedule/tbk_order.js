const Subscription = require('egg').Subscription;
var moment = require('moment');
class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            cron: '0 59 23 * * *', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }
    /**
     * 自动淘宝客渠道订单到mysql数据库      每1分钟查询前20分钟订单
     * @returns {Promise<void>}
     */
    async subscribe() {
        const data = await this.app.mysql.query('SELECT * FROM `tbk_user` WHERE DATEDIFF(now(),Registrationdate) = 1')
        const data_log = {
            time:moment().locale('zh-cn').add(-1, 'd').format('YYYY-MM-DD'),
            createpeople:data.length
        }
        await this.app.mysql.insert('user_log', data_log);

        console.log('定时更新昨日注册人数成功' + moment().locale('zh-cn').format('YYYY-MM-DD'))
    }
}
module.exports = UpdateCache;




