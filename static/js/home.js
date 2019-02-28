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
    $(".valuetips").mouseover(function(){
        $(this).next()[0].style.display = "block"
    })
    $(".valuetips").mouseout(function(){
        $(this).next()[0].style.display = "none"
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
            data:url === 'https://api.omniwallet.org/v2/address/addr/' ? symbol :JSON.stringify(symbol),
            dataType:'json',
            success:function(data){
                return  callback(null,data)
            },
            error:function(err){
                return callback(true,null)
            }
        })
    }
    var values = {"EUSD":160000,"EETH":3640};
    var req = [{coin:"EUSD",pair:"USDT"},{coin:"EBTC",pair:"BTC"},{coin:"EETH",pair:"ETH"}];
    var result = {};
    loadAjax("https://blockchain.info/q/addressbalance/1YSscuNjW4hDDCPgvP8q9JfZmNEDBrEWu","GET",{},function(flag,data){
        var coldvalue = "loading..."
        if(!flag) {
            var cold = new Big(data).div(new Big(1e8));
            coldvalue = cold + " " + "BTC";
        }
        $(".BTC .cold").html(coldvalue);


    })

    function eth() {
        loadAjax("https://api.etherscan.io/api?module=account&action=balance&address=0x5c9f3fff6ee846a83080f373f8cea1451bb4a3d9&tag=latest&apikey=Q1HBAEYM1AVJX39W7SBGYZE1QBCA7CZD2A", "GET", {}, function (flag, data) {

            var hot = 0;
            if (!flag) {
                hot = new Big(new Big(data.result).div(new Big(1e18)).toFixed(8))
                loadAjax("https://api.etherscan.io/api?module=account&action=balancemulti&address=0xf64edd94558ca8b3a0e3b362e20bb13ff52ea513,0x7cdcb09dbe6fd3f87b419d8c094b0b607faeed5f&tag=latest&apikey=Q1HBAEYM1AVJX39W7SBGYZE1QBCA7CZD2A", "GET", {}, function (flag, data) {
                    var cold = 0;
                    var total = 0;
                    if (!flag) {
                        cold = new Big(new Big(new Big(data.result[0]['balance']).add(new Big(data.result[1]['balance']))).div(new Big(1e18)).toFixed(8));

                        if (hot != 0 && cold != 0) {
                            total = new Big(new Big(hot).add(new Big(cold)).toFixed(8));

                        }


                    }
                    if (total == 0) {
                        total = "loading..."
                    } else {
                        total = total + " " + "ETH";
                    }
                    if (cold == 0) {
                        cold = "loading..."
                    } else {
                        cold = cold + " " + "ETH";
                    }
                    if (hot == 0) {
                        hot = "loading...";
                    } else {
                        hot = hot + " " + "ETH";
                    }
                    $(".ETH .hot").html(hot);
                    $(".ETH .total").html(total);
                    $(".ETH .cold").html(cold);
                })
                usdt();
            }

            $(".ETH .hot").html(hot);
        })
    }
    function  usdt() {
        loadAjax("https://api.omniwallet.org/v2/address/addr/", "POST", "addr=1DR5XnVdym8VD5eWLJrApdfpPKs8fgQNo9&addr=15SZafVE21z1vL6qRmwK6aZiLnDCNfVkH3", function (flag, data) {
            if (!flag) {
                var hot = data["1DR5XnVdym8VD5eWLJrApdfpPKs8fgQNo9"]["balance"][0];
                var cold = data["15SZafVE21z1vL6qRmwK6aZiLnDCNfVkH3"]["balance"][0];
                var hotvalue = 0, coldvalue = 0, totalvalue = 0;
                if (hot.value) {
                    hotvalue = new Big(hot.value).div(new Big(1e8));
                }
                if (cold.value) {
                    coldvalue = new Big(cold.value).div(new Big(1e8));
                }
                if (hotvalue != 0 && coldvalue != 0) {
                    totalvalue = new Big(hotvalue).add(new Big(coldvalue));
                }
                totalvalue = totalvalue + " " + "USDT";
                hotvalue = hotvalue + " " + "USDT";
                coldvalue = coldvalue + " " + "USDT";
                $(".USDT .hot").html(hotvalue);
                $(".USDT .cold").html(coldvalue);
                $(".USDT .total").html(totalvalue);
                eos();


            } else {
                $(".USDT .hot").html("loading...");
                $(".USDT .cold").html("loading...");
                $(".USDT .total").html("loading...");
            }
        })
    }

    function eos() {
        loadAjax("https://api.eoslaomao.com/v1/chain/get_currency_balance", "POST", {
            code: "bitpietokens",
            account: "bitpiestable"
        }, function (flag, data) {
            if (!flag) {
                data.forEach(function (i) {
                    if (i.indexOf("EBTC") > -1) {
                        result["EBTC"] = parseFloat(i.replace(/EBTC/g, ""));
                    } else if (i.indexOf("EETH") > -1) {
                        result["EETH"] = parseFloat(i.replace(/EETH/g, ""));
                    } else if (i.indexOf("EUSD") > -1) {
                        result["EUSD"] = parseFloat(i.replace(/EUSD/g, ""));
                    }
                })

                req.forEach(function (v) {
                    loadAjax("https://api.eoslaomao.com/v1/chain/get_currency_stats", "POST", {
                        code: "bitpietokens",
                        symbol: v.coin
                    }, function (flag, data) {
                        if (!flag) {
                            var value = data[v.coin].supply
                            value = formatValue(value.replace(v.coin, ""));
                            console.log(result[v.coin])
                            var eosvalue = sub(value, result[v.coin]) + " " + v.coin;
                            //var total = value+" "+ v.pair;
                            //console.log(total);
                            // if(v.coin == "EUSD" || v.coin == "EETH"){
                            //$("."+ v.pair +" .total").html(total);
                            //$("."+ v.pair+" .cold").html(values[v.coin]+" "+ v.pair);
                           // var hot = sub(value, parseInt(values[v.coin]));
                            //$("."+ v.pair+" .hot").html(hot+" "+ v.pair);
                            //}else{
                            // $("."+ v.pair +" .cold").html(total);
                            //}
                            $("." + v.pair + " .eosvalue").html(eosvalue)
                        }
                    })
                })


            }
        })
    }
    eth();


})