$(init);
var table = null;

function init(){
    // Configuración del DataTable
    table = $('#cur').DataTable({"aLengthMenu": 
           [[10,25,50,75,100],[10,25,50,75,100]],
           "iDisplaylength":15});
    
    // Activar la validación del formulario
    $('#modalRegistro').modal();
    validateForm();
    
    // Evento clic del floatbutton agregar
    $('#add-record').on("click", function(){
        $('#modalRegistro').modal('open');
        $('#tit').focus();
    });
    
    // clic del boton de guardar
    $('#guardar').on("click",function(){
        $('#frm-cursos').submit();
    });
    
    // Clic del boton de borrar
    $(document).on("click", '.delete', function(){
        var id = $(this).attr("id-record");
        deleteData(id);
    });
    
    // Clic del boton de borrar
    $(document).on("click", '.edit', function(){
        var id = $(this).attr("id-record");
        $("#tit").val(cursos[id]["titcurso"]).next().addClass('active');
        $("#descrip").val(cursos[id]["descripcurso"]).next().addClass('active');
        $("#pk").val(id);
        $("#modalRegistro").modal('open');
        $("#tit").focus();
    });
    
}

function validateForm(){
    $('#frm-cursos').validate({
        rules:{
          'tit':{
                    required: true
                },
          'descrip':{
                      required:true  //,
                      //digits: true
                    }
        },
        messages:{
            'tit':{
                    required: 'Campo requerido'
                  },
            'descrip':{
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
    var id = $("#pk").val();
    var sURL = '';
    var parametros = "";
    if (id > 0){
        sURL = url_update;
        parametros = $("#frm-cursos").serialize();
    }
    else{
        sURL = url_insert;
        parametros = new FormData($("#frm-cursos")[0]);
    }
    $.ajax({
     type:"post",
     url:sURL,
     contentType: false,
     processData:false,
     //dataType:'json',
     data: parametros,
     success: function (response){
        if (response['status']){
            $("#pk").val('0');
            $("#tit").val('');
            $("#descrip").val('');
            $('#modalRegistro').modal('close');
            Materialize.toast('Registro Guardado',5000);
            if (id > 0){ // Esta editando y para actualizar el dataTable elimina el registro y lo inserta
                setRow(response['data'], 'delete');
                setRow(response['data'], 'insert');
            } 
            else{ // Se jecuta cueando agregamos un nuevo registro
                setRow(response['data'], 'insert');
            }
                
        } else {
            Materialize.toast('Error en Guardado'+response,5000);
        }
     },
     error: function(request,status,error){
         Materialize.toast('Error en Guardado',5000);
     }
   });
}

function deleteData(id){
    var x=123;
    $.ajax({
     type:"post",
     url:url_delete,
     dataType:'json',
     data: {"pk":id},
     success: function (response){
        if (response['status']){
            Materialize.toast('Registro Eliminado',5000);
            setRow(response['data'], 'delete');
        } else {
            Materialize.toast('Error no se pudo eliminar'+response,5000);
        }
     },
     error: function(request,status,error){
         Materialize.toast('Error al eliminar',5000);
     }
   });
}

// Función para agregar o eliminar un renglon de la tabla
function setRow(data,action){
    if (action === 'insert') {
        var row = table.row.add([
            data.tit,
            data.descrip,
            '<i class="material-icons edit" id-record="' + data.pk 
                    +'">create</i><i class="material-icons delete" id-record="' + 
                    data.pk + '">delete_forever</i>'
         ]).draw().node();
         $(row).attr('id',data.pk);
        
        //Hay que agregar el nuevo elemento al arreglo json Categorias 
        cursos[data.pk]={
             "idcurso":      data.pk,
             "titcurso":     data.tit,
             "descripcurso": data.descrip,
         }   
    }
    if (action === 'delete'){
        table.row('#'+ data.pk).remove().draw();
    }
}