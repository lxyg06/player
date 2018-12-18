var express = require('express');
var router = express.Router();
const http = require('https');
const cheerio = require('cheerio');

router.get('/', function(req, res, next) {
    const url = req.query.type
    //&rank=rankhot&cat=all&area=all&act=all&year=all&pageno=2
    http.get('https://www.360kan.com/'+url+'/list.php'+req.url,hres => {
        const chunks = [];
        let size = 0;
        hres.on('data',function(chunk){   //监听事件 传输
            chunks.push(chunk);
            size += chunk.length;
        });
        hres.on('end',function() {  //数据传输完
            const data = Buffer.concat(chunks, size);
            const html = data.toString().replace(/list\.php\/\?/g,"list.php?");
            const $ = cheerio.load(html); //cheerio模块开始处理 DOM处理
            const jj = $('.s-tab-main');
            const title = $('.title-left').find('h1').text();
            let hy = []
            if(url.indexOf("dongman")!=-1){
                const cs = html.match(/<a class="js-tongjic" href="(.*?)">[\s\S]+?<img src="(.*?)">[\s\S]+?<span class="hint">(.*?)<\/span>[\s\S]+?<span class="s1">(.*?)<\/span>[\s\S]+?<\/a>/g);
                console.log(cs)
                for(var c in cs){
                    var cc = cs[c].match(/<a class="js-tongjic" href="(.*?)">[\s\S]+?<img src="(.*?)">[\s\S]+?<span class="hint">(.*?)<\/span>[\s\S]+?<span class="s1">(.*?)<\/span>[\s\S]+?<\/a>/);
                    hy.push({url:cc[1],image:cc[2],title:cc[4],content:cc[3]})
                }
            }else{
                const cs = html.match(/<a class="js-tongjic" href="(.*?)">[\s\S]+?<img src="(.*?)">[\s\S]+?<span class="s1">(.*?)<\/span>[\s\S]+?<p class="star">(.*?)<\/p>[\s\S]+?<\/a>/g);
                for(var c in cs){
                    var cc = cs[c].match(/<a class="js-tongjic" href="(.*?)">[\s\S]+?<img src="(.*?)">[\s\S]+?<span class="s1">(.*?)<\/span>[\s\S]+?<p class="star">(.*?)<\/p>[\s\S]+?<\/a>/);
                    hy.push({url:cc[1],image:cc[2],title:cc[3],content:cc[4]})
                }
            }
            var cc = []
            var ah = $("#js-ew-page").html();
            if(ah!=null){
                cc =  ah.replace(/https:\/\/www\.360kan\.com\/[a-zA-Z]+?\/list\.php\?/g,"/list?type="+url+"&")
                cc = cc.match(/<a[\s\S]+?<\/a>/g);
            }
            var typeitem = [];
            $(".s-filter-item").each((i,v) => {
                var item = $(v)
                var sa = item.find('dd').html()
                typeitem.push({title:item.find('dt').text(),content:sa.replace(/https:\/\/www\.360kan\.com\/[a-zA-Z]+?\/list\.php\?/g,"/list?type="+url+"&")})
            })

            var aul = $("ul.g-clear.tab").html();
            aul = aul.replace(/https:\/\/www\.360kan\.com\/[a-zA-Z]+?\/list\.php\?/g,"/list?type="+url+"&")
            aul = aul.replace(/tab-cur/g,"active")
            console.log(aul)
            res.render('list', {hy:hy,title:title,ah:cc,typeitem:typeitem,aul:aul});
        });
    });
});
module.exports = router;
