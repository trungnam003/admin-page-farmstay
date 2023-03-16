

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
        $('#btnSubmitEditEquipmentsFarmstay').on('click', function(){
            
            try {
                const lstEditCurrent = [];
                const lstAdd = [];
                Array.from($('.edit-current-equipments-farmstay')).forEach(item=>{
                    const {value} = item;
                    const id = item.getAttribute('data-id');
                    const originalValue = item.getAttribute('data-original-value');
                    if(parseInt(value)!==parseInt(originalValue)){
                        const obj = {
                            id, value
                        }
                        lstEditCurrent.push(obj)
                    }
                })
                Array.from($('.add-equipments-farmstay')).forEach(item=>{
                    const {value} = item;
                    const id = item.getAttribute('data-id');
                    if(parseInt(value)>0){
                        const obj = {
                            id, value
                        }
                        lstAdd.push(obj)
                    }
                })
                $('#inputEditCurrentEquipments').val(JSON.stringify(lstEditCurrent))
                $('#inputAddCurrentEquipments').val(JSON.stringify(lstAdd))

                $('#formSubmitEditEquipmentsFarmstay').submit();
            } catch (error) {
                
            }
        });

        
    })(jQuery);

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



    (function($){
        

        const table = $('#tableEquipmentDetails').DataTable({
            
            language: {
                emptyTable: "Không có dữ liệu nào"
            },
        });
       $('#modalDetailEquipmentFarmstay').on('show.bs.modal', function (e){
            let button = $(e.relatedTarget) // Button that triggered the modal
            let eDetails = button.data('details-equipment')
            
            if(Array.isArray(eDetails)){
                // const table =  $('#tableEquipmentDetails').DataTable();
                eDetails.forEach(value=>{
                    const {mqtt_topic, field_name, id} = value;
                    table.row.add([id, field_name, mqtt_topic]).draw(false);
                    
                })
                
                table.columns.adjust().draw(0);
            }
            
            
        });
        $('#modalDetailEquipmentFarmstay').on('hide.bs.modal', function (e){
            table.clear().draw();
        });
    })(jQuery);

    (function( $ ) {

        $.fn.numberstyle = function(options) {
    
            /*
             * Default settings
             */
            var settings = $.extend({
                value: 0,
                step: undefined,
                min: undefined,
                max: undefined
            }, options );
    
            /*
             * Init every element
             */
            return this.each(function(i) {
                    
          /*
           * Base options
           */
          var input = $(this);
              
                /*
           * Add new DOM
           */
          var container = document.createElement('div'),
              btnAdd = document.createElement('div'),
              btnRem = document.createElement('div'),
              min = (settings.min) ? settings.min : input.attr('min'),
              max = (settings.max) ? settings.max : input.attr('max'),
              value = (settings.value) ? settings.value : parseFloat(input.val());
          container.className = 'numberstyle-qty';
          btnAdd.className = (max && value >= max ) ? 'qty-btn qty-add disabled' : 'qty-btn qty-add';
          btnAdd.innerHTML = '+';
          btnRem.className = (min && value <= min) ? 'qty-btn qty-rem disabled' : 'qty-btn qty-rem';
          btnRem.innerHTML = '-';
          input.wrap(container);
          input.closest('.numberstyle-qty').prepend(btnRem).append(btnAdd);
    
          /*
           * Attach events
           */
          // use .off() to prevent triggering twice
          $(document).off('click','.qty-btn').on('click','.qty-btn',function(e){
            
            var input = $(this).siblings('input'),
                sibBtn = $(this).siblings('.qty-btn'),
                step = (settings.step) ? parseFloat(settings.step) : parseFloat(input.attr('step')),
                min = (settings.min) ? settings.min : ( input.attr('min') ) ? input.attr('min') : undefined,
                max = (settings.max) ? settings.max : ( input.attr('max') ) ? input.attr('max') : undefined,
                oldValue = parseFloat(input.val()),
                newVal;
            
            //Add value
            if ( $(this).hasClass('qty-add') ) {   
              
              newVal = (oldValue >= max) ? oldValue : oldValue + step,
              newVal = (newVal > max) ? max : newVal;
              
              if (newVal == max) {
                $(this).addClass('disabled');
              }
              sibBtn.removeClass('disabled');
             
            //Remove value
            } else {
              
              newVal = (oldValue <= min) ? oldValue : oldValue - step,
              newVal = (newVal < min) ? min : newVal; 
              
              if (newVal == min) {
                $(this).addClass('disabled');
              }
              sibBtn.removeClass('disabled');
              
            }
              
            //Update value
            input.val(newVal).trigger('change');
                
          });
          
          input.on('change',function(){
            
            const val = parseFloat(input.val()),
                  min = (settings.min) ? settings.min : ( input.attr('min') ) ? input.attr('min') : undefined,
                    max = (settings.max) ? settings.max : ( input.attr('max') ) ? input.attr('max') : undefined;
            
            if ( val > max ) {
              input.val(max);   
            }
            
            if ( val < min ) {
              input.val(min);
            }
          });
          
            });
        };
    
      
      /*
       * Init
       */
      
        $('.numberstyle').numberstyle();
    
    }( jQuery ));
    
    
})



