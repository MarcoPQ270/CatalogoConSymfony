// Código de JavaScript para controlar validaciones del formulario y acciones de los botones
// La ubicación de este archivo es Source Files/web/resources/nomBundle/js/nom.js
$(init);
var table = null;
function init(){
    table = $('#cate').DataTable({
        "aLengthMenu": [[10,25,50,75,100],[10,25,50,75,100]],
        "iDisplayLength": 15
    }); // Define las caracteristicas del dataTable, así como el numero de reg. a desplegar
    
    // Activa la validación del formulario
    $('#modalRegistro').modal();
    validateForm();
    
    // Click del FloatButton agregar
    $('#add-record').on("click",function(){
       $('#modalRegistro').modal('open');
       $("#nomEN").focus();
    });
    
    // Click del boton de guardar en el formulario Modal
    $('#guardar').on("click",function(){ 
       $('#frm-categoria').submit(); 
    });
    
    // Click del boton de eliminar en el icono de la tabla
    $(document).on("click",'.delete',function(){
       var id = $(this).attr('id-record');
       deleteData(id);
    });
    
    // Click del boton de editar en el icono de la tabla
    $(document).on("click",'.edit',function(){
        var id = $(this).attr('id-record');
        $("#nomEN").val(categorias[id]['NombreCategoriaEN']).next().addClass('active');
        $("#nomES").val(categorias[id]['NombreCategoriaES']).next().addClass('active');
        $("#pk").val(id);
        $('#modalRegistro').modal('open');
        $("#nomEN").focus();
    });
}

// Función para validar la información del formulario Modal
function validateForm(){
    $('#frm-categoria').validate({
        rules:{
            'nomEN':{
                required: true
            },
            'nomES':{
                required: true //,
                //digits:true
            }
        },
        messages:{
            'nomEN':{
                required: 'Campo Requerido'
            },
            'nomES':{
                required: 'Campo Requerido' //,
                //digits:'Ingrese solo números'
            }
        },
        errorElement:"div",
        errorClass:"invalid",
        errorPlacement: function(error, element){
            error.insertAfter(element);
        },
        submitHandler:function(form){
            saveData();
        }
    });
}

// Función para agregar o actualizar un registro de la BD usando AJAX
function saveData(){
    var id = $("#pk").val();
    var sUrl = '';
    if (id > 0){
        sUrl = url_update;
    }
    else{
        sUrl = url_insert;
    }
    var parametros = new FormData($("#frm-categoria")[0]);
    $.ajax({
     type:"post",
     url:sUrl,
     contentType: false,
     processData:false,
     //dataType:'json',
     data: parametros,    //$("#frm-categoria").serialize(),
     success: function (response){
        if (response['status']){
            $("#pk").val('0');
            $("#nomEN").val('');
            $("#nomES").val('');
            $('#modalRegistro').modal('close');
            Materialize.toast('Registro Guardado',5000);
            if (id > 0){
                setRow(response['data'], 'delete');
                setRow(response['data'], 'insert');
            } 
            else{
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

// Función para eliminar un registro de la BD usando AJAX
function deleteData(id){
    $.ajax({
     type:"post",
     url:url_delete,
     dataType:'json',
     data: {'pk':id},
     success: function (response){
         if (response['status']){
             $('#modalRegistro').modal('close');
             Materialize.toast('Registro Eliminado',5000);
             setRow(response['data'], 'delete');
         } else {
             Materialize.toast('Error al Eliminar',5000);
         }
       
     },
     error: function(request,status,error){
          Materialize.toast('Error al Eliminar',5000);
     }
    });
}

// Función para agregar o eliminar un renglon de la tabla
function setRow(data,action){
    if (action === 'insert') {
        var row = table.row.add([
            data.nomEN,
            data.nomES,
            '<i class="material-icons edit" id-record="' + data.pk 
                    +'">create</i><i class="material-icons delete" id-record="' + 
                    data.pk + '">delete_forever</i>'
         ]).draw().node();
         $(row).attr('id',data.pk);
        
        //Hay que agregar el nuevo elemento al arreglo json Categorias 
         
         categorias[data.pk]={
             "idCategoria":       data.pk,
             "NombreCategoriaEN": data.nomEN,
             "NombreCategoriaES": data.nomES,
         }   
    }
    if (action === 'delete'){
        table.row('#'+ data.pk).remove().draw();
    }
}
