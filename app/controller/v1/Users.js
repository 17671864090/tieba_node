const Controller = require('egg').Controller;
const tbk = require('../../middleware/tbk_api')
class UsersController extends Controller {
    /**
     * 淘宝客用户登录/注册
     * @param ctx
     * @returns {Promise<void>}
     */
    async signIn(ctx){
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
        let formData = ctx.request.body
        const data = {
            tbk_user_Username:formData.tbk_user_Username,
            tbk_user_Password:formData.tbk_user_Password,
            tbk_user_invitation:randomNum(1111,9999),
            tbk_parent_id:formData.tbk_parent_id ? formData.tbk_parent_id : 0,
            Identificationcode:0    //默认为粉丝
        }
        const admin = await this.app.mysql.get('tbk_user', {tbk_user_Username:data.tbk_user_Username});
        if(!admin){
            await this.app.mysql.insert('tbk_user',data);
            this.relations({Username:data.tbk_user_Username},{tbk_parent_id:data.tbk_parent_id})
            console.log('注册管理员成功');
            this.ctx.body = {
                status: 1,
                success: '注册管理员成功'
            }
        }else{
            const admina = await this.app.mysql.get('tbk_user',
                {
                    tbk_user_Username:data.tbk_user_Username,
                    tbk_user_Password:data.tbk_user_Password,
                });

            const agent = await this.app.mysql.get('tbk_user_agent',
                {
                    Identificationcode:admina.Identificationcode,
                });
            if(admina){
                console.log('管理员登录密码正确');
                this.ctx.body = {
                    status: 1,
                    success: '登录成功',
                    userId:data.tbk_user_Username,
                    tbk_relation_id:admina.tbk_relation_id,
                    agent
                }
            }else{
                console.log('管理员登录密码错误');
                this.ctx.body = {
                    status: 1,
                    success: '密码错误'
                }
            }
        }
    }
    /**
     * 个人信息查询
     * @param ctx
     * @returns {Promise<void>}
     */
    async userfind(ctx){
        const id = 17671864090
        const admina = await this.app.mysql.get('tbk_user',
            {
                tbk_user_Username:id,
            });
        console.log(admina)
        const agent = await this.app.mysql.get('tbk_user_agent', {Identificationcode:admina.Identificationcode,});
        this.ctx.body = {
            status:1,
            admina,
            agent
        }
    }
    async relations(Username,tbk_parent_id){
        await this.app.mysql.insert('tbk_user_relations',{Userid:Username.Username,Pid:tbk_parent_id.tbk_parent_id});
    }
    /***
     * 订单查询  根据渠道id查询   全部订单
     * @returns {Promise<void>}
     */
    async tbk_OrderUser(ctx){
        const relationId = ctx.params.relationId
        const tk_status = ctx.params.tk_status
        if(tk_status == 0){
            const data = await this.app.mysql.select('tbk_tbkorderdetails',{
                where:{
                    relation_id:relationId
                }
            });
            ctx.body = {
                status:1,
                data
            }
        }else{
            const data = await this.app.mysql.select('tbk_tbkorderdetails',{
                where:{
                    relation_id:relationId,tk_status:tk_status
                }
            });
            ctx.body = {
                status:1,
                data
            }
        }
    }
    /***
     * 渠道管理绑定
     * @returns {Promise<void>}
     */
    async tbk_users(){
        const data = {
            account_name: this.ctx.query.account_name,
            relation_id: this.ctx.query.relation_id,
            userid:this.ctx.query.custompar,
        }
        const row = {
            tbk_relation_id: data.relation_id,
        };
        const options = {
            where: {
                tbk_user_Username: this.ctx.query.custompar
            }
        };
        const result = await this.app.mysql.update('tbk_user', row, options);
        console.log(result)
    }
    /**
     * 淘宝快速登陆
     * @returns {Promise<void>}
     */
    async user_reg(){
        // const result = await this.ctx.curl('https://oauth.taobao.com/token',{
        //     method: 'POST',
        //     data:{
        //         grant_type:"authorization_code",
        //         client_id: "28305940",
        //         client_secret: '9a99941ae4d14ca7578a8cc7a03bac05',
        //         code: this.ctx.query.code,
        //         redirect_uri: 'http://127.0.0.1:7001/api/v1/user_tb',
        //     },
        //     dataType: 'json',
        // });
        // const data ={
        //     taobao_user_id:result.data.taobao_user_id,
        //     taobao_user_nick:decodeURIComponent(`${result.data.taobao_user_nick}`)
        // }
        // this.ctx.body =   result.data.taobao_user_id
    }
}
module.exports = UsersController;
