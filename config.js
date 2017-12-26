module.exports = {
    //默认的origin地址（用于检测是否跨域），在api中单独配置assert.server字段时，则优先使用assert.server
    "server": "http://test.www.phone580.com:8000/baidu.cc",

    //显示正确信息（默认true）
    "info": true,

    //显示错误信息（默认true）
    "error": true,

    //api列表
    "apis": [
        {
            //接口地址
            "api": "https://pay.phone580.com/p3/admin/wxcashier/api",
            //断言（不需要判断的项可不写）
            "assert": {
                //请求方式：字符串，如果有多个值，则使用Array，如 ["GET","POST"]，默认值为"GET"
                "method": ["POST", "GET", "DELETE"],
                //允许的origin地址（用于检测是否跨域）
                "server": "https://pay.phone580.com/wechat/",
                //允许传入的header
                //"headers": ["Content-Type"],
                //是否允许传入cookie
                //"cookie": true,ll
                //判断内容格式
                //"contentType": "application/json;charset=utf-8"
            },
            //接口名称
            "title": "微信收银"
        },
        {
            "api": "http://test.pay.phone580.com:8002/p3/admin/FZS_P3_WXPUB/wxpubpayservice",
            "assert": {
                "method": "POST",
                "server": "http://test.www.phone580.com:8000/baidu.cc"
            },
            "title": "微信支付"
        },
        {
            "api": "http://test.login.phone580.com:8000/fzsuserapi/wxuser/login",
            "assert": {
                "method": "POST",
                "server": "http://test.www.phone580.com:8000/baidu.cc"
            },
            "title": "登陆接口"
        },
        {
            "api": "http://test.login.phone580.com:8000/fzsuserapi/wxuser/register",
            "assert": {
                //请求方式
                "method": "POST",
                "server": "http://test.www.phone580.com:8000/baidu.cc"
            },
            "title": "注册接口"
        },
        {
            "api": "http://test.login.phone580.com:8000/fzsuserapi/wxuser/changepswbysms",
            "assert": {
                "method": "POST",
                "server": "http://test.www.phone580.com:8000/baidu.cc"
            },
            "title": "修改密码"
        }
    ]
}