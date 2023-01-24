$( document ).ready(function(){
    (function($){
        $('.restore-equipment').click(function(){
            const id  = this.getAttribute("data-id");
            $('#inputIdRestoreEquipment').val(id)
            $('#formRestoreEquipment').submit();
        })
     })(jQuery);


    (function($){
        $('#btnDeleteForceEquipment').on('click', function (e) {
            const id = e.target.getAttribute('data-id-delete')
            $('#formDeleteForceEquipment').attr('action', `/equipment/trash?_method=DELETE&equipment_id=${id}`);
            $('#formDeleteForceEquipment').submit();
            
        })
     })(jQuery);

    (function($){
        $('#modalDeleteForceEquipment').on('show.bs.modal', function (e){
            var button = $(e.relatedTarget) // Button that triggered the modal
            let id = button.data('id')
            $('#btnDeleteForceEquipment').attr('data-id-delete', id);
            
        });
    })(jQuery);

    (function($){
        $('.delete-force-equipment').click(function(){  
            let name = this.getAttribute("data-name");
            
            //$('#modalDeleteEquipment').modal('show');
            $('.modal-title-danger .alert-link').text(name)
        });
    })(jQuery);
});