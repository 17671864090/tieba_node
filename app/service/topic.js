const Service = require('egg').Service;
class TopicService extends Service {
    /*
     * 根据主题ID获取主题
     * @param {String} id 主题ID
     */
    async getTopicById(id) {
        const topic = await this.app.mysql.get('article',{id:id})
        if (!topic) {
            return {
                topic: null,
            };
        }
        return {
            topic
        };
    }
    incrementVisitCount(id) {
        return this.app.mysql.query(`update article set visit_count = visit_count + 1  where id = ${id}`);
    }
    /*
     * 获取全部文章
     * @param query
     * @returns {Promise<*>}
     */
    async getTopicsByQuery(query){
        if(Number(query.tab) == 1){
            var sql = `select * from article where status <> 1  order by Topplacement desc , createtime desc  limit 10 offset ${Number(query.page) * 10}`;
        }else{
            var sql = `select * from article where status <> 1 and checked = ${query.tab}    order by Topplacement desc , createtime desc  limit 10 offset ${Number(query.page) * 10}`;
        }
        const data = this.app.mysql.query(sql)

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
        return {
            data
        }
    }


    /*
     * 发表文章
     */
    async newAndSave(data){

    }
}
module.exports = TopicService;
