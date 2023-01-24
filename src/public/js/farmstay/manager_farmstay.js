$( document ).ready(function(){

    // Submit xóa thiết bị
    (function($){
        $('#btnDeleteFarmstay').on('click', function (e) {
            const id = e.target.getAttribute('data-id-delete')
            $('#formDeleteFarmstay').attr('action', `/farmstay?_method=DELETE&farmstay_id=${id}`);
            $('#formDeleteFarmstay').submit();
        })
    })(jQuery);
    // Xử lí lấy id của nút khi nhấn hiện modal xóa thiết bị
    (function($){
        $('#modalDeleteFarmstay').on('show.bs.modal', function (e){
            let button = $(e.relatedTarget) // Button that triggered the modal
            let id = button.data('id')
            let name =  button.data('name')
            $('.modal-title-warning .alert-link').text(name)
            
            $('#btnDeleteFarmstay').attr('data-id-delete', id);
            
        });
    })(jQuery);
});