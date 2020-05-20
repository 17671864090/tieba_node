const Controller = require('egg').Controller;
const moment = require('moment');
const mm = require('egg-mock');
const assert = require('assert');
class UsersController extends Controller {
    /**
     * 获取帖子
     * @returns {Promise<void>}
     * @constructor
     */
    async Postobtain(ctx){
        const data = await this.app.mysql.query(`select * from article`);
        this.ctx.body = data
    }
    /**
     * 获取用户
     * @returns {Promise<void>}
     * @constructor
     */
    async Userdata(ctx){
        const data = await this.app.mysql.query(`select * from tbk_user`);
        this.ctx.body = data
    }
    /**
     * 获取订单系统
     * @returns {Promise<void>}
     * @constructor
     */
    async Orederdata(ctx){
        // const data = await this.app.mysql.query(`select * from tbk_order`);
        const result = await this.app.curl('http://52ypay.com/api.php?act=orders&pid=497886&key=2E5A92837C83E6AD4886F1157D02C586', {
            dataType: 'json',
        });
        this.ctx.body = result.data.data
    }
    /**
     * 获取注册数
     * @param ctx
     * @returns {Promise<void>}
     */
    async Log(ctx){
        const result = await this.app.mysql.query(`select * from user_log  limit 31`);
        this.ctx.body = result
    }
    /**
     * 畅言单点登录
     * @param ctx
     * @returns {Promise<void>}
     */
    async logo(ctx){
        this.ctx.body = {
            is_login:1,
            "user": {
                "img_url": "http://s1.bdstatic.com/r/www/cache/xmas2012/images/car.png",
                "nickname": "访客",
                "profile_url": "http://www.baidu.com",
                "user_id": "42417",
                "sign":"werdfasdfasdf"
            }
        }
    }
    /**
     * 用户佣金提现
     * @returns {Promise<void>}
     * @constructor
     */
    async Withdrawalmoney(ctx){
        const formData = ctx.request.body
        const token = ctx.headers.authorization;
        const sec2 = this.app.jwt.verify(token,this.app.config.jwt.secret)
        const dataa = await this.app.mysql.get('tbk_user', {tbk_user_Username:sec2.username});
        await this.app.mysql.query(`update tbk_user set money = 0 where tbk_user_Username = ${sec2.username}`);
        const data = {
            name:formData.name,
            aliaccount:formData.account,
            money:dataa.money,
            status:1,
            time:moment().locale('zh-cn').format('YYYY-MM-DD'),
        }
        await this.app.mysql.insert('Withdrawalmoney', data);
        this.ctx.body = {
            msg:'提现申请成功,等待管理员审核'
        }
    }
    async GetWithdrawalmoney(){
        const data = await this.app.mysql.select('Withdrawalmoney');
        this.ctx.body = {
            data
        }
    }
    /**
     * 提现审核
     * @returns {Promise<void>}
     */
    async adoptmoneyApi(ctx){
        const formData = ctx.request.body
        const data = await this.app.mysql.query(`update Withdrawalmoney set status = 0 where id = ${formData.id}`);
        this.ctx.body = {
            data
        }
    }
    async adminLogin(ctx){

        let formData = ctx.request.body

        const admina = await this.app.mysql.get('tbk_admin_user',
            {
                tbk_admin_Username:formData.username,
                tbk_admin_Password:formData.password,
            });
        if(admina){
            const token = this.app.jwt.sign({
                username: formData.username,
                password: formData.username,
            }, this.app.config.jwt.secret, {
                expiresIn: '36000s',
            })
            this.ctx.body = {
                status: 0,
                token,
                user:admina.tbk_admin_Username
            }
        }else{
            this.ctx.body = {
                status: 1,
                msg:'密码错误'
            }
        }
    }


    async schedule(ctx){
        console.log('执行定时任务')

        await this.ctx.app.runSchedule('visitUrl');
        // await this.ctx.app.runSchedule('liulanliang');

    }
}
module.exports = UsersController;
