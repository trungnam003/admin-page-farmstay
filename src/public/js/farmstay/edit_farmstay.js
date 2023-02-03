

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

        $('#buttonOpenUpload').on('click', function(){
            $('#inputAddImages').click();
        })
        
        $('#inputAddImages').on('change', function(e){
            const {files} = e.target;
            if(files.length){
                $("#listImageAdd").empty();
                $("#msgErrorImage").addClass('sr-only')
                const maxImage = 10;
                const currImage = Array.from($('.image-list')).length;
                const imageDisable = Array.from($('.image-list')).reduce((prev, curr)=>{
                    if(curr.classList.contains('image-disable')){
                        prev+=1;
                    }
                    return prev;
                }, 0);
                const check = (currImage-imageDisable)+files.length<=maxImage;
                if(check){
                    for (const element of files) {
                        let reader = new FileReader();
                        reader.readAsDataURL(element);
                        reader.onload = function (e){
                            $("#listImageAdd").append(`
                            <div class="col-lg-4 col-md-4 col-6 p-2">
                                <div class="d-block mb-2 ">
                                    <img data-id-img="{{this.fileId}}" style="
                                    width: 120px;
                                    height: 120px;
                                    cursor: pointer;
                                    object-fit: cover;" class="img-fluid img-thumbnail" src="${e.target.result}" alt="">
                                </div>
                            </div>
                            `)
                        }
                    }
                }else{
                    $("#listImageAdd").append(`
                    <div class="col-sm-12"><p class="text-danger font-italic">Ảnh thêm quá số lượng cho phép (tối đa 10)</p></div>
                    `)
                }
                
            }else{
                $("#listImageAdd").empty();
            }
        })

        $('#btnDeleteImagesFarmstay').on("click", function(){
            const imagesSelector = $('.image-list');
            let value;
            try {
                 value = JSON.parse($('#inputDeleteImages').val());
            } catch (error) {
                value = [];
            }
            
            for (const iterator of imagesSelector) {
                if(iterator.classList.contains('image-disable')){
                    value.push(iterator.getAttribute('data-id-img'))
                }
            }
            $('#inputDeleteImages').val(JSON.stringify(value))
            const {files} = $('#inputAddImages')[0]
            if(files.length){
                const maxImage = 10;
                const currImage = Array.from($('.image-list')).length;
                const imageDisable = Array.from($('.image-list')).reduce((prev, curr)=>{
                    if(curr.classList.contains('image-disable')){
                        prev+=1;
                    }
                    return prev;
                }, 0);
                const check = (currImage-imageDisable)+files.length<=maxImage;
                if(check){
                    //submit
                    console.log('here')
                    $('#formEditImageFarmstay').submit();
                    return;
                }else{
                    $("#msgErrorImage").removeClass('sr-only')
                    
                }
            }
            $('#formEditImageFarmstay').submit();
            
        })
    })(jQuery);

    (function($){
        'use strict';
        for (let index = 0; index < $('.money-vnd').length; index++) {
            const element = $('.money-vnd').get(index);
            
            const value = parseInt(element.innerText);
            element.innerText = value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        }
        // $('.money-vnd').text(value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}));
        
    })(jQuery);

    (function($){
        'use strict';
        $('.image-list').click(function(){
            $("#msgErrorImage").addClass('sr-only')
            if(this.classList.contains('image-disable')){
                this.classList.remove('image-disable')
            }else{
                this.classList.add('image-disable')

            }
        })
        
    })(jQuery);

    (function($){
        'use strict';
        
        $('#inputProvince').on('change', (e)=>{
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
                            `<option value="${element.code}">${element.name}</option>`
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

        $('#inputDistrict').on('change', (e)=>{
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
                            `<option value="${element.code}">${element.name}</option>`
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
                const {checked} = input;
                if(checked){
                    console.log(`${element.value}-${$('.input_equipment_quantity')[index].value}`)
                    array.push(`${element.value}-${$('.input_equipment_quantity')[index].value}`)
                }
                
            })
            console.log(array)
            
            $('#equipments').val(JSON.stringify(array));

            console.log($('#equipments').val())
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
                    $('.input_equipment_quantity')[index].removeAttribute('disabled');
                    if($('.input_equipment_quantity')[index].value==0){
                        $('.input_equipment_quantity')[index].value = 1;
                    }

                }else{
                    $('.input_equipment_quantity')[index].setAttribute('disabled', '');
                    $('.input_equipment_quantity')[index].value = 0;
                }
                // if( $('.input_equipment').is(':checked') ){
                //     console.log("OK", index)
                // }
            }
        })

        // console.log($('.input_equipment').length)
    })(jQuery);
})



