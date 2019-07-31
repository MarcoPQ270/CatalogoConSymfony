<?php 
namespace NombreBundle\Model;
use Utilerias\SQLBundle\Model\SQLModel;

class NombreModel{
    private $SQLModel;

    public function __construct(){
        $this->SQLModel = new SQLModel();
    }

    public function eliminar($post)
    {
        $where=array(
            'idestu'=>$post['pk']
        );
        $result = $this->SQLModel->deleteFromTable('estudiante', $where);
        return $result;
    }
    public function insertar($post){
        $campos=array(
            "nocontrol"=>"'".$post['no']."'",
            "nombre"=>"'".$post['nom']. "'",
            "edad"=>$post['eda'],
        );
        $result=$this->SQLModel->insertIntoTable("estudiante", $campos,'idestu');
        return $result;
    }

    public function actualizar($post){
        $campos=array(
            "nocontrol"=>"'".$post['no']."'",
            "nombre"=>"'".$post['nom']. "'",
            "edad"=>$post['eda'],
        );
        $cond=array(
            "idestu"=>$post['pk'],
        );
        $result=$this->SQLModel->updatefromTable("estudiante", $campos, $cond,'idestu');
        return $result;
    }
    public function getEstudiantes(){
        $campos_select = array(
            'idestu',
            'nocontrol',
            'nombre',
            'edad',
        );
      //  $where = array(
        //    'nocontrol'->''
        //);
        $result = $this->SQLModel->selectFromTable('estudiante',$campos_select);
        $data=array();
        foreach($result['data'] as $key=>$value){
            $data[$value['idestu']]=$value;
        }
        $result['data']=$data;
        return $result;
    }
}
?>