#!/node.js

//使用前请先在系统上安装node.js
//本地运行测试 通过读取 config.js
//使用 node run.js 运行本文件

/*
配置文件格式 示例
module.exports = {
    //默认的origin地址（用于检测是否跨域），在api中单独配置assert.server字段时，则优先使用assert.server
    "server": "http://test.www.phone580.com:8000/baidu.cc",
    //显示正确信息（默认true）
    "info": true,
    //显示错误信息
    "error": true,
    //接口列表
    "apis": [
        {
            //接口地址
            "api": "https://pay.phone580.com/p3/admin/wxcashier/api",
            //断言（不需要判断的项可不写）
            "assert": {
                //请求方式，如果有多个值，则使用["GET","POST"]这种格式，默认值为GET
                "method": "POST",
                //允许的origin地址（用于检测是否跨域）
                "server": "https://pay.phone580.com/wechat/",
                //允许传入的header
                //"headers": ["Content-Type"],
                //是否允许传入cookie
                //"cookie": true,
                //判断内容格式
                //"contentType": "application/json;charset=utf-8"
            },
            //接口名称
            "title": "微信收银"
        }
    ]
}
*/

//配置文件（api列表）
var config = require('./config.js');

//引入的库（如果报错提示colors未找到，请先通过 npm -i colors 命令安装组件）
var http = require('http');
var https = require('https');
const url = require('url');
var colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

//用于输出正确信息
function info(msg) {
    if (config.info || true)
        console.log(('[√]' + msg).info);
}
//用于输出错误信息
function error(msg) {
    if (config.error || true)
        console.log(('[×]' + msg).error);
}

/**
 * 检查接口返回的headers信息
 * @param headers { server: 'nginx/1.9.7',
  date: 'Mon, 25 Dec 2017 08:43:06 GMT',
  'content-length': '0',
  connection: 'close',
  allow: 'GET, HEAD, POST, TRACE, OPTIONS',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-credentials': 'true',
  'access-control-allow-headers': 'Accept, Authorization,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type' }
 * @param api 单条接口信息 如 {
            "api": "http://test.pay.phone580.com:8002/p3/admin/FZS_P3_WXPUB/wxpubpayservice",
            "assert": {
                "method": "POST",
                "server": "http://test.www.phone580.com:8000/baidu.cc"
            },
            "title": "微信支付"
        }
 */
function headersCheck(headers, api) {
    var apiInfo = url.parse(api.api)
    console.log(('[·]' + api.title + "\tapi\t" + api.api).help);

    //#region access-control-allow-origin（允许的域名）
    var origin = headers['access-control-allow-origin'] || (apiInfo.protocol + "//" + apiInfo.hostname);
    if (origin == "*") {
        info(`${api.title || api.api}\torigin\t${origin}`)
    } else {
        var server = api.assert.server || config.server
        var r = new RegExp(`^${origin}.*$`).test(server);
        if (r){
            info(`${api.title || api.api}\torigin\t${origin}`)
        }
        else
            error(`${api.title || api.api}\torigin\t${origin}`)
    }
    //#endregion

    //#region access-control-allow-method（允许的请求方式）
    var allowMethod = (headers['access-control-allow-methods'] || headers['allow'] || 'Empty!').toUpperCase()
    var method = api.assert.method || 'GET'
    if (method instanceof Array) {
        method.forEach((item) => {
            if (allowMethod.includes(item.toUpperCase())) {
                info(`${api.title || api.api}\tmethods\t[${allowMethod}]\t已配置 ${item}`)
            } else {
                error(`${api.title || api.api}\tmethods\t[${allowMethod}]\t未配置 ${item}`)
            }
        })
    } else {
        if (allowMethod.includes(method)) {
            info(`${api.title || api.api}\tmethods\t[${allowMethod}]`)
        } else {
            error(`${api.title || api.api}\tmethods\t[${allowMethod}]`)
        }
    }
    //#endregion

    //#region access-control-allow-credentials（是否允许cookie）
    var allowCredentials = ((headers["access-control-allow-credentials"] || "false").toUpperCase()) == "TRUE" ? true : false;
    if (!allowCredentials && api.cookie) {
        error(`${api.title || api.api}\tcredentials\t[${allowCredentials}]`)
    } else {
        if (api.cookie != null)
            info(`${api.title || api.api}\tcredentials\t[${allowCredentials}]`)
    }
    //#endregion

    //#region access-control-expose-headers （允许获取到的其它headers）

    //#endregion

    //#region access-control-allow-headers（允许传入的headers）
    var allowHeaders = (headers["access-control-allow-headers"] || "").replace(/\s/g, "").split(",");
    (api.assert.headers || []).forEach((item) => {
        if (allowHeaders.includes(item)) {
            info(`${api.title}\theaders\t${item}`);
        } else {
            error(`${api.title}\theaders\t${item}`);
        }
    })
    //#endregion

    //#region content-type（响应 类型）
    var responseContentType = headers["content-type"];
    var contentType = api.assert.contentType;
    if (contentType != null && responseContentType != contentType) {
        error(`${api.title}\tcontent-type\t${responseContentType}`);
    } else {
        if (contentType != null)
            info(`${api.title}\tcontent-type\t${responseContentType}`)
    }
    //#endregion

    //#region cache-control（是否允许缓存）
    var allowCache = (headers["cache-control"] || "").toLowerCase() == "true";
    var cache = api.assert.cache;
    if (cache != null && (cache != allowCache)) {
        error(`${api.title}\tcache-control\t${allowCache}`);
    } else {
        if (cache != null)
            info(`${api.title}\tcache-control\t${allowCache}`)
    }
    //#endregion

    console.log('\n')
}

/**
 * 发起接口options请求，获取接口配置信息headers
 * @param api
 */
function request(api) {
    var serverInfo = url.parse(api.api);

    var req = (serverInfo.protocol == "http:" ? http : https).request({
        protocol: serverInfo.protocol || 'http:',
        hostname: serverInfo.hostname,
        port: serverInfo.port,
        path: serverInfo.path,
        method: 'OPTIONS',
        timeout: 5000,
        headers: {
            //'Content-Type': 'application/json;charset=UTF-8'
            //'Content-Type':'application/x-www-form-urlencoded',
            //'Content-Type': 'application/octet-stream; charset=UTF-8'
        }
    }, function (res) {
        res.on('end', function () {
            req.abort()
        });
        headersCheck(res.headers, api);
        res.setEncoding('utf-8');
        req.abort()
    })

    req.on('error', function (err) {
        error(api.title + "\t" + api.api + "\t 请求失败");
    });
    req.on('timeout', function (err) {
        error(api.title + "\t" + api.api + "\t 请求超时");
    });
    req.end();
}

//从配置文件遍历接口列表，发起options请求
for (var i = 0; i < config.apis.length; i++) {
    request(config.apis[i])
}
