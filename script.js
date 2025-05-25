//  Carrusel
const carrusel = document.querySelector('.carrusel');
const carruselItems = document.querySelectorAll('.carrusel-item');
const carruselPrev = document.querySelector('.carrusel-prev');
const carruselNext = document.querySelector('.carrusel-next');

let currentIndex = 0;

function actualizarCarrusel() {
    carrusel.style.transform = `translateX(${-currentIndex * 310}px)`;  //  300px ancho + 10px gap
}

function siguienteItem() {
    currentIndex = (currentIndex + 1) % carruselItems.length;
    actualizarCarrusel();
}

function anteriorItem() {
    currentIndex = (currentIndex - 1 + carruselItems.length) % carruselItems.length;
    actualizarCarrusel();
}

carruselNext.addEventListener('click', siguienteItem);
carruselPrev.addEventListener('click', anteriorItem);

//  Seleccionar elementos del DOM (Tienda)

const productosGrid = document.querySelector('.productos-grid');
const favoritosTiendaLista = document.querySelector('.favoritos-tienda-lista');
const favoritosTiendaSeccion = document.querySelector('.favoritos-tienda');
const sinFavoritosTienda = document.querySelector('.sin-favoritos-tienda');
const botonesAgregarCarrito = document.querySelectorAll('.add-to-cart-button');

//  Inicializar el array de favoritos desde localStorage (si existe)
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
actualizarFavoritosTiendaLista();  //  Llamar a la función para mostrar los favoritos iniciales

/* =========================================
    JAVASCRIPT LOGIN.HTML y REGISTRO.HTML (VALIDACIONES)
    ========================================= */

// Elemento para mostrar mensajes de error/éxito (único para login y registro)
const mensajeError = document.createElement('p');
mensajeError.classList.add('error-message');

// Función para mostrar mensajes
function mostrarMensaje(form, mensaje, esError = false) {
    mensajeError.textContent = mensaje;
    mensajeError.style.color = esError ? 'red' : 'green';
    // Asegúrate de que el formulario esté en el DOM antes de intentar insertar el mensaje
    if (form) {
        const existingMessage = form.previousElementSibling;
        if (existingMessage && existingMessage.classList.contains('error-message')) {
            existingMessage.remove(); // Remove the old message if it exists
        }
        form.parentNode.insertBefore(mensajeError, form);
    }
}

// Función para validar el formato del email
function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar el formulario (genérica para login y registro)
function validarFormulario(formType, username, email, password, confirmPassword) {
    let valido = true;

    if (username !== undefined && username.trim() === '') {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Por favor, ingresa tu nombre de usuario.', true);
        valido = false;
    }

    if (email !== undefined && email.trim() === '') {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Por favor, ingresa tu email.', true);
        valido = false;
    } else if (email !== undefined && !esEmailValido(email)) {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Por favor, ingresa un email válido.', true);
        valido = false;
    } else if (formType === 'registro' && !simularEmailNoRegistrado(email)) {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Este email ya está registrado. Inicia sesión.', true);
        valido = false;
    } else if (formType === 'login' && !simularCorreoRegistrado(email)) {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Este correo no está registrado. Regístrate primero.', true);
        valido = false;
    }

    if (password !== undefined && password.trim() === '') {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Por favor, ingresa tu contraseña.', true);
        valido = false;
    }

    if (confirmPassword !== undefined && confirmPassword.trim() === '') {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Por favor, confirma tu contraseña.', true);
        valido = false;
    } else if (confirmPassword !== undefined && password !== confirmPassword) {
        mostrarMensaje(document.querySelector(`.${formType}-form`), 'Las contraseñas no coinciden.', true);
        valido = false;
    }

    return valido;
}

// Función para simular la verificación de correo registrado (¡REEMPLAZAR CON TU LÓGICA DE BACKEND!)
function simularCorreoRegistrado(email) {
    const correosRegistrados = ['rick@universe.com', 'morty@universe.com', 'beth@universe.com']; // Simulación
    return correosRegistrados.includes(email);
}

// Función para simular la verificación de email no registrado (¡REEMPLAZAR CON TU LÓGICA DE BACKEND!)
function simularEmailNoRegistrado(email) {
    const correosRegistrados = ['rick@universe.com', 'morty@universe.com']; // Simulación
    return !correosRegistrados.includes(email); // Invertido para registro
}

// Manejar el envío del formulario de login
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    const userEmailInput = document.querySelector('#user-email');
    const passwordInput = document.querySelector('#login-password');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (validarFormulario('login', undefined, userEmailInput.value, passwordInput.value, undefined)) {
            // Aquí iría la lógica real de inicio de sesión
            alert('¡Inicio de sesión exitoso! (Simulado)');
            // Puedes redirigir a otra página: window.location.href = 'main.html';
        }
    });

    // Opcional: Recordar usuario (solo email, ¡NUNCA contraseñas!)
    const recordarUsuario = () => {
        const emailGuardado = localStorage.getItem('usuarioEmail');
        if (emailGuardado) {
            userEmailInput.value = emailGuardado;
        }

        userEmailInput.addEventListener('change', () => {
            localStorage.setItem('usuarioEmail', userEmailInput.value);
        });
    };

    recordarUsuario();
}

// Manejar el envío del formulario de registro
const registroForm = document.querySelector('.registro-form');
if (registroForm) {
    const usernameInput = document.querySelector('#username');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const confirmPasswordInput = document.querySelector('#confirm-password');

    registroForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (validarFormulario('registro', usernameInput.value, emailInput.value, passwordInput.value, confirmPasswordInput.value)) {
            // Aquí iría la lógica real de registro
            alert('¡Registro exitoso!');
            // Puedes redirigir a otra página: window.location.href = 'login.html';
        }
    });
}

//  Manejar el clic en los iconos de favorito
function manejarClickFavorito(event) {
    if (event.target.classList.contains('favorito-icon')) {
        const nombreProducto = event.target.dataset.productoNombre;
        event.target.classList.toggle('active');  // Alternar la clase 'active'

        if (favoritos.includes(nombreProducto)) {
            favoritos = favoritos.filter(producto => producto !== nombreProducto); // Eliminar de favoritos
        } else {
            favoritos.push(nombreProducto); // Añadir a favoritos
        }
        actualizarFavoritosTiendaLista(); // Actualizar la visualización
    }
}

//  Manejar el clic en los botones "Añadir al Carrito"
botonesAgregarCarrito.forEach(boton => {
    boton.addEventListener('click', () => {
        const nombreProducto = boton.parentElement.querySelector('h3').textContent;
        alert(`¡${nombreProducto} añadido al carrito de compras!`);
        //  Aquí iría la lógica real para añadir el producto al carrito
    });
});

//  Event listeners (Tienda)
if (productosGrid) {
    productosGrid.addEventListener('click', manejarClickFavorito);
}

if (favoritosTiendaLista) {
    favoritosTiendaLista.addEventListener('click', (event) => {
        if (event.target.classList.contains('remover-favorito')) {
            const nombreProducto = event.target.dataset.productoNombre;
            favoritos = favoritos.filter(producto => producto !== nombreProducto);
            actualizarFavoritosTiendaLista();
            //  Opcional: Desactivar la estrella correspondiente en la lista de productos
            const estrella = document.querySelector(`.favorito-icon[data-producto-nombre="${nombreProducto}"]`);
            if (estrella) {
                estrella.classList.remove('active');
            }
        }
    });
}

//  Inicializar la visualización de favoritos al cargar la página (Tienda)
function actualizarFavoritosTiendaLista() {
    favoritosTiendaLista.innerHTML = '';  // Limpiar la lista antes de actualizar
    if (favoritos.length === 0) {
        sinFavoritosTienda.style.display = 'block';
    } else {
        sinFavoritosTienda.style.display = 'none';
        favoritos.forEach(producto => {
            const li = document.createElement('li');
            li.classList.add('favorito-tienda-item');
            li.innerHTML = `
                <span>${producto}</span>
                <button class="remover-favorito" data-producto-nombre="${producto}">X</button>
            `;
            favoritosTiendaLista.appendChild(li);
        });
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));  // Guardar en localStorage
}