
function readURL(input) {
    if (input.files) {
        $('#image-view').empty();
        for (let index = 0; index < input.files.length; index++) {
            var reader = new FileReader();           
            reader.onload = function (e) {
                $('#image-view')
                .append(`<img style="width:100px;"src="${e.target.result}" alt="your image" class="img-thumbnail">`)  
            };
            reader.readAsDataURL(input.files[index]);
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
                    for (let index = 0; index < districts.length; index++) {
                        
                        $('#inputDistrict').append(
                            `<option value="${districts[index].code}">${districts[index].name}</option>`
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
                    for (let index = 0; index < wards.length; index++) {
                        
                        $('#inputWard').append(
                            `<option value="${wards[index].code}">${wards[index].name}</option>`
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
                for (let index = 0; index < files.length; index++) {
                    var reader = new FileReader();
                    reader.readAsDataURL(files[index]);
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
        $('#btn-create').on('click', (e)=>{
            e.preventDefault();
            
            const a = $('#form-create-farmstay')
            a.submit();
            
        })
    })(jQuery);
    
})



