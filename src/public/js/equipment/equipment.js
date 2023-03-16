function readURL(input) {
    if (input.files) {
        $('#image-view').empty();
        for (const element of input.files) {
            let reader = new FileReader();           
            reader.onload = function (e) {
                $('#image-view')
                .append(`<img style="width:100px;"src="${e.target.result}" alt="your image" class="img-thumbnail">`)  
            };
            reader.readAsDataURL(element);
        }
    }
}
$( document ).ready(function(){
    // Submit tạo thiết bị 
     (function($){
        $('#btnSubmitCreateEquipment').on('click', function (e) {
            $('#formSubmitCreateEquipment').submit();
        })
     })(jQuery);

     (function($){
        $('#btnSubmitEditEquipment').on('click', function (e) {
            
            $('#formSubmitEditEquipment').submit();
        })
     })(jQuery);
    // Submit xóa thiết bị
     (function($){
        $('#btnDeleteEquipment').on('click', function (e) {
            const id = e.target.getAttribute('data-id-delete')
            $('#formDeleteEquipment').attr('action', `/equipment?_method=DELETE&equipment_id=${id}`);
            $('#formDeleteEquipment').submit();
        })
     })(jQuery);

     // Xử lí lấy id của nút khi nhấn hiện modal xóa thiết bị
    (function($){
        $('#modalDeleteEquipment').on('show.bs.modal', function (e){
            var button = $(e.relatedTarget) // Button that triggered the modal
            let id = button.data('id')
            $('#btnDeleteEquipment').attr('data-id-delete', id);
            
        });
    })(jQuery);

    // Xử lí lấy id khi nhấn nút sửa thiết bị
     (function($){
        $('.edit-equipment').click(function(){  
            let name = this.getAttribute("data-name");
            let name_en = this.getAttribute("data-name-en");

            let rent = this.getAttribute("data-rent-cost");
            let quantity = this.getAttribute("data-quantity");
            
            let categoryId = this.getAttribute("data-category-id");
            let id = this.getAttribute("data-id");

            $('#inputEditNameEquipment').val(name)
            $('#inputEditNameEnEquipment').val(name_en)
            $('#inputEditPriceEquipment').val(rent)
            $('#inputEditQuantityEquipment').val(quantity)
            $('#inputEditTypeEquipment').val(categoryId)
            $('#inputEditIdEquipment').val(id)
            $('#modalEditEquipment').modal('show');
        });
     })(jQuery);
    
    // Xử lí thêm tên vào modal thiết bị cần xóa
    (function($){
        $('.delete-equipment').click(function(){  
            let name = this.getAttribute("data-name");
            //$('#modalDeleteEquipment').modal('show');
            $('.modal-title-warning .alert-link').text(name)
        });
     })(jQuery);

})