let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp () {
    mostrarSeccion(); //MUESTRA Y OCULTA LAS SECCIONES
    tabs(); //CAMBIA LA SECCION CUANDO SE PRESIONEN LOS TABS
    botonesPaginador(); //AGREGA O QUITA LOS BOTONES DEL PAGINADOR
    paginaSiguiente();
    paginaAnterior();

    consultarApi(); //consulta la api en el backend de php

    idCliente();
    nombreCliente(); //Añade el nombre del cliente al objeto de cita

    seleccionarFecha(); //Añade la fecha de la cita en el objeto
    seleccionarHora(); //Añade la hora de la cita en el objeto

    mostrarResumen(); //Muestra el resumen de la cita
}



function mostrarSeccion () {

    //Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');

    if(seccionAnterior) {
      seccionAnterior.classList.remove('mostrar');
    }

    //SELECCIONAR LA SECCION  CON EL PASO
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');

    //QUITA LA CLASE DE ACTUAL AL TAB ANTERIOR
    const tabAnterior = document.querySelector('.actual');

    if(tabAnterior) {
        tabAnterior.classList.remove('actual')
    }

    //RESALTA EL TAB ACTUAL
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}


function tabs () {

    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();
        }); 
    });
}


function botonesPaginador () {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {

        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    } else if(paso === 3) {

        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();

    } else {

        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    }

    mostrarSeccion();
}


function paginaAnterior () {
    const paginaAnterior = document.querySelector('#anterior');
    
    paginaAnterior.addEventListener('click', function () {

        if(paso <= pasoInicial) return;

        paso--;

        botonesPaginador();
    });
}


function paginaSiguiente () {

    const paginaSiguiente = document.querySelector('#siguiente');
    
    paginaSiguiente.addEventListener('click', function () {

        if(paso >= pasoFinal) return;

        paso++;

        botonesPaginador();
    })
}





 async function consultarApi () {

    try {
        const url = 'https://appsalonsteve.herokuapp.com/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios (servicios) {

    servicios.forEach(servicio =>  {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio (servicio) {
    const {id} = servicio;
    const {servicios} = cita;

    //identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    //COMPROBAR SI UN SERVICIO YA FUE AGRAGADO
    if(servicios.some( agregado => agregado.id === id )) {
        //Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        //Agregarlo
        cita.servicios = [...servicios, servicio] //los tres puntos agregan una copia de lo que hay en el arreglo de servicios, y lo agrega al objeto de servicio
        divServicio.classList.add('seleccionado');
    }
}


function idCliente () {
    cita.id =document.querySelector('#id').value;
}

function nombreCliente () {
    cita.nombre = document.querySelector('#nombre').value;
}



function seleccionarFecha () {
    const inputFecha = document.querySelector('#fecha');
    
    inputFecha.addEventListener('input', function (e) {

        const dia = new Date(e.target.value).getUTCDay(); //obtener el dia que eligio, con utcday puedo ver q dia de la sema a es, domingo es igual a 0, sabado a 6

        if([6, 0].includes(dia)) /*verificar si el 6 o 0 se incluyen en el arreglo de dia*/ {
            e.target.value = ''; //evitar que se quede la hora no valida
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora () {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', function (e) {

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0]; //split permite separar un string
        
        if(hora < 10 || hora > 18) {
            e.target.value = ''; //evitar que se quede la hora no valida
            mostrarAlerta('Hora no valida', 'error', '.formulario');
        } else {
            cita.hora =  e.target.value;
        }
    });
}

function mostrarAlerta (mensaje, tipo, elemento, desaparece = true) {
    
    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    //crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}



function mostrarResumen () {
    const resumen = document.querySelector('.contenido-resumen');

    //Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('')) {
        mostrarAlerta('Faltan datos de servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    }

    //Formatear div de resumen
    const {nombre, fecha, hora, servicios} = cita;

    //heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';
    resumen.appendChild(headingServicios);

    //iterando y mostrando los servicios
    servicios.forEach(servicio => {

        const {precio, nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    
    //heading para cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de cita';
    resumen.appendChild(headingCita);


    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span>${nombre}`;

    //FORMATEAR LA FECHA EN ESPAÑOL
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>${hora} Horas`;

    //Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;


    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}



async function reservarCita () {

    const {nombre, fecha, hora, servicios, id} = cita;
    
    const idServicios = servicios.map(  servicio => servicio.id);

    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);


    try {
        //PETICION HACIA LA API
        const url = 'http://localhost:3000/api/citas';

        const respuesta = await fetch(url, {
           method: 'POST',
           body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado);

        if(resultado.resultado) {
           Swal.fire({
               icon: 'success',
               title: 'Cita Creada',
               text: 'Tu Cita fue creada correctamente.',
               button: 'OK'
            }).then( () => {
                setTimeout(() => {
                   window.location.reload();
                }, 3000);
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita:('
          });
    }
    //console.log([...datos]);
}