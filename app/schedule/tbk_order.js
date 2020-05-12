const Subscription = require('egg').Subscription;
var moment = require('moment');

class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '100s', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }
    /**
     * 自动淘宝客渠道订单到mysql数据库      每1分钟查询前20分钟订单
     * @returns {Promise<void>}
     */
    async subscribe() {
        // moment.locale('zh-cn');
        // var start_time=moment().format('YYYY-MM-DD HH:mm:ss');
        // var end_time=moment().subtract(3,'hour').format('YYYY-MM-DD HH:mm:ss'); //前20分钟的订单
        // const result = await this.app.curl(
        //     `http://api.web.21ds.cn/taoke/tbkOrderDetailsGet?apkey=4c245fc1-6eaf-2548-3ffc-16e5dabdc03b&end_time=${start_time}&start_time=${end_time}&tbname=%E9%BA%BB%E9%92%A6%E5%BC%BA&order_scene=2`, {dataType: 'json',});
        //
        //
        // const resultdata= result.data.data.list
        //
        // // console.log(result.code == 200)
        //
        // if(result.code == 200 || result.data.data.list !== undefined){
        //     resultdata.forEach(async(item)=>{
        //         const data = {
        //             tb_paid_time:item.tb_paid_time,
        //             pay_price:item.pay_price,
        //             tk_order_role:item.tk_order_role,
        //             tk_earning_time:item.tk_earning_time,
        //             adzone_id:item.adzone_id,
        //             pub_share_rate:item.pub_share_rate,
        //             refund_tag:item.refund_tag,
        //             tk_total_rate:item.tk_total_rate,
        //             alimama_rate:item.alimama_rate,
        //             item_img:item.item_img,
        //             pub_share_pre_fee:item.pub_share_pre_fee,
        //             alipay_total_price:item.alipay_total_price,
        //             item_title:item.item_title,
        //             trade_parent_id:item.trade_parent_id,
        //             relation_id:item.relation_id,
        //         };
        //         const post = await this.app.mysql.get('tbk_tbkorderdetails', { trade_parent_id: data.trade_parent_id });
        //         const options = {
        //             where: {
        //                 trade_parent_id: data.trade_parent_id
        //             }
        //         };
        //         if(post){
        //             // console.log('此订单已存在,更新成功')
        //             await this.app.mysql.update('tbk_tbkorderdetails',data,options);
        //         }else{
        //             // console.log('此订单不存在,保存成功')
        //             this.app.mysql.insert('tbk_tbkorderdetails',data);
        //         }
        //     })
        // }else{
        //     return
        // }
    }
}

module.exports = UpdateCache;