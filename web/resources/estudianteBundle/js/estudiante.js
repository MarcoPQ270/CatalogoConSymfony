$(init);
var table = null;
var estudiantes = null;
var tr = null;
function init() {
    table = $("#estu").DataTable({
        "aLengthMenu": [[10, 25, 50, 75, 100], [10, 25, 50, 75, 100]],
        "iDisplayLength": 15
    });//definiendo las caracteristicas del datatable 

    table.on('click', '.delete', function () {
        $tr = $(this).closest('tr');
        tr = $tr;
        var id = $(this).attr("data-id");
        $.ajax({
            type: "post",
            url: urlDelete,
            datatype: 'json',
            data: { 'pk': id },
            success: function (respuesta) {
                if (respuesta['status']) {
                    table.row($tr).remove().draw();

                    Materialize.toast('Registro eliminado', 5000);
                    // setRow(respuesta['data'],'delete');
                } else
                    Materialize.toast('Error al eliminar estudiante', 5000);
            }
        });
    });
    table.on('click', '.edit', function () {
        $tr = $(this).closest('tr');
        table.row($tr).remove().draw();
    });


    $("#modalReg").modal();
    validateform();

    $("#add-record").on("click", function () {
        $("#modalReg").modal('open');
        $("#no").focus();
    });

    $("#guardar").on("click", function () {
        $("#frmEstu").submit();
    });

    $(".edit").on("click", function () {
        $("#pk").val($(this).attr("data-id"));
        $("#no").val($(this).attr("data-no"));
        $("#nom").val($(this).attr("data-nom"));
        $("#eda").val($(this).attr("data-eda"));
        $("#no").focus();
        $("#modalReg").modal('open');
    });

    $(".delete").on("click", function () {
        /*  var id = $(this).attr("data-id");
          $.ajax({
              type:"post",
              url:urlDelete,
              datatype:'json',
              data:{'pk':id},
              success: function(respuesta){
                  if(respuesta['status']){
                   Materialize.toast('Registro eliminado', 5000);
                   setRow(respuesta['data'],'delete');
                  }else
                  Materialize.toast('Error al eliminar estudiante', 5000);
               }
          });//fin ajax
   
          */
    });
}

function validateform() {
    $("#frmEstu").validate({
        rules: {
            'no': { required: true },
            'nom': { required: true },
            'eda': { required: true }
        },

        messages: {
            'no': { required: 'campo requerido' },
            'nom': { required: 'falta el nombre del estudiante' },
            'eda': { required: 'falta la edad del estudiante' }
        },
        errorElement: "div",
        errorClass: "invalid",
        errorPlacement: function (error, element) {
            error.insertAfter(element)
        },
        submitHandler: function (form) {
            saveClick();
        }
    });
}

function saveClick() {
    var id = $('#pk').val();
    var sURL = ''
    if (id > 0)
        sURL = urlUpdate;
    else
        sURL = urlInsert;
    $.ajax({
        type: "post",
        url: sURL,
        datatype: 'json',
        data: $("#frmEstu").serialize(),
        success: function (respuesta) {
            if (respuesta['status']) {
                $("#pk").val("0");
                $("#no").val("");
                $("#nom").val("");
                $("#eda").val("0");
                $('#no').focus();
                $("#modalReg").modal('close');
                if (id === '0') {
                    Materialize.toast('Registro Agregado', 5000);

                } else {
                    Materialize.toast('Registro actualizado', 5000);
                }

            }
            setRow(respuesta['data'], 'insert');




        }//fin succes
    });//fin Ajax
}//fin clic

function setRow(data, action) {
    console.log(action);
    if (action == 'insert') {
        console.log("insert");
        var row = table.row.add([
            data.no,
            data.nom,
            data.eda,
            '<i class="material-icons edit" data-id="' + data.pk + '" data-no="' + data.no + '"data-nom="' + data.nom + '" data-eda="' + data.eda + '">create</i>' +
            '<i class="material-icons delete" data-id="' + data.pk + '">delete_forever</i>'
        ]).draw().node();
        $(row).attr('id', data.pk);
        estudiantes[data.pk] = {
            "idestu": data.pk,
            "nocontrol": data.no,
            "nombre": data.nom,
            "edad": data.eda,
        }
    }//Fin primer if
    if (action == 'delete') {
        console.log("delete");

        table.row('#' + data.pk).remove.draw();
    }//fin segundo if
}//fin setRow