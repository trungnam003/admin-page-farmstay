'use strict';

/**
 * 
 * @param {Object} options Object option
 * @param {string} options.form selector element form cần validate
 * @param {string} options.errorSelector selector element thông báo lỗi khi validate
 * @param {string} options.formGroupSelector selector element thẻ cha chứa thẻ input cần validate
 * @param {Array} options.rules mảng các rule cần validate cho thẻ input
 * @param {function} options.callback được gọi sau khi form được validate input và submit
 */
function Validator(options){
    const elementForm = document.querySelector(options.form);

    // Hàm lấy thẻ cha của thẻ hiện tại
    function getParent(element, selector){
        
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                
                return element.parentElement
            }
            element = element.parentElement;
        }
        return null;
    }

    // Object chứa danh sách các hàm test cần validate của từng selector
    // Ví dụ thẻ input email cần validate isRequired và isEmail 
    // email: [test: isRequired , test: isEmail ]
    var selectorRules = {};

    // Hàm này dùng để gọi hàm test cho từng validate của từng rule cho selector
    function validate(elementInput, rule){
        const {selector, test} = rule;
        const {errorSelector, formGroupSelector} = options;
        const elementParent = getParent(elementInput, formGroupSelector);
        const elementError = elementParent.querySelector(errorSelector);
        
        // Duyệt qua tất cả các rule validate của selector
        for(let i = 0; i<selectorRules[selector].length; i++){
            var result;
            switch(elementInput.type){
                case 'checkbox':{
                    const input = elementForm.querySelector(rule.selector+ ':checked')
                    const value = input==null?'':input.value
                    result = selectorRules[selector][i](
                        value
                    )
                    break;
                }
                    
                case 'radio':{
                    const input = elementForm.querySelector(rule.selector+ ':checked')
                    const value = input==null?'':input.value
                    result = selectorRules[selector][i](
                        value
                    )
                    break;
                }
                case 'file':{
                    result = selectorRules[selector][i](elementInput.value);
                    break;
                }
                    
                default:
                    result = selectorRules[selector][i](elementInput.value);
                    break;
            }
            var {err, value} = result;
            // Nếu có lỗi được bắt dùng vòng lặp và xuất thông báo
            if(err){
                break;
            }
        }
        // Xuất thông báo
        if(err){
            elementError.innerHTML = err;
            elementParent.classList.add('invalid')
        }else{
            elementError.innerHTML = '';
            elementParent.classList.remove('invalid')
        }
        return !err
        
    }

    // Xử lí chính của hàm
    if(elementForm){

        // Khi form được submit
        elementForm.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;
            // Duyệt qua từng rule được truyền vào qua kiểm tra các thẻ input có hợp lệ hay chưa trước khi submit form
            options.rules.forEach(rule =>{
                const {selector, test} = rule;
                const elementInput = elementForm.querySelector(selector);
                const err = validate(elementInput,rule); 
                if(!err){
                    isFormValid = false;
                }
            })
            // Nếu các input hợp lệ thì thực hiện gán giá trị cho object để submit
            if(isFormValid){
                // lấy các element là thẻ input có name và không disable
                const enableInputs = elementForm.querySelectorAll('[name]:not([disable])');
                 // Lấy value của các thẻ input
                const formValues =
                    Array.from(enableInputs).reduce(
                        (values, input)=>{
                            switch(input.type){
                                case 'checkbox':{
                                    if(!input.matches(':checked')){
                                        // values[input.name] = [];
                                        return values;
                                    } 
                                    if(!Array.isArray(values[input.name])){
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                    
                                    break;
                                }
                                // case 'number':{
                                    
                                //     // if(!input.matches(':checked')){
                                //     //     // values[input.name] = [];
                                //     //     return values;
                                //     // } 
                                //     if(!Array.isArray(values[input.name])){
                                //         values[input.name] = [];
                                //     }
                                //     values[input.name].push(input.value);
                                    
                                //     break;
                                // }
                                case 'radio':{
                                    // Lấy thẻ input được checked
                                    const checked = elementForm.querySelector(`input[name="${input.name}"]:checked`)
                                    
                                    values[input.name] = checked.value;
                                    break;
                                }
                                case 'file':{

                                    values[input.name] = input.files;
                                    break;
                                }
                                    
                                default:
                                    values[input.name] = input.value;
                                    break;
                            }
                            
                            return values;
                        }, {}
                    );
                // Kiểm tra callback
                if(typeof options.callback == 'function'){
                    options.callback(formValues);
                }else{
                    elementForm.submit();
                }
            }else{
                console.log("có lỗi")
            }
        }
        // Duyệt qua tất cả các rule được truyền vào hàm cần validate
        options.rules.forEach(rule => {
            
            const {selector, test} = rule;
            // Lấy tất cả các thẻ input có cùng tên
            const elementInputs = elementForm.querySelectorAll(selector);

            // Duyệt qua tất cả các thẻ input cùng tên và gán sự kiện
            Array.from(elementInputs).forEach(elementInput => {
                if(elementInput){
                    elementInput.onblur = function(e){
                        validate(elementInput,rule);
                    }
    
                    elementInput.oninput = function(e){
                        const {errorSelector} = options;
                        const elementParent = getParent(elementInput, options.formGroupSelector);
                        const elementError = elementParent.querySelector(errorSelector);
                        elementError.innerHTML = '';
                        elementParent.classList.remove('invalid')
                    }
                }
            });
            
            // Gán các hàm test validate vào danh sách cho từng selector
            if(Array.isArray(selectorRules[selector])){
                selectorRules[selector].push(test)
            }else{
                selectorRules[selector] = [test]
            }

            
            
        });
        

    }
}

// Validate cho input cần phải có giá trị
Validator.isRequired = function(selector, message){
    return {
        selector,
        test : function(input){
            let err, value;
            if(!input){
                err =message|| 'Trường này bắt buộc';
            }else{
                value = input;
            }
            return {err, value}
        }
    }
}
// Validate cho input là email
Validator.isEmail = function(selector, message){
    return {
        selector,
        test : function(input){
            let err, value;
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            const isValid = regex.test(input);
            if(isValid){
                value = input;
                
            }else{
                err = message||'Bạn phải nhập email';
            }
            return {err, value}
        }
    }
}
// Validate cho input có độ dài tối thiểu
Validator.minLength = function(selector, min, message){
    return {
        selector,
        test : function(input){
            let err, value;
            
            const isValid = input.length>=min ;
            if(isValid){
                value = input;
                
            }else{
                err = message||`Độ dài tối thiếu ${min} kí tự`;
            }
            return {err, value}
        }
    }
}
// Validate cho input nhập đúng với thẻ khác
Validator.isConfirmPassword = function(selector, selector_comfirm, message){

    function getValueSelectorComfirm(){
        const selector = document.querySelector(selector_comfirm);
        return selector.value;
    }

    return {
        selector,
        test : function(input){
            let err, value;
            const valueConfirm = getValueSelectorComfirm();
            const isValid = valueConfirm===input?true:false;
            if(isValid){
                value = input;
                
            }else{
                err = message || `Giá trị nhập vào không chính xác`;
            }
            return {err, value}
        }
    }
}