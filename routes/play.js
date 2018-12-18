var express = require('express');
var router = express.Router();
const http = require('https');
const cheerio = require('cheerio');
/* GET users listing. */
router.get('/', function(req, res, next) {
    const url = req.query.play
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
            const jj = $('#js-desc-switch').html();
            const title = $('.title-left').find('h1').text();
            if(url.indexOf('/m/')!=-1){
                const id = url.replace("/m/","").replace(".html","")
                const cs = html.match(/<a data-daochu="to=.*?" class=".+?s-site.+?ea-site ea-site-.+?" href=".*?">.+?<\/a>/g);
                res.render('play', { jj:jj,hy:'<div class="num-tab-main g-clear">'+cs.join('')+'</div>',title:title,id: id,category:1 });
            }else  if(url.indexOf('/tv/')!=-1){
                const id = url.replace("/tv/","").replace(".html","")
                let tvzz = html.match(/<div class="num-tab-main g-clear\s*js-tab"\s*(style="display:none;")?>[\s\S]+?<a data-num="(.*?)" data-daochu="to=(.*?)" href="(.*?)">[\s\S]+?<\/div>/g)
                if(!tvzz){
                    tvzz = '<div class="num-tab-main g-clear ">'+html.match(/<a data-num="(.*?)" data-daochu="to=(.*?)" href="(.*?)">/g)[0]+'</div>';
                }else{
                    tvzz = tvzz[0].replace('<a target="_self" class="all js-show-init" href="#" title="收起">收起</a>','').replace('style="display:none;"','')
                }

                res.render('play', {jj:jj,hy:tvzz,title:title,menu: html.match(/\{"ensite":"(.*?)","cnsite":"(.*?)","vip":(.*?)\}/g),id: id,category:2});
            }else if(url.indexOf('/va/')!=-1){
                const id = url.replace("/va/","").replace(".html","")
                const cs = $('.js-juji-content');
                cs.find('.juji-year-list').css('display','none')
                cs.find('.jump-more-juji').remove();
                cs.find('.juji-page').remove();
                cs.find('.w-newfigure-list').css('display','block')
                res.render('play', { jj:jj,hy:cs,title:title,category:3,id: id });
            } else if(url.indexOf('/ct/')!=-1) {
                const id = url.replace("/ct/","").replace(".html","")
                let cs = $('.js-series-all');
                if(cs.length==0){
                    cs = $('.m-series-number-container');
                }
                cs.css('display','block');
                cs.find('.js-slice-series-slide').remove();
                cs.find('.series-slice-view').css('display','block')
                res.render('play', { jj:jj,hy:cs,title:title,menu: html.match(/\{"ensite":"(.*?)","cnsite":"(.*?)","vip":(.*?)\}/g),id: id,category:4 });
            } else {
                res.render('play', { jj:jj,hy:'<div></div>',title:title });
            }

        });
    })
});

module.exports = router;
