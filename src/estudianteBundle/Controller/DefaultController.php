<?php

namespace estudianteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('estudianteBundle:Default:index.html.twig');
    }
}
