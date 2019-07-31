$(init);


function init(){
    
    // Activar la validación del formulario
    $('#modalRegistro').modal();
    validateForm();
    
    // Evento clic del floatbutton agregar
    $('#btn-registro').on("click", function(){
        $('#modalRegistro').modal('open');
        $('#corr').focus();
    });
    
    // clic del boton de guardar
    $('#guardar').on("click",function(){
        //alert("Diste clic en guardar");
        $('#frm-registro').submit();
    });
    
      $('#btn-acceso').on("click", function(){
        $('#frm-acceso').submit();
    });

    
}

function validateForm(){
    $('#frm-acceso').validate({
        rules:{
          'usr':{
                    required: true, email:true
                },
          'pwd':{
                      required:true  //,
                      //digits: true
                    }
        },
        messages:{
            'usr':{
                    required: 'Campo requerido',
                    email: 'Se requiere un email valido',
                  },
            'pwd':{
                        required: 'Campo requerido' //,
                        //digits: 'Ingrese solo números'
                      }
        },
        errorElement:"div",
        errorClass:"invalid",
        errorPlacement: function(error, element){
            error.insertAfter(element)
        },
        submitHandler: function(form){
            validaData();
        }
    });
    
    $('#frm-registro').validate({
        rules:{
          'corr':{
                    required: true, email:true
                },
          'nom':{
                      required:true  //,
                      //digits: true
                    },
          'cont':{
                      required:true  //,
                      //digits: true
                    }
                    
        },
        messages:{
            'usr':{
                    required: 'Campo requerido',
                    email: 'Se requiere un email valido',
                  },
            'pwd':{
                        required: 'Campo requerido' //,
                        //digits: 'Ingrese solo números'
                      },
            'cont':{
                        required: 'Campo requerido' //,
                        //digits: 'Ingrese solo números'
                      }
        },
        errorElement:"div",
        errorClass:"invalid",
        errorPlacement: function(error, element){
            error.insertAfter(element)
        },
        submitHandler: function(form){
            saveData();
        }
    });
}

function saveData(){
    
}

function validaData(){
    var parametros = $("#frm-acceso").serialize();
    
    $.ajax({
     type:"post",
     url:url_valida,
     dataType:'json',
     data: parametros,
     success: function (response){
        if (response['status']){
            $("#usr").val('');
            $("#pwd").val('');
            $("#usr").focus();
            document.location.href = "http://localhost/ejemplo_pg/web/app_dev.php/cursos/";
            Materialize.toast('OK Se Valido',5000);    
        } else {
            Materialize.toast('Error contraseña incorrecta'+response,5000);
        }
     },
     error: function(request,status,error){
         Materialize.toast('Error de acceso',5000);
     }
   });
}
