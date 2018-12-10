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
})