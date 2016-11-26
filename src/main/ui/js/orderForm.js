$(document).ready(function(){
  "use strict";
  $.validator.addMethod("phoneUS", function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 5 &&
    phone_number.match(/^[\d\(\)\ -]{14}$/);
  });

  $.validator.addMethod( "lettersonly", function( value, element ) {
  return this.optional( element ) || /^[а-я,ґ,", ,і,ї,є\-\a-z]+$/i.test( value );
});

  // phone mask
  $("#inputPhone").mask("(999) 999-99-99");

  $("#formValidate").validate({
   rules:{
     name_company:{
       required: true,
       maxlength: 25
     },

     site_company: {
       required: true,
       maxlength: 25,
     },

     full_name: {
      required: true,
      maxlength: 50,
      lettersonly: true
    },

     job_position:{
       required: true,
       maxlength: 50
     },

    phone:{
      required: true,
      phoneUS: true
    },

    mail:{
      required: true,
      email: true
    },

     question_1:{
       maxlength: 200
     },

     question_2:{
       required: true,
       maxlength: 200
     },

     question_3:{
       maxlength: 200
     },

   },

  submitHandler: function() {
    sendOrderMessage();
    return false;
  },

  messages:{
    name_company:{
      required: "Вкажіть будь-ласка назву компанії",
      maxlength: $.validator.format( "Кількість символів має бути не більше {0}." )
    },

    site_company:{
      required: "Вкажіть будь-ласка назву Вашого сайту",
      maxlength: $.validator.format( "Кількість символів має бути не більше {0}." )
    },

    full_name:{
      required: "Вкажіть будь-ласка Ваше ім'я та прізвище",
      maxlength: $.validator.format( "Кількість символів має бути не більше{0}." ),
      lettersonly: "Вкажіть тільки букви"
    },

    job_position:{
      required: "Вкажіть будь-ласка Вашу посаду в компанії",
      maxlength: $.validator.format( "Кількість символів має бути не більше {0}." )
    },

    phone:{
      required: "Вкажіть будь-ласка Ваш номер телефону",
      phoneUS: "Вкажіть будь-ласка правильний номер телефону"
    },

    mail:{
      required: "Вкажіть будь-ласка Вашу email адресу",
      email: "Вкажіть будь-ласка правильну email адресу"
    },

    question_1:{
      maxlength: $.validator.format( "Кількість символів має бути не більше{0}." )
    },

    question_2:{
      required: "Це питання є обов'язкове",
      maxlength: $.validator.format( "Кількість символів має бути не більше {0}." )
    },

    question_3:{
      maxlength: $.validator.format( "Кількість символів має бути не більше {0}." )
    }
  },

  errorElement : "div",
  errorPlacement: function(error, element) {
    var placement = $(element).data("error");
    if (placement) {
      $(placement).append(error);
    } else {
      error.insertAfter(element).data("error");
    }
  },
});

  $.fn.serializeObject = function()  {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || "");
      } else {
        o[this.name] = this.value || "";
      }
    });
    return o;
  };

   $.fn.clearInputs = function() {
     var a = this[0];
     var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
     for(var i =0; i<a.length; i++){
       var t = a[i].type, tag = a[i].tagName.toLowerCase();
       if (re.test(t) || tag == "textarea") {
         a[i].value = "";
       }
     }
    };

  function sendOrderMessage() {
    var customer = JSON.stringify($("#formValidate").serializeObject());
    var url = "/api/customerrequest/";
    $.ajax({
      type: "POST",
      url: url,
      data: customer,
      success: successRequest(),
      dataType: "json",
      contentType: "application/json"
    });
    $("#formValidate").clearInputs();
  }

  function successRequest() {
    $("#formValidate").slideToggle();
    $("#success").toggle();
    $("#btn-form-collapsed").toggle();
    // setTimeout(collapseSuccess, 7000);
  }

  function collapseSuccess() {
    $("#success").slideUp();
  }

  function resize(e) {
    var self = this;
    self.style.height = "auto";
    self.style.height = this.scrollHeight+"px";
  }

  $("[data-target='#success']").on("click", collapseSuccess);

  //resize textarea
  $("#formValidate textarea").on("keyup cut paste keydown keypress change", resize);

  // collapsed form and button
  $("a[data-id='form-collapsed']").click(function(){
    $("#btn-form-collapsed").toggle();
    $("#formValidate").slideToggle();
  });
});

