$( document ).ready(function(){
    (function($){
        $('#btnSubmitEditEquipment').on('click', function (e) {
            let action = $('#formEditQuantityEquipment').attr('action')
            action += '?_method=PUT';
            console.log(action)
            $('#formEditQuantityEquipment').attr('action', action)

            $('#formEditQuantityEquipment').submit();
        })
     })(jQuery);
});