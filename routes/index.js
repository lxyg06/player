const express = require('express');
const router = express.Router();
const http = require('https');
const cheerio = require('cheerio');
/* GET home page. */
function listYp (url){
    return new Promise((r,e) => {
        http.get('https://www.360kan.com/'+url,hres => {
            const chunks = [];
            let size = 0;
            hres.on('data',function(chunk){   //监听事件 传输
                chunks.push(chunk);
                size += chunk.length;
            });
            hres.on('end',function(){  //数据传输完
                const data = Buffer.concat(chunks,size);
                const html = data.toString();
                const $ = cheerio.load(html); //cheerio模块开始处理 DOM处理
                const hy = [];
                const jobs_list = $("ul.list").find('.item');
                jobs_list.each((index,e) =>{
                    const a = $(e).find('a.js-tongjic')
                    const href ='/play?play='+ a.attr('href').replace('https://www.360kan.com','')
                    hy.push({ahref: href, imgsrc:a.find('img ').attr('src'), spabTitle: a.find('span.s1').text(), star:a.find('p.star').text(), score:a.find('span.s2').text(), spanhint:a.find('span.hint').text()})
                })
                r(hy)
            });
        })
    })
}
function indexHtml(){
    return new Promise((r,e) => {
        http.get('https://www.360kan.com/',hres => {
            const chunks = [];
            let size = 0;
            hres.on('data',function(chunk){   //监听事件 传输
                chunks.push(chunk);
                size += chunk.length;
            });
            hres.on('end',function(){  //数据传输完
                const data = Buffer.concat(chunks,size);
                const html = data.toString();
                const $ = cheerio.load(html); //cheerio模块开始处理 DOM处理
                const hy = [];
                const jobs_list = $(".b-topslider-item");
                jobs_list.each((index,e) =>{
                    const a = $(e).find('a.g-playicon')
                    const href ='/play?play='+ a.attr('href').replace('https://www.360kan.com','')
                    hy.push({ahref: href, imgsrc:a.find('img ').attr('src'), spab: a.find('span').text()})
                })
                r(hy)
            });
        })
    })
}
router.get('/', function(req, res, next) {
    Promise.all([
        indexHtml(),
        listYp('dianying/list'),
        listYp('dianshi/list'),
        listYp('zongyi/list'),
        listYp('dongman/list')
    ]).then(result => {
        res.render('index', {
            title: 'Express',
            hy:result[0],
            dianying:result[1],
            dianshi:result[2],
            zongyi:result[3],
            dongman:result[4]
        });
    })

});

module.exports = router;
