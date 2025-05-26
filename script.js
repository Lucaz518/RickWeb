//  Carrusel (sin cambios)
const carrusel = document.querySelector('.carrusel');
const carruselItems = document.querySelectorAll('.carrusel-item');
const carruselPrev = document.querySelector('.carrusel-prev');
const carruselNext = document.querySelector('.carrusel-next');

let currentIndex = 0;

function actualizarCarrusel() {
    carrusel.style.transform = `translateX(${-currentIndex * 310}px)`;
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

//  Tienda (sin cambios)
const productosGrid = document.querySelector('.productos-grid');
const favoritosTiendaLista = document.querySelector('.favoritos-tienda-lista');
const favoritosTiendaSeccion = document.querySelector('.favoritos-tienda');
const sinFavoritosTienda = document.querySelector('.sin-favoritos-tienda');
const botonesAgregarCarrito = document.querySelectorAll('.add-to-cart-button');

let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
actualizarFavoritosTiendaLista();

/* =========================================
    JAVASCRIPT LOGIN.HTML y REGISTRO.HTML (VALIDACIONES Y ROLES)
    ========================================= */

// Usuarios predefinidos (SIMULACIÓN - ¡REEMPLAZAR CON TU LÓGICA DE BACKEND!)
const usuariosPredefinidos = [
    { username: 'rick', email: 'rick@universe.com', password: 'password123', rol: 'cientifico' },
    { username: 'morty', email: 'morty@universe.com', password: 'password123', rol: 'estudiante' },
    { username: 'summer', email: 'summer@universe.com', password: 'password123', rol: 'aventurero' }
];

// Elemento para mostrar mensajes de error/éxito
const mensajeError = document.createElement('p');
mensajeError.classList.add('error-message');

function mostrarMensaje(form, mensaje, esError = false) {
    mensajeError.textContent = mensaje;
    mensajeError.style.color = esError ? 'red' : 'green';
    if (form) {
        const existingMessage = form.previousElementSibling;
        if (existingMessage && existingMessage.classList.contains('error-message')) {
            existingMessage.remove();
        }
        form.parentNode.insertBefore(mensajeError, form);
    }
}

function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función modificada para verificar credenciales y obtener el rol
function verificarCredenciales(email, password) {
    for (const usuario of usuariosPredefinidos) {
        if (usuario.email === email && usuario.password === password) {
            return usuario.rol; // Retorna el rol si las credenciales coinciden
        }
    }
    return null; // Retorna null si no coinciden
}

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

// Manejar el envío del formulario de login
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    const userEmailInput = document.querySelector('#user-email');
    const passwordInput = document.querySelector('#login-password');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (validarFormulario('login', undefined, userEmailInput.value, passwordInput.value, undefined)) {
        const rolUsuario = verificarCredenciales(userEmailInput.value, passwordInput.value);
        if (rolUsuario) {
            localStorage.setItem('usuarioRol', rolUsuario);
            console.log('Rol guardado:', rolUsuario);
            window.location.href = 'main.html';
        } else {
            mostrarMensaje(loginForm, 'Credenciales incorrectas.', true);
        }
    }
});

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
            // Aquí iría la lógica real de registro (enviar al servidor, etc.)
            alert('¡Registro exitoso! (Simulado)');
            window.location.href = 'login.html'; // Redirigir a login.html
        }
    });
}

//  Tienda
function manejarClickFavorito(event) {
    if (event.target.classList.contains('favorito-icon')) {
        const nombreProducto = event.target.dataset.productoNombre;
        event.target.classList.toggle('active');

        if (favoritos.includes(nombreProducto)) {
            favoritos = favoritos.filter(producto => producto !== nombreProducto);
        } else {
            favoritos.push(nombreProducto);
        }
        actualizarFavoritosTiendaLista();
    }
}

botonesAgregarCarrito.forEach(boton => {
    boton.addEventListener('click', () => {
        const nombreProducto = boton.parentElement.querySelector('h3').textContent;
        alert(`¡${nombreProducto} añadido al carrito de compras!`);
    });
});

if (productosGrid) {
    productosGrid.addEventListener('click', manejarClickFavorito);
}

if (favoritosTiendaLista) {
    favoritosTiendaLista.addEventListener('click', (event) => {
        if (event.target.classList.contains('remover-favorito')) {
            const nombreProducto = event.target.dataset.productoNombre;
            favoritos = favoritos.filter(producto => producto !== nombreProducto);
            actualizarFavoritosTiendaLista();
            const estrella = document.querySelector(`.favorito-icon[data-producto-nombre="${nombreProducto}"]`);
            if (estrella) {
                estrella.classList.remove('active');
            }
        }
    });
}

function actualizarFavoritosTiendaLista() {
    favoritosTiendaLista.innerHTML = '';
    if (favoritos.length === 0) {
        sinFavoritosTienda.style.display = 'block';
    } else {
        sinFavoritosTienda.style.display = 'none';
        favoritos.forEach(producto => {
            const li = document.createElement('li');
            li.classList.add('favorito-tienda-item');
            li.innerHTML = `
                <span><span class="math-inline">\{producto\}</span\>
<button class\="remover\-favorito" data\-producto\-nombre\="</span>{producto}">X</button>
            `;
            favoritosTiendaLista.appendChild(li);
        });
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}