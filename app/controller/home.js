'use strict';
const Controller = require('egg').Controller;
const tbk = require('../middleware/tbk_api')
class HomeController extends Controller {
    /**
     * 物料精选{相似推荐,猜你喜欢}
     * https://open.taobao.com/api.htm?spm=a219a.7386797.0.0.1ea2669ak4NSUK&source=search&docId=33947&docType=2
      * @returns {Promise<void>}
     */
    async Optimus(ctx) {
        var params =
            {
                'adzone_id':'109983200394',
                'material_id':this.ctx.params.material_id,  //类ssasa目
                'page_size':10,
                'page_no':Number(this.ctx.params.min_ids) //当前页数
            };
        params.page_no += 1
        const material = await tbk.index('taobao.tbk.dg.optimus.material',params)
        material.min_id = params.page_no
        this.ctx.body = material;
    }

    /**
     * 商品详情
     * @returns {Promise<void>}
     * @constructor
     */
    async ItemInfo(){
        var params =
            {
                'num_iids':this.ctx.params.num_iids,

            };
        this.ctx.body = await tbk.index('taobao.tbk.item.info.get',params);
    }
    /**
     * 淘宝客-公用-淘口令生成
     * @returns {Promise<void>}
     * @constructor
     */
    async TpwdCreate(){
        var params =
            {
                'text':this.ctx.request.body.text,
                'url':this.ctx.request.body.url,
            };
        this.ctx.body = await tbk.index('taobao.tbk.tpwd.create',params);
    }

    /**
     * 淘宝客-推广者-物料搜索
     * @returns {Promise<void>}
     */
    async itemoptional(){
        // console.log(this.ctx.params)
        const params =
            {
                'adzone_id':"109983200394",
                'q':this.ctx.params.q,
                'page_no':this.ctx.params.page_no,
                'page_size':10

            };
        const data = await tbk.index('taobao.tbk.dg.material.optional',params);
        this.ctx.body = {
            data,
            code:12
        }


    }



}
module.exports = HomeController;










