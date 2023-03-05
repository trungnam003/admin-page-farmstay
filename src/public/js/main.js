$( document ).ready(function(){
    (function($){
        'use strict';
        for (let index = 0; index < $('.money-vnd').length; index++) {
            const element = $('.money-vnd').get(index);
            
            const value = parseInt(element.innerText);
            element.innerText = value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        }
        // $('.money-vnd').text(value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}));
        
    })(jQuery);
});