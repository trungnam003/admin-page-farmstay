const Handlebar = require('handlebars')

module.exports =  {
    jsonToString(json){
        try {
            return JSON.stringify(json);
        } catch (error) {
            return 'null'
        }
    },
    sum(a, b){
        return a+b
    },
    minus(a,b){
        return a-b;
    },
    ifEquals(arg1, arg2, options){
        
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    page(page, limit_page, limit, max){
        let str = '';
        let n = Math.floor(page/limit_page);
        let from_page = limit_page*n+1;
        let to_page = limit_page*(n+1);
        
        if(page%limit_page==0 || (page%limit_page==1 && page!=1)){
            from_page = page-1;
            to_page = page+limit_page-2;
        };
        // console.log(max)
        
        if(to_page>Math.ceil(max/limit)){
            to_page = Math.ceil(max/limit);
        }
        try {
            for (let index = from_page; index <= to_page; index++) {
                const href =  Handlebar.escapeExpression(
                    `?limit=${limit}&page=${index}`,
                );
                if(index==page){
                    str += `<li class="pagination-page active"><a href="${href}">${index}</a></li>`
                }else{
                    str += `<li class="pagination-page"><a href="${href}">${index}</a></li>`
                }
            }
            const output = str;
            return new Handlebar.SafeString(output);

        } catch (error) {
            console.log(error)
        }
        

    },
    prettifyDate:  function(timestamp) {
        function addZero(i) {
            if (i < 10) {
              i = "0" + i;
            }
            return i;
        }

        let curr_date = timestamp.getDate();
        let curr_month = timestamp.getMonth();
        curr_month++;
        let curr_year = timestamp.getFullYear();

        let curr_hour = timestamp.getHours();
        let curr_minutes = timestamp.getMinutes();
        let curr_seconds = timestamp.getSeconds();

        let result = addZero(curr_date)+ "/" + addZero(curr_month) + "/" + addZero(curr_year)+ '   ' +addZero(curr_hour)+':'+addZero(curr_minutes)+':'+addZero(curr_seconds);
        return result;
    },
    convertApiMethod(api_method){
        let num = parseInt(api_method)
        const methods = ["GET", "POST", "PUT", "DELETE"];
        let hasMethod = '';
        num = num.toString(2).split("").reverse().join("");
        
        for (let i = 0; i < num.length; i++) {
            if(parseInt(num.charAt(i))===1){
                hasMethod+=methods[i]+' ';
            }
        }
        return hasMethod.trim();
    }
}