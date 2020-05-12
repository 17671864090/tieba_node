const Controller = require('egg').Controller;
const tbk = require('../../middleware/tbk_api')
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
        const data = await this.app.mysql.query(`select * from tbk_order`);
        this.ctx.body = data
    }


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

}
module.exports = UsersController;
