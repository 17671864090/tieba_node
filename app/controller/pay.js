'use strict';
const AlipaySdk =require('alipay-sdk')
const fs =require('fs')
const alipaySdk = new AlipaySdk({
    // 参考下方 SDK 配置
    appId: '2019052065305527',
    privateKey: fs.readFileSync('./private-key.pem', 'ascii'),
});
const Controller = require('egg').Controller;
class PayController extends Controller {
    async index(ctx){
        const data = ctx.request.body
        try {
            const result = await alipaySdk.exec('alipay.trade.precreate', {
                notifyUrl: data.notify_url,
                bizContent:{
                    total_amount:data.Price, //订单总金额，单位为元，精确到小数点后两位   88.88
                    subject:data.subject,  //订单标题
                    out_trade_no:data.out_trade_no, //商户订单号,64个字符以内、只能包含字母、数字、下划线；需保证在商户端不重复
                }
            });
            console.log(result)
        }catch (e) {
            console.log(e)
        }
    }
}
module.exports = PayController;
