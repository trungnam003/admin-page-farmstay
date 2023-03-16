
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

    (function($){
        'use strict';
        
        $('#inputProvince').on('click', (e)=>{
            e.preventDefault();
            const {value} =e.target;
            
            if(value || value!==''){
                $('#inputDistrict').removeAttr( 'disabled' );
                $('#inputWard').empty()
                $('#inputWard').attr( 'disabled', true )
                const callAPI = $.ajax({
                    type: 'GET',
                    dataType:"json",
                    url: `/farmstay/api/get_districts?province_code=${value}`,
                    headers:{         
                        'Content-Type':'application/json'
                    },
                });

                callAPI.then(data=>{
                    const {districts} = data
                    $('#inputDistrict').empty()
                    for (const element of districts) {
                        
                        $('#inputDistrict').append(
                            `<option value="${element.code}">${element.full_name}</option>`
                        )
                    }
                    
                    return;
                })
                    
                
            }else{
                $('#inputWard').empty()
                $('#inputDistrict').empty()
                $('#inputWard').attr( 'disabled', true )
                $('#inputDistrict').attr( 'disabled', true )
            }
            
        });

        $('#inputDistrict').on('click', (e)=>{
            e.preventDefault();
            const {value} =e.target;
            if(value || value!==''){
                $('#inputWard').removeAttr( 'disabled' );

                const callAPI = $.ajax({
                    type: 'GET',
                    dataType:"json",
                    url: `/farmstay/api/get_wards?district_code=${value}`,
                    headers:{         
                        'Content-Type':'application/json'
                    },
                });
                callAPI.then((data)=>{
                    const {wards} = data
                    $('#inputWard').empty()
                    for (const element of wards) {
                        
                        $('#inputWard').append(
                            `<option value="${element.code}">${element.full_name}</option>`
                        )
                    }
                })
            }else{
                $('#inputWard').attr( 'disabled', true )
            }
        });
    })
    (jQuery);

    (function ($) { 
        'use strict';
        
        $('#btn-get-image-list').on('click', (e)=>{
            
            const {files} = $('#input_multi_image')[0]
            $("#image-slide-view").empty();
            $('#carouselExampleIndicators').removeClass('sr-only');
            if(files.length){
                for (const element of files) {
                    let reader = new FileReader();
                    reader.readAsDataURL(element);
                    reader.onload = function (e){
                        
    
                        if($.trim($("#image-slide-view").html())==''){
                            $('#image-slide-view').append(`<div class="carousel-item active">
                                <img class="d-block w-100 img-test" src="${e.target.result}" alt="First slide">
                                </div>`)
                        }else{
                            $('#image-slide-view').append(`<div class="carousel-item">
                                <img class="d-block w-100 img-test" src="${e.target.result}" alt="First slide">
                                </div>`)
                        }
                    }
                }
            }else{
                $('#carouselExampleIndicators').addClass('sr-only');
            }
            
            $('#exampleModalCenter').modal('hide')
        })
    })(jQuery);

    (function ($) {  
        $('#btn-submit-form').on('click', (e)=>{
            e.preventDefault();
            let array = []
            Array.from($('.input_equipment')).forEach((element, index)=>{
                const input = $('.input_equipment')[index];
                const checkBoxData = $('.input_equipment_have_data')[index];
                const inputNumberData = $('.input_equipment_number_data')[index];
                const inputQuantity = $('.input_equipment_quantity')[index];
                const selectArea = $('.select_area_id')[index];
                const {checked} = input;
                if(checked){
                    const data = {}
                    data['equipment_id'] = $(element).val();
                    if(checkBoxData.checked){
                        data['have_data'] = true;
                        data['number_of_field'] = $(inputNumberData).val()
                    }
                    data['area_id'] = $(selectArea).find(":selected").val();
                    data['quantity'] = $(inputQuantity).val();
                    array.push(data)
                }
                
            })
            console.log(array)
            
            $('#equipments').val(JSON.stringify(array));

            const a = $('#form-create-farmstay')
            
            a.submit();
            
        })
    })(jQuery);
    
    (function($){
        // for (let index = 0; index < $('.input_equipment').length; index++) {
        //     $('.input_equipment')[index].on('change', (e)=>{
        //         if( $('.input_equipment')[index].is(':checked') ){
        //                 console.log("OK", index)
        //             }
        //     })
        // }
        $('.input_equipment').on('change', (e)=>{
            const {target:_this} = e
           
            // $('.input_equipment:checked').each(function() {

            //     console.log("OK",);
            // });
            for (let index = 0; index < $('.input_equipment').length; index++) {
                const input = $('.input_equipment')[index];
                const {checked} = input;
                if(checked){
                    $('.input_equipment_have_data')[index].removeAttribute('disabled');
                    $('.input_equipment_quantity')[index].removeAttribute('disabled');
                    if($('.input_equipment_quantity')[index].value==0){
                        $('.input_equipment_quantity')[index].value = 1;
                    }

                }else{
                    $('.input_equipment_quantity')[index].setAttribute('disabled', '');
                    $('.input_equipment_have_data')[index].setAttribute('disabled', '');
                    $('.input_equipment_number_data')[index].setAttribute('disabled', '');

                    $('.input_equipment_quantity')[index].value = 0;
                    $('.input_equipment_number_data')[index].value = 0;
                    $('.input_equipment_have_data')[index].checked = false;
                    
                }
                // if( $('.input_equipment').is(':checked') ){
                //     console.log("OK", index)
                // }
            }
        })
        $('.input_equipment_have_data').on('change', (e)=>{
            const {target:_this} = e
           
            // $('.input_equipment:checked').each(function() {

            //     console.log("OK",);
            // });
            for (let index = 0; index < $('.input_equipment_have_data').length; index++) {
                const input = $('.input_equipment_have_data')[index];
                const {checked} = input;
                if(checked){
                    $('.input_equipment_number_data')[index].removeAttribute('disabled');
                    
                    if($('.input_equipment_number_data')[index].value==0){
                        $('.input_equipment_number_data')[index].value = 1;
                    }

                }else{
                    $('.input_equipment_number_data')[index].setAttribute('disabled', '');

                    $('.input_equipment_number_data')[index].value = 0;
                }
                // if( $('.input_equipment').is(':checked') ){
                //     console.log("OK", index)
                // }
            }
        })
        // console.log($('.input_equipment').length)
    })(jQuery);
})



