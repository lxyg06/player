var express = require('express');
var router = express.Router();
const http = require('https');
const cheerio = require('cheerio');

router.get('/', function(req, res, next) {
    const url = req.query.wd
    http.get('https://so.360kan.com/index.php?kw='+encodeURI(url)+'&from=',hres => {
        const chunks = [];
        let size = 0;
        hres.on('data', function (chunk) {   //监听事件 传输
            chunks.push(chunk);
            size += chunk.length;
        });
        hres.on('end', function () {  //数据传输完
            const data = Buffer.concat(chunks,size);
            let  html = data.toString();
            html = html.replace(/http:\/\/www\.360kan\.com/g,"/play?play=");
            const $ = cheerio.load(html); //cheerio模块开始处理 DOM处理
            var hy = [];
            $("#js-longvideo").find(".js-dianshi,.js-longitem").each(function(v,i){
                console.log($(i).find('.m-mainpic').find('img').attr("src"))
                hy.push({
                    imag:$(i).find('.m-mainpic').find('img').attr("src"),
                    title:$(i).find('.cont').find('.title').html(),
                    yangy:$(i).find('.cont').find('.index-dianying-ul').html(),
                    ahref:$(i).find('.cont').find('a').attr("href"),
                    jj:$(i).find('.cont').find('.m-description').find('p').html()
                })
            })
            console.log(hy)
            res.render('seacher', {hy:hy,wd:url});
        })
    })
});
module.exports = router;
