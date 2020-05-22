const Subscription = require('egg').Subscription;
var http = require('http');
const moment = require('moment');

class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '30m', //
            type: 'worker', //
        };
    }
    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        console.log('开始爬取')
        try {
            const result = await this.ctx.curl('https://www.weizan.cn/f/getarticlebottom?id=983978&MinisnsId=983978&pageIndex=4&typeId=0&h=0&hongbao=&wd=',
                {
                    headers:{
                        "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
                    },
                    dataType: 'json',
                });
            console.log()

            for(let i=0;i<result.data.ArtList.length;i++){
                const formData = result.data.ArtList[i]
                const data = {
                    content:formData.ContentDesc,
                    phone:null, //手机号
                    checked:0,
                    Topplacement:0,
                    status:0,
                    checked2:0,  //是否置顶
                    time:'',
                    out_trade_no:null,
                    py:1,
                    pyimgname:JSON.stringify(formData.Images) ? JSON.stringify(formData.Images) : [],
                    pyitemmp4:JSON.stringify(formData.Video) ? JSON.stringify(formData.Video) : [],
                    visit_count:0,
                    headportrait:formData.User.Headimgurl, //发帖人图片
                    // name:formData.User.NickName,  //发帖人名称
                    name:formData.User.NickName,  //发帖人名称

                    createtime:moment().add(-Math.random()*10, 'm').format("YYYY-MM-DD HH:mm:ss"),

                    platename:formData.ArticleTypeName ? formData.ArticleTypeName : "暂无" ,
                    userinfo:0
                }
                if(data.content){
                    const a = await this.app.mysql.insert('article',data);
                    console.log(data.content)
                }
            }
            console.log('执行成功')
        }catch (e) {
            console.log(e)
            console.log('执行失败')
        }

    }
}

module.exports = UpdateCache;




