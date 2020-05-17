const Controller = require('egg').Controller;
const qiniu = require('qiniu');
const utility=require("utility"); //导入md5第三方库
const moment = require('moment');
class UsersController extends Controller {
     /**
     * 用户登录/注册
     * @param ctx
     * @returns {Promise<void>}
     */
    async signIn(ctx){
        let formData = ctx.request.body
        const data = {
            tbk_user_Username:formData.tbk_user_Username,
            tbk_user_Password:formData.tbk_user_Password,
            PostingNumber:2,
            headportrait:'head.jpg',
            name:formData.name,
            Registrationdate:moment().locale('zh-cn').format('YYYY-MM-DD'),
            invitation:formData.invitation ? formData.invitation : null,
            money:0
        }
        const token = this.app.jwt.sign({
            username: data.tbk_user_Username,
            password: data.tbk_user_Password,
        }, this.app.config.jwt.secret, {
            expiresIn: '36000s',
        })
        const admina = await this.app.mysql.get('tbk_user',
            {
                tbk_user_Username:data.tbk_user_Username,
            });
        if(admina){
            const adminaa = await this.app.mysql.get('tbk_user',
                {
                    tbk_user_Username:data.tbk_user_Username,
                    tbk_user_Password:data.tbk_user_Password,
                });
            if(!adminaa){
                this.ctx.body = {
                    status: 0,
                    success: '登录失败',
                }
            }else {
                this.ctx.body = {
                    status: 1,
                    success: '登录成功',
                    token
                }
            }
        }else{
            await this.app.mysql.insert('tbk_user',data);
            this.ctx.body = {
                status: 1,
                success: '注册成功',
                token
            }
        }
    }
    /**
     * 七牛云密钥
     * @param ctx
     * @returns {Promise<void>}
     */
    async img(ctx){
        var accessKey = 'PCiCEh3UirpL5nJq7NjsQYTP_8Bq0WHpS83PvIHn';
        var secretKey = '8I59Zfu3ZhCkkIc7m05AGIldMPuR-0m-1qxikQ73';
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var options = {
            scope: "tianba111",
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken=putPolicy.uploadToken(mac);
        this.ctx.body = {
            success:true, data:{token:uploadToken}
        }
    }
    /**
     * 更新用户信息
     * @param ctx
     * @returns {Promise<void>}
     * @constructor
     */
    async Userinformation(ctx){
        let token = ctx.headers.authorization;
        let sec2 = this.app.jwt.verify(token,this.app.config.jwt.secret)
        let formData = ctx.request.body
        const row = {
            name:formData.name,
            headportrait:formData.headportrait,
            phone:formData.phone
        };
        const optionss = {
            where: {
                tbk_user_Username: sec2.username
            }
        };
        await this.app.mysql.update('tbk_user', row, optionss);
    }
    /**
     * 文章上传
     * @param ctx
     * @returns {Promise<void>}
     */
    async release(ctx){
        try {
            let token = ctx.headers.authorization;
            let sec2 = this.app.jwt.verify(token,this.app.config.jwt.secret)
            let formData = ctx.request.body
            let idd = (new Date()).valueOf()
            const data = {
                content:formData.content, //文字内容
                imgname:JSON.stringify(formData.imgname), //图片
                mp4:JSON.stringify(formData.mp4), //视频
                phone:formData.phone, //手机号
                checked:formData.checked,
                Topplacement:formData.Topplacement,
                Toptime:formData.Toptime,  //置顶时间
                radio3:formData.radio3,
                status:1, //状态
                userinfo:sec2.username,
                checked2:formData.checked2,  //是否置顶
                time:'',
                out_trade_no:idd,
                visit_count:0,
                headportrait:formData.headportrait,
                name:formData.name,
                createtime:moment().format("YYYY-MM-DD HH:mm:ss"),
                platename:formData.platename,
            }

            var nowTime = new Date();

            console.log('a' + moment().format("YYYY-MM-DD HH:mm:ss"))


            console.log('b' + moment(nowTime).utc().format('YYYY-MM-DD HH:mm:ss'))

            console.log('c' + new Date())



            //判断是否免费发布
            if(formData.checked2!=0){
                const res = await this.app.mysql.get('ArticlePrice',
                    {
                        ReleaseType:formData.checked2,
                        radio3:formData.radio3,
                    });
                const info = await this.app.mysql.get('tbk_user',
                    {
                        tbk_user_Username:sec2.username,
                    });
                if(ctx.request.body.paytype == 'vippaytype'){
                    //扣除置顶次数
                    if(formData.checked2 ==1){
                        console.log('该文章为板块置顶发布')
                        if(info.Topping>0){
                            const roww = {
                                PostingNumber:Number(info.PostingNumber) - 1,
                                Topping:Number(info.Topping) - 1,
                            };
                            const optionss = {
                                where: {
                                    tbk_user_Username: sec2.username
                                }
                            };
                            await this.app.mysql.update('tbk_user', roww, optionss);
                            data.Toptime = moment().add(1, 'd').format("YYYY-MM-DD HH:mm:ss")  //置顶天数
                            data.Topplacement = formData.checked2  //是否置顶
                            data.status = 0
                            await this.app.mysql.insert('article',data);
                            this.ctx.body = {e:{status: 2,mas:'发布成功',}}
                        }else{
                            this.ctx.body = {e:{status: 1,mas:'免费置顶次数不足,请选择付费置顶',}}
                        }
                    } if(formData.checked2 ==2){
                        console.log('该文章为全站置顶发布')
                        if(info.AllTopping>0){
                            const row = {
                                PostingNumber:Number(info.PostingNumber) - 1,
                                AllTopping:Number(info.AllTopping) - 1,
                            };
                            const options = {
                                where: {
                                    tbk_user_Username: sec2.username
                                }
                            };
                            await this.app.mysql.update('tbk_user', row, options);
                            data.Toptime = moment().add(1, 'd').format("YYYY-MM-DD HH:mm:ss")  //置顶天数
                            data.Topplacement = formData.checked2  //是否置顶
                            data.status = 0
                            await this.app.mysql.insert('article',data);
                            this.ctx.body = {
                                e:{
                                    status: 2,mas:'发布成功',
                                }
                            }
                        }else{
                            this.ctx.body = {
                                e:{
                                    status: 1,mas:'免费置顶次数不足,请选择付费置顶',
                                }
                            }

                        }
                    }

                }else{
                    data.Toptime = res.Time   //置顶天数
                    data.Topplacement = formData.checked2  //是否置顶
                    data.status = 1
                    await this.app.mysql.insert('article',data);
                    await this.app.mysql.insert('tbk_order',
                        {
                            name:"发布文章",
                            price:Number(res.Price),
                            time:moment().format("YYYY-MM-DD HH:mm:ss"),
                            commodityid:452423335,
                            status:1, //1未支付
                            out_trade_no:idd,
                            typeId:data.radio3,

                        });
                    const e = await this.buy(res,formData.paytype,idd)
                    this.ctx.body = {
                        e
                    }
                }
            }else{
                data.Topplacement = 0
                data.status = 0
                data.time = moment().add(100, 'y').format("YYYY-MM-DD HH:mm:ss")
                await this.app.mysql.insert('article',data);
                const Info = await this.app.mysql.get('tbk_user', {tbk_user_Username:sec2.username});
                if(Info.PostingNumber > 0){
                    const row = {
                        PostingNumber:Info.PostingNumber - 1,
                    };
                    const options = {
                        where: {
                            tbk_user_Username: sec2.username
                        }
                    };
                    await this.app.mysql.update('tbk_user', row, options);
                    this.ctx.body = {
                        e:{status: 2}
                    }
                }else{
                    this.ctx.body = {
                        e:{status: 1,mas:'发帖次数不足',}
                    }
                }
            }
        }catch (e) {
            console.log(e)
            this.ctx.body = {
                status: 501,
                message:'系统出错'
            }
        }
    }
    /**
     * 获取用户基本信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async userinfo(ctx){
        try {
            const token = ctx.headers.authorization;
            const sec2 = this.app.jwt.verify(token,this.app.config.jwt.secret)
            const data = await this.app.mysql.query(`select *  from tbk_user where tbk_user_Username = ${sec2.username}`);


            const subordinate = await this.app.mysql.query(`select *  from tbk_user where invitation = ${sec2.username}`);


            const info = await this.app.mysql.query(`select *  from article where userinfo = ${sec2.username} order by createtime desc`);
            this.ctx.body = {
                data,
                info,
                subordinate
            }
        }catch (e) {
            console.log(e)
        }
    }
    /**
     * 获取文章
     * @param ctx
     * @returns {Promise<void>}
     */
    async topics(ctx){
        var data = await this.app.mysql.query(`select * from article where status <> 1 order by Topplacement desc , createtime desc  limit 10 offset ${Number(this.ctx.query.page) * 10}`);
        for (let i=0;i<data.length;i++){
                if(data[i].Toptime != null){
                    const AA = moment().format("YYYY-MM-DD HH:mm:ss");//当前时间
                    const BB = data[i].Toptime; //文章时间
                    const start_date = moment(AA,"YYYY-MM-DD HH:mm:ss");
                    const end_date = moment(BB,"YYYY-MM-DD HH:mm:ss");
                    const seconds = end_date.diff(start_date,"seconds");
                    if(seconds < 0){
                        data[i].Topplacement = 0
                        const row = {
                            Topplacement: data[i].Topplacement,
                            Toptime: null
                        };
                        const options = {
                            where: {
                                id: data[i].id
                            }
                        };
                        await this.app.mysql.update('article', row, options);
                    }
                }
            }




        this.ctx.body = {
            data
        }
    }
    async topicsitem(ctx){
        var data = await this.app.mysql.query(`select *  from article where id = ${ctx.params.id}`);

        const row = {
            visit_count: Number(data[0].visit_count) + 1,
        };
        const options = {
            where: {
                id: ctx.params.id
            }
        };
        await this.app.mysql.update('article', row, options);

        this.ctx.body = {
            data
        }
    }
    /**
     * 支付检测
     * @param ctx
     * @returns {Promise<void>}
     * @constructor
     */
    async BuyPost(ctx){
        let formData = ctx.request.body
        const result = await this.app.curl(`http://52ypay.com/api.php?act=order&pid=497886&key=2E5A92837C83E6AD4886F1157D02C586&out_trade_no=${formData.out_trade_no}`,{dataType: 'json',})
        if(result.data.code == 1 && result.data.status ==1){
            const admina = await this.app.mysql.get('tbk_order', {out_trade_no:formData.out_trade_no});
            await this.app.mysql.query(`update article  set status = 0  where out_trade_no = ${formData.out_trade_no}`);
            const data = await this.PayCallback(admina) //进入支付回调系统
            this.ctx.body = data
        }else{
            this.ctx.body = {
                status: 1,
                msg:"订单未支付,请重试"
            }
        }
    }
    /**
     * 支付回调系统
     */
    async PayCallback(data){
        const token = this.ctx.headers.authorization;
        const sec2 = this.app.jwt.verify(token,this.app.config.jwt.secret)
        const user = await this.app.mysql.get('tbk_user', {tbk_user_Username: sec2.username});

        console.log(user.invitation)

        if(data.superiorentry == 1){
            var price = (Number(user.Rechargequota))
        }else{
            await this.app.mysql.query(`update tbk_order  set superiorentry = 1  where out_trade_no = ${data.out_trade_no}`);
            await this.app.mysql.query(`update tbk_user  set money = money + 1  where tbk_user_Username = ${user.invitation}`);
            var price = (Number(user.Rechargequota) * 1000 + Number(data.price) * 1000)/1000
        }
        if(data.commodityid ==432423432){
            try{
                const db = await this.app.mysql.get('MemberSetmeal',{id:data.typeId});
                const row = {
                    Topping: db.Topping,   //板块指定
                    PostingNumber:db.PostingNumber,//发帖次数
                    AllTopping: db.AllTopping,//全站置顶
                    Advertisingspace: db.Advertisingspace,//广告位
                    Daymember:moment().add(Number(db.Time), 'd').format("YYYY-MM-DD HH:mm:ss"), //到期时间
                    Rechargequota:price
                };
                const options = {where: {tbk_user_Username: sec2.username}};
                await this.app.mysql.update('tbk_user', row, options);
                const res = {
                    status: 0,
                    msg:"开通成功",
                    url:'http://localhost:8089/?id=1',
                }
                return  res
            }catch (e) {
                console.log(e)
            }
        }
        if (data.commodityid ==452423335){
            const db = await this.app.mysql.get('article', {out_trade_no:data.out_trade_no});
            const row = {
                status: 0,
                Toptime:moment().add(Number(db.Toptime), 'd').format("YYYY-MM-DD HH:mm:ss")
            };
            const options = {where: {out_trade_no: data.out_trade_no}};
            await this.app.mysql.update('article', row, options); // 更新 posts 表中的记录
            const roww = {
                Rechargequota:price
            };
            const optionss = {where: {tbk_user_Username: sec2.username}
            };
            await this.app.mysql.update('tbk_user', roww, optionss);
            const res = {
                status: 0,
                msg:"开通成功",
                url:'http://localhost:8089/user',
            }
            return  res
        }
    }
    /**
     * 付费进入论坛
     * @param ctx
     * @returns {Promise<void>}
     * @constructor
     */
    async MemberBuy(ctx){
        const money = ctx.request.body[1]
        const admina = await this.app.mysql.get('menber', {id:money,});
        const d = admina.price
        let id = (new Date()).valueOf()
        const parameter ={
            price:Number(d),
            name:'开通论坛会员',
            paytype:'alipay',
            notify_url:'/api/admin/v1/MemberBuyPost',
            id:id
        }
        const data = await this.app.mysql.insert('tbk_order',
            {
                name:"论坛会费",
                price:Number(d),
                time:moment().format("YYYY-MM-DD HH:mm:ss"),
                commodityid:432423432,
                status:1, //1未支付
                out_trade_no:id,
                typeId:money
            });
        const res = await this.buyy(parameter)
        this.ctx.body = {
            status:1,
            payurl:res
        }
    }
    async MemberBuyPost(ctx){
        let formData = ctx.request.body
        const result = await this.app.curl(`http://pay.hackwl.cn/api.php?act=order&pid=23940&key=8yJ86Z4yu3o8NMyce6OepZxoNJXjK8NE&out_trade_no=${formData.out_trade_no}`,{dataType: 'json',})
        if(result.data.code == 1 && result.data.status ==1){
            //支付成功
            this.ctx.body = {
                status:1,
            }
        }
    }
    async Membertype(){
        const data = await this.app.mysql.select('menber');
        this.ctx.body = {
                data
        }
    }
    async buyy(parameter){
        let data={
            pid:"497886",
            money:parameter.price,
            name:parameter.name,
            notify_url:`http://localhost:8089/pay`,//异步通知地址
            out_trade_no:parameter.id, //订单号,自己生成。我是当前时间YYYYMMDDHHmmss再加上随机三位数
            return_url:"http://localhost:8089/pay",//跳转通知地址
            sitename:"网站名称",
            type:parameter.paytype,//支付方式:alipay:支付宝,wxpay:微信支付,qqpay:QQ钱包,tenpay:财付通,
        }
        //参数进行排序拼接字符串(非常重要)
        function  getVerifyParams(params) {
            var sPara = [];
            if(!params) return null;
            for(var key in params) {
                if((!params[key]) || key == "sign" || key == "sign_type") {
                    continue;
                };
                sPara.push([key, params[key]]);
            }
            sPara = sPara.sort();
            var prestr = '';
            for(var i2 = 0; i2 < sPara.length; i2++) {
                var obj = sPara[i2];
                if(i2 == sPara.length - 1) {
                    prestr = prestr + obj[0] + '=' + obj[1] + '';
                } else {
                    prestr = prestr + obj[0] + '=' + obj[1] + '&';
                }
            }
            return prestr;
        }
        //对参数进行排序，生成待签名字符串--(具体看支付宝)
        let str=getVerifyParams(data);
        let key="2E5A92837C83E6AD4886F1157D02C586";//密钥,易支付注册会提供pid和秘钥
        //MD5加密--进行签名
        let sign=utility.md5(str+key);//注意支付宝规定签名时:待签名字符串后要加key
        // 最后要将参数返回给前端，前端访问url发起支付
        let result =`http://52ypay.com/submit.php?${str}&sign=${sign}&sign_type=MD5`;
        console.log(data)
        return result
    }
    /**
     * 发布文章
     * @param res
     * @param paytype
     * @param idd
     * @returns {Promise<{result: string, out_trade_no: *, money: *, status: number}>}
     */
    async buy(res,paytype,idd){
        let data={
            pid:"497886",
            money:res.Price,
            name:"发布帖子",
            notify_url:"http://localhost:8089/pay",//异步通知地址
            out_trade_no:idd, //订单号,自己生成。我是当前时间YYYYMMDDHHmmss再加上随机三位数
            return_url:"http://localhost:8089/pay",//跳转通知地址
            sitename:"网站名称",
            type:paytype,//支付方式:alipay:支付宝,wxpay:微信支付,qqpay:QQ钱包,tenpay:财付通,
        }
        //参数进行排序拼接字符串(非常重要)
        function  getVerifyParams(params) {
            var sPara = [];
            if(!params) return null;
            for(var key in params) {
                if((!params[key]) || key == "sign" || key == "sign_type") {
                    continue;
                };
                sPara.push([key, params[key]]);
            }
            sPara = sPara.sort();
            var prestr = '';
            for(var i2 = 0; i2 < sPara.length; i2++) {
                var obj = sPara[i2];
                if(i2 == sPara.length - 1) {
                    prestr = prestr + obj[0] + '=' + obj[1] + '';
                } else {
                    prestr = prestr + obj[0] + '=' + obj[1] + '&';
                }
            }
            return prestr;
        }
        //对参数进行排序，生成待签名字符串--(具体看支付宝)
        let str=getVerifyParams(data);
        let key="2E5A92837C83E6AD4886F1157D02C586";//密钥,易支付注册会提供pid和秘钥
        //MD5加密--进行签名
        let sign=utility.md5(str+key);//注意支付宝规定签名时:待签名字符串后要加key
        // 最后要将参数返回给前端，前端访问url发起支付
        let result =`http://52ypay.com/submit.php?${str}&sign=${sign}&sign_type=MD5`;
        let datae = {
            result,
            money:res.Price,
            out_trade_no:data.out_trade_no,
            status: 0,
        }
        return datae
    }
}
module.exports = UsersController;
