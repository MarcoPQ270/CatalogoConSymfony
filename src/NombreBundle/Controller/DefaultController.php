<?php

namespace NombreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use NombreBundle\Model\NombreModel;

class DefaultController extends Controller
{
    protected $NombreModel;

    public function __construct(){
        $this->NombreModel = new NombreModel();
    }
    public function indexAction()
    {
        $result = $this->NombreModel->getEstudiantes();
        $estudiantes=$result['data'];
        return $this->render('NombreBundle:Default:index.html.twig', array('estudiantes'=>$estudiantes));
    }
    public function eliminarEstudianteAction(Request $request)
    {
        if($request->getMethod()== 'POST'){
            $post = $request->request->all();
            $result = $this->NombreModel->eliminar($post);
            if($result['status'])
                return new JsonResponse(array('status'=>TRUE, 'data'=>$post));
            else
                return new JsonResponse(array('status'=>FALSE, 'data'=>''));
        }
    }

    public function insertarEstudianteAction(Request $request)
    {
        if($request->getMethod()== 'POST'){
            $post = $request->request->all();
            $result = $this->NombreModel->insertar($post);
            if($result['status']){
                if(array_key_exists('idestu',$result['data'][0]));
                    $post['pk']=$result['data'][0]['idestu'];
                return new JsonResponse(array('status'=>TRUE, 'data'=>$post));
            }
            return new JsonResponse(array('status'=>FALSE, 'data'=>''));
        }
    }
    public function ActualizarEstudianteAction(Request $request)
    {
        if($request->getMethod()== 'POST'){
            $post = $request->request->all();
            $result = $this->NombreModel->actualizar($post);
            if($result['status'])
            return new JsonResponse(array('status'=>TRUE, 'data'=>$post));
        else
            return new JsonResponse(array('status'=>FALSE, 'data'=>''));
        }
    }

}
