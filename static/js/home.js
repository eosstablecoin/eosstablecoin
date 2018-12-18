$(function(){
    var langCode = "en";
    var lang = (navigator.language || navigator.browserLanguage).toLowerCase();
    var translate = function (jsdata)
    {
        $("[tkey]").each (function (index)
        {
            var strTr = jsdata [$(this).attr ('tkey')];
            $(this).html (strTr);
        });
    }
    var htmlLoad = function (langCode){
        $.getJSON("/static/js/i18n/" + langCode + ".json", function (json) {
            translate(json);
        });
    }
    if(new String(lang).indexOf("zh") > -1) {
        langCode = "cn"
    }
    htmlLoad(langCode);
    $(".cn").click(function(){
        langCode = "cn";
        htmlLoad(langCode);
    })
    $(".en").click(function(){
        langCode = "en";
        htmlLoad(langCode);
    })
    $.each($(".mobileshow"),function(i,n){
       if(new String($($(".address-tips")[i]).text()).length == 0){
           $($(".mobileshow")[i]).hide();
       }
    })
    $(".mobileshow").click(function(){
       $($(this).next()).toggle();
    })
    //$(".audit-des").click(function(){
    //    $($(this).next()).fadeToggle(500);
    //})
    $(".mobile-menu").click(function(){
        var self = $($(this).next())[0].style;
        if(!self.display) {
            $($(this).next())[0].style.display = "table";
        }else{
            self.display = ""
        }
    })
    $(".menu ul li").click(function(){
        $(".menu")[0].style.display = "";
    })
    $(".tips").mouseover(function(){
        $(this).prev()[0].style.display = "block"
    })
    $(".tips").mouseout(function(){
        $(this).prev()[0].style.display = "none"
    })
    var formatValue = function(text) {
        var old = new  String(text);
        var newstr = old;
        var leng = old.length - old.indexOf(".")-1;
        if(old.indexOf(".")>-1){
            for(var i=leng;i>0;i--){
                if(newstr.lastIndexOf("0")>-1 && newstr.substr(newstr.length-1,1)==0){
                    var k = newstr.lastIndexOf("0");
                    if(newstr.charAt(k-1)=="."){
                        return  newstr.substring(0,k-1).replace(/\"/,"");
                    }else{
                        newstr = newstr.substring(0,k);
                    }
                }else{
                    return newstr.replace(/\"/,"");
                }
            }
        }
        return old.replace(/\"/,"") ;
    }
    function sub(num1, num2) {
        const num1Digits = (num1.toString().split('.')[1] || '').length;
        const num2Digits = (num2.toString().split('.')[1] || '').length;
        const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
        return (num1 * baseNum - num2 * baseNum) / baseNum;
    }
    var linkLoad = function(){
        $.getJSON("/static/js/link.json", function (json) {
            var html = "";
            for(var i= 0,l=json.length;i<l;i++){
                html+='<a href="'+json[i].link+'" target="_blank"><img src="'+json[i].imgsrc+'">';
            }
            $(".partner-info").html(html);
        });
    }
    linkLoad();
    function loadAjax(url,type,symbol,callback){
        $.ajax({
            url:url,
            type:type,
            data:JSON.stringify({code:"bitpietokens",symbol:symbol}),
            dataType:'json',
            success:function(data){
                return  callback(null,data)
            },
            error:function(err){
                return callback(true,null)
            }
        })
    }
    var values = {"EUSD":100000,"EETH":2000};
    var req = [{coin:"EUSD",pair:"USDT"},{coin:"EBTC",pair:"BTC"},{coin:"EETH",pair:"ETH"}];
    req.forEach(function(v){
        console.log(v);
            loadAjax("https://api.eoslaomao.com/v1/chain/get_currency_stats", "POST", v.coin , function (flag, data) {
                if (!flag) {
                    var value = data[v.coin].supply
                    value = formatValue(value.replace(v.coin,""));
                    var eosvalue = value +" "+ v.coin;
                    var total = value+" "+ v.pair;
                    //console.log(total);
                    if(v.coin == "EUSD" || v.coin == "EETH"){
                        $("."+ v.pair +" .total").html(total);
                        $("."+ v.pair+" .cold").html(values[v.coin]+" "+ v.pair);
                        var hot = sub(value,parseInt(values[v.coin]));
                        console.log(hot);
                        $("."+ v.pair+" .hot").html(hot+" "+ v.pair);
                    }else{
                        $("."+ v.pair +" .cold").html(total);
                    }
                    $("."+ v.pair+" .eosvalue").html(eosvalue)
                }
            })
    })

})