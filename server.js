var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();

/*全局变量，用来替代session*/
var DATA={};

// 设置 Session
app.use(cookieParser());

/*nodejs 的奇葩之处在于要显示的调用下req.session中的数据，才能对浏览器写入如下 name 的 session */
app.use(session({
    secret: '123456',
    name:'ossid',
    cookie:{maxAge:800000,secure:false},
    resave:false,
    saveUninitialized:false
}));

/*设置js路由*/
app.get('/qrcode.js',function(req,res){
    res.sendfile('js/qrcode.js')
});
app.get('/threejs.js',function(req,res){
    res.sendfile('js/threejs.js')
});


/*实时展示页面*/
app.get('/pgget.jpg',function(req,res){
    res.cookie('ssid',req.sessionID);
    res.sendfile('getmsg.html')
});

app.get('/pgset',function(req,res){
    res.cookie('ssid',req.query['ssid']);
    res.sendfile('setmsg.html')
});

/*这里用来接收感应器数据*/
app.get('/sd',function(req,res){
    /*写/设置数据*/
    var data = req.query['data']||'no data got';
    var ssid = req.query['ssid']||'no ssid got';
    /*把位置存到临时变量中*/
    DATA[ssid] = data;
//    console.log(DATA);
    res.cookie('ssid',req.query['ssid']);
    res.send('ssid = '+req.sessionID+'<br>data:'+data);
});

/*这里用来给前端页面实时返回方位值*/
app.get('/gd',function(req,res){
    var data;
    var ssid = req.query['ssid'];
    /*如果存在这个数据session，那么可以正常返回，否则返回错误信息*/
    if(DATA[ssid]){
        console.log(DATA);
        data = DATA[ssid];
        res.send("传来的session号为："+ssid+'<br>'
            +'实际的session号为：'+req.sessionID+'<br>'
            +'查到的的数据值为：<span id=\"data\">'+data+'</span>')
    }else{
        res.send('当前session池中没有这个session')
    }
});


/* csrf测试实例 - 这部分是写测试分享中用到的csrf攻击实例 */
app.get('/cookie.jpg',function(req,res){
    /*设置展示cookie*/
    if(req.query['cookie']){
        console.log('fond cookie');
        console.log(req.query['cookie']);
    }

    /*设置cookie*/
    if(req.query['ssid']){
        res.cookie('PHPSESSID',req.query['ssid'])
        console.log('cookie seted => '+req.query['ssid'])
    }

    res.send('ok');
    console.log('ok')
});


var server = app.listen(3000,function(){
    console.log('3000 is up')
});