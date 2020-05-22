'use strict';

const Controller = require('egg').Controller;

class TopicController extends Controller {
    async index(ctx){
        const page = ctx.query.page;
        const tab = ctx.query.tab ? ctx.query.tab : 'all';
        const query = {
            page,
            tab
        }
        let topics = await ctx.service.topic.getTopicsByQuery(query)
        ctx.body = {
            success: true,
            data: topics,
        };
    }
    async show(ctx) {
        const topic_id = String(ctx.params.id);
        let  topic   = await ctx.service.topic.getTopicById(topic_id);
        // 增加 visit_count
        topic.topic.visit_count += 1
        // 写入 mysql
        await ctx.service.topic.incrementVisitCount(topic_id);
        if (!topic.topic) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                error_msg: '此话题不存在或已被删除',
            };
            return;
        }
        ctx.body = {
            success: true,
            data:topic
        }
    }

    /**
     * 发表文章
     * @param ctx
     * @returns {Promise<void>}
     */
    async put(ctx){
        const body = ctx.request.body;
        // 储存新主题帖
        const topic = await service.topic.newAndSave(body);
    }
    

}

module.exports = TopicController;
