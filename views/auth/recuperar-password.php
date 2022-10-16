<h1 class="nombre-pagina">Recuperar Password</h1>
<p class="descripcion-pagina">Coloca tu nueva contraseña a continuacion</p>

<?php include_once __DIR__ . './../templates/alertas.php'; ?>

<?php if($error) return; ?>
<form class="formulario" method="POST">
    <div class="campo">
        <label for="password">Password</label>
        <input 
           type="password"
           id="password"
           name="password"
           placeholder="Tu nuevo Password"
        />
    </div>

    <input type="submit" class="boton" value="Guardar Nueva Contraseña">
</form>

<div class="acciones">
    <a href="/">Ya tienes una cuenta? Inicia Sesion</a>
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crea una</a>
</div>