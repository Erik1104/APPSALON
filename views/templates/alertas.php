<?php
  foreach($alertas as $key => $mensajes): //iterar sobre las alertas, ver si es error, y mostrar mensaje
    foreach($mensajes as $mensaje): //iterar que mensaje es
?>        
  <div class="alerta <?php echo $key; ?>">
     <?php echo $mensaje; ?>
  </div>

<?php
    endforeach;
  endforeach;
?>