$(document).ready(function(){
  $.validator.addMethod('phoneUS', function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, '');
    return this.optional(element) || phone_number.length > 5 &&
    phone_number.match(/^[\d\(\)\ -]{14}$/);
  });

  $.validator.addMethod( "lettersonly", function( value, element ) {
  return this.optional( element ) || /^[а-я,ґ,',і,ї,є\-\a-z]+$/i.test( value );
} )

  $("#inputPhone").mask("(999) 999-99-99");
  $("#formValidate textarea").on("keyup cut paste keydown keypress change", resize);

  $("#formValidate").validate({
   rules:{
     name_company:{
       required: true,
       maxlength: 20,
     },

     site_company:{
       url: true
     },

     full_name: {
      required: true,
      maxlength: 20,
      lettersonly: true
    },

     job_position:{
       required: true,
       maxlength: 20,
     },

    phone:{
      required: true,
      phoneUS: true,
    },

    mail:{
      required: true,
      email: true
    },

  },

  submitHandler: function() {
    sendOrderMessage();
    return false;
  },

  messages:{
    name_company:{
      required: "Введите название компании.",
      maxlength: $.validator.format( "Количество символов должно быть не больше {0}." )
    },

    site_company:{
      url:"Введите корректный  url.",
    },

    full_name:{
      required: "Введите ваше имя.",
      maxlength: $.validator.format( "Количество символов должно быть не больше {0}." ),
      lettersonly: "Введите только буквы."
    },

    job_position:{
      required: "Введите вашу должность в компании.",
      maxlength: $.validator.format( "Количество символов должно быть не больше {0}." )
    },

    phone:{
      required: "Введите ваш телефон.",
      phoneUS: "Введите корректный номер телефона"
    },

    mail:{
      email:"Введите корректный  email.",
      required: "Введите ваш email."
    }
  },

  errorElement : 'div',
  errorPlacement: function(error, element) {
    var placement = $(element).data('error');
    if (placement) {
      $(placement).append(error)
    } else {
      error.insertAfter(element).data('error');
    }
  },
});

  $.fn.serializeObject = function()
  {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  $.fn.resetInputValue = function()
  {
    var a = this[0];
    for(var i =0; i<a.length; i++){
      if(a[i].value){
        a[i].value = "";
      }
    }
  };

  function resize(e) {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight+'px';
  }

  // collapsed form and button
  $('a[data-id="form-collapsed"]').click(function(){
    $('#formValidate').slideToggle();
    $('#btn-form-collapsed').toggle();
  });

  // $("#sendBtn").on("click", sendOrderMessage());

  function sendOrderMessage() {
      var customer = JSON.stringify($("#formValidate").serializeObject());
      var url = "/api/customerrequest/";
      console.log(customer);
      $.ajax({
        type: "POST",
        url: url,
        data: customer,
        dataType: "json",
        contentType: "application/json"
      });
     $("#formValidate").resetInputValue();
    }


});

