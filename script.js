// =========================================
//  Carrusel (Lógica para index.html)
// =========================================
const carrusel = document.querySelector('.carrusel');
const carruselItems = document.querySelectorAll('.carrusel-item');
const carruselPrev = document.querySelector('.carrusel-prev');
const carruselNext = document.querySelector('.carrusel-next');

let currentIndex = 0;

function actualizarCarrusel() {
    if (carrusel) { // Asegurarse de que el carrusel exista
        carrusel.style.transform = `translateX(${-currentIndex * 310}px)`; // 300px ancho + 10px gap
    }
}

function siguienteItem() {
    if (carruselItems.length > 0) {
        currentIndex = (currentIndex + 1) % carruselItems.length;
        actualizarCarrusel();
    }
}

function anteriorItem() {
    if (carruselItems.length > 0) {
        currentIndex = (currentIndex - 1 + carruselItems.length) % carruselItems.length;
        actualizarCarrusel();
    }
}

// Añadir event listeners solo si los botones existen
if (carruselNext && carruselPrev) {
    carruselNext.addEventListener('click', siguienteItem);
    carruselPrev.addEventListener('click', anteriorItem);
}


/* =========================================
    JAVASCRIPT LOGIN.HTML y REGISTRO.HTML (VALIDACIONES Y ROLES)
    ========================================= */

// Usuarios predefinidos (SIMULACIÓN - ¡REEMPLAZAR CON TU LÓGICA DE BACKEND!)
const usuariosPredefinidos = [
    { username: 'rick', email: 'rick@universe.com', password: 'password123', rol: 'cientifico' },
    { username: 'morty', email: 'morty@universe.com', password: 'password123', rol: 'estudiante' },
    { username: 'summer', email: 'summer@universe.com', password: 'password123', rol: 'aventurero' }
];

// Elemento para mostrar mensajes de error/éxito (global para reuso)
const mensajeErrorElement = document.createElement('p');
mensajeErrorElement.classList.add('error-message');

function mostrarMensaje(formElement, mensaje, esError = false) {
    // Eliminar cualquier mensaje existente antes de agregar uno nuevo
    const existingMessage = formElement.parentNode.querySelector('.error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    mensajeErrorElement.textContent = mensaje;
    mensajeErrorElement.style.color = esError ? 'red' : 'green';
    formElement.parentNode.insertBefore(mensajeErrorElement, formElement);
}

function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function verificarCredenciales(email, password) {
    for (const usuario of usuariosPredefinidos) {
        if (usuario.email === email && usuario.password === password) {
            return usuario.rol;
        }
    }
    return null;
}

function validarFormulario(formType, username, email, password, confirmPassword) {
    let valido = true;
    const currentForm = document.querySelector(`.${formType}-form`);
    
    // Limpiar mensaje de error anterior
    const existingMessage = currentForm.parentNode.querySelector('.error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Validación de campos
    if (username !== undefined && username.trim() === '') {
        mostrarMensaje(currentForm, 'Por favor, ingresa tu nombre de usuario.', true);
        valido = false;
    }

    if (email !== undefined && email.trim() === '') {
        mostrarMensaje(currentForm, 'Por favor, ingresa tu email.', true);
        valido = false;
    } else if (email !== undefined && !esEmailValido(email)) {
        mostrarMensaje(currentForm, 'Por favor, ingresa un email válido.', true);
        valido = false;
    }

    if (password !== undefined && password.trim() === '') {
        mostrarMensaje(currentForm, 'Por favor, ingresa tu contraseña.', true);
        valido = false;
    }

    if (confirmPassword !== undefined && confirmPassword.trim() === '') {
        mostrarMensaje(currentForm, 'Por favor, confirma tu contraseña.', true);
        valido = false;
    } else if (confirmPassword !== undefined && password !== confirmPassword) {
        mostrarMensaje(currentForm, 'Las contraseñas no coinciden.', true);
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

        // Limpiar mensaje de error anterior antes de validar
        const existingMessage = loginForm.parentNode.querySelector('.error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (validarFormulario('login', undefined, userEmailInput.value, passwordInput.value, undefined)) {
            const rolUsuario = verificarCredenciales(userEmailInput.value, passwordInput.value);
            if (rolUsuario) {
                localStorage.setItem('usuarioRol', rolUsuario); // Guardar el rol
                console.log('Rol guardado:', rolUsuario); // Depuración para verificar el rol
                window.location.href = 'main.html'; // Redirigir a main.html
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

        // Limpiar mensaje de error anterior antes de validar
        const existingMessage = registroForm.parentNode.querySelector('.error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const emailExiste = usuariosPredefinidos.some(user => user.email === emailInput.value);
        if (emailExiste) {
            mostrarMensaje(registroForm, 'Este email ya está registrado. Por favor, inicia sesión.', true);
            return;
        }

        if (validarFormulario('registro', usernameInput.value, emailInput.value, passwordInput.value, confirmPasswordInput.value)) {
            alert('¡Registro exitoso! (Simulado)');
            window.location.href = 'login.html';
        }
    });
}


/* =========================================
    JAVASCRIPT MAIN.HTML (CARGA DE PERSONAJES DESDE API, FAVORITOS Y DETALLE)
    ========================================= */

// Seleccionar elementos del DOM para main.html (solo si existen en la página actual)
const personajesGrid = document.getElementById('personajes-grid');
const loadMoreButton = document.getElementById('load-more-button');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const nombreUsuarioSpan = document.querySelector('#nombre-usuario'); // Para mostrar el nombre de usuario
const mensajeSinSesion = document.getElementById('mensaje-sin-sesion'); // Mensaje "Inicia sesión..."
const noResultsMessage = document.getElementById('no-results-message'); // Mensaje "No se encontraron..."

// Elementos del Modal de Detalle (NUEVOS)
const personajeDetalleModal = document.getElementById('personaje-detalle-modal');
const cerrarModalButton = document.getElementById('cerrar-modal-button');
const modalImagen = document.getElementById('modal-imagen');
const modalNombre = document.getElementById('modal-nombre');
const modalEspecie = document.getElementById('modal-especie');
const modalEstado = document.getElementById('modal-estado');
const modalGenero = document.getElementById('modal-genero');
const modalOrigen = document.getElementById('modal-origen');
const modalUbicacion = document.getElementById('modal-ubicacion');
const modalEpisodiosLista = document.getElementById('modal-episodios-lista');


const RICK_AND_MORTY_API_BASE_URL = 'https://rickandmortyapi.com/api/character/';
const EPISODE_API_BASE_URL = 'https://rickandmortyapi.com/api/episode/'; // Nueva URL para episodios
let currentPage = 1;
const maxCharactersToShow = 80; // Queremos un total de 80 personajes (máximo)
let loadedCharactersCount = 0; // Contador de personajes cargados

// Array para almacenar los IDs de personajes favoritos en localStorage
let favoritosPersonajes = JSON.parse(localStorage.getItem('favoritosPersonajes')) || [];


// Función para crear una tarjeta de personaje
function crearPersonajeCard(personaje) {
    const isFavorite = favoritosPersonajes.includes(personaje.id);
    const favIconClass = isFavorite ? 'fas' : 'far'; // fas para sólido, far para regular (si usas Font Awesome)

    const card = document.createElement('div');
    card.classList.add('personaje-card');
    card.dataset.id = personaje.id; // Almacenar el ID de la API en el dataset

    card.innerHTML = `
        <img src="${personaje.image}" alt="${personaje.name}">
        <h3>${personaje.name}</h3>
        <p>Especie: ${personaje.species}</p>
        <p>Estado: ${personaje.status}</p>
        <i class="${favIconClass} fa-star fav-icon" data-id="${personaje.id}"></i>
    `;

    // Añadir event listener para el ícono de favorito
    const favIcon = card.querySelector('.fav-icon');
    favIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el clic en la estrella active el card
        toggleFavorite(personaje.id, favIcon);
    });

    // Añadir event listener para abrir el modal al hacer clic en la tarjeta (NO en la estrella)
    card.addEventListener('click', () => {
        mostrarDetallePersonaje(personaje);
    });

    return card;
}

// Función para alternar favorito
function toggleFavorite(characterId, iconElement) {
    const id = parseInt(characterId); // Asegurarse de que sea un número
    if (favoritosPersonajes.includes(id)) {
        favoritosPersonajes = favoritosPersonajes.filter(favId => favId !== id);
        iconElement.classList.remove('fas');
        iconElement.classList.add('far');
    } else {
        favoritosPersonajes.push(id);
        iconElement.classList.remove('far');
        iconElement.classList.add('fas');
    }
    localStorage.setItem('favoritosPersonajes', JSON.stringify(favoritosPersonajes));
    console.log('Favoritos actuales:', favoritosPersonajes); // Para depuración
}


// Función para cargar personajes desde la API
async function fetchCharacters(page = 1, name = '') {
    let url = `${RICK_AND_MORTY_API_BASE_URL}?page=${page}`;
    if (name) {
        url += `&name=${name}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404 && name) { // Si es un 404 por búsqueda sin resultados
                return { results: [], info: { pages: 0 } };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching characters:', error);
        return { results: [], info: { pages: 0 } }; // Devolver un objeto vacío en caso de error
    }
}

// Función para mostrar personajes en el DOM
async function displayCharacters(characters, append = false, isSearch = false) {
    if (!append) {
        personajesGrid.innerHTML = ''; // Limpiar si no estamos añadiendo más
        loadedCharactersCount = 0; // Reiniciar el contador si no estamos añadiendo
    }

    if (characters.length === 0) {
        noResultsMessage.style.display = 'block';
        loadMoreButton.style.display = 'none'; // Ocultar botón si no hay resultados
        return;
    } else {
        noResultsMessage.style.display = 'none';
        // loadMoreButton.style.display = 'block'; // Se ajusta al final de la función loadMainPageCharacters o en el listener
    }

    for (const personaje of characters) {
        if (loadedCharactersCount < maxCharactersToShow || isSearch) { // Siempre mostrar búsqueda, limitar carga normal
            personajesGrid.appendChild(crearPersonajeCard(personaje));
            loadedCharactersCount++;
        } else {
            break; // Detener si ya hemos cargado el máximo para la carga inicial/normal
        }
    }
}


// Función principal para cargar la página de personajes
async function loadMainPageCharacters(searchTerm = '') {
    // Solo si los elementos específicos de main.html existen, ejecutar esta lógica
    if (personajesGrid && loadMoreButton && searchInput) { 
        const rolUsuario = localStorage.getItem('usuarioRol');

        if (nombreUsuarioSpan) { // Asegurarse de que el elemento exista
            if (rolUsuario) {
                nombreUsuarioSpan.textContent = rolUsuario.toUpperCase();
                mensajeSinSesion.style.display = 'none'; // Ocultar si hay sesión
            } else {
                nombreUsuarioSpan.textContent = ''; // Limpiar si no hay usuario
                mensajeSinSesion.style.display = 'block'; // Mostrar si no hay sesión
            }
        }


        personajesGrid.innerHTML = '<div style="text-align: center; width: 100%;"><p>Cargando personajes...</p></div>'; // Mensaje de carga inicial
        loadedCharactersCount = 0; // Reiniciar el contador de personajes cargados

        let allCharacters = [];
        let page = 1;
        let hasMorePages = true;

        // Bucle para cargar hasta el máximo de personajes o hasta que no haya más páginas
        while (loadedCharactersCount < maxCharactersToShow && hasMorePages) {
            const data = await fetchCharacters(page, searchTerm);
            if (data.results && data.results.length > 0) {
                // Añadir solo los necesarios para no exceder maxCharactersToShow
                const charactersToAdd = data.results.slice(0, maxCharactersToShow - loadedCharactersCount);
                allCharacters = allCharacters.concat(charactersToAdd);
                loadedCharactersCount += charactersToAdd.length;
                page++;
                if (!data.info || !data.info.next) { // Si no hay más páginas, detener
                    hasMorePages = false;
                }
            } else {
                hasMorePages = false; // No hay resultados o error, detener
            }

            if (searchTerm && (!data.results || data.results.length === 0)) {
                // Si es una búsqueda y no hay resultados en la primera página, no seguir cargando
                break; 
            }
        }
        
        displayCharacters(allCharacters, false, searchTerm !== ''); // Pasar isSearch si hay término de búsqueda

        // Ajustar visibilidad del botón "Cargar más"
        if (loadedCharactersCount < maxCharactersToShow && hasMorePages && !searchTerm) { // Mostrar si hay más y no es una búsqueda
            loadMoreButton.style.display = 'block';
        } else if (searchTerm && (allCharacters.length < maxCharactersToShow || allCharacters.length === 0)) { // Para búsqueda, si no hay suficientes o si no hay resultados
             loadMoreButton.style.display = 'none';
        }
        else { // Si ya cargamos el máximo o no hay más páginas en la carga normal
            loadMoreButton.style.display = 'none';
        }
    }
}


// Event listener para el botón "Cargar más"
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async () => {
        if (loadedCharactersCount < maxCharactersToShow) {
            currentPage++;
            const data = await fetchCharacters(currentPage);
            if (data.results && data.results.length > 0) {
                const newCharactersToAdd = data.results.slice(0, maxCharactersToShow - loadedCharactersCount);
                displayCharacters(newCharactersToAdd, true); // Añadir los nuevos personajes

                // Ocultar el botón si ya hemos cargado el máximo o no hay más páginas
                if (loadedCharactersCount >= maxCharactersToShow || !data.info.next) {
                    loadMoreButton.style.display = 'none';
                }
            } else {
                loadMoreButton.style.display = 'none'; // Ocultar si no hay más páginas
            }
        } else {
            loadMoreButton.style.display = 'none'; // Ocultar si ya tenemos el máximo
        }
    });
}

// Event listener para la búsqueda
if (searchButton && searchInput) {
    searchButton.addEventListener('click', async () => {
        currentPage = 1; // Reiniciar la página para la búsqueda
        const searchTerm = searchInput.value.trim();
        await loadMainPageCharacters(searchTerm); // Recargar personajes con el término de búsqueda
    });

    // Opcional: Permitir búsqueda al presionar Enter en el input
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
}


/* =========================================
    LÓGICA DEL MODAL DE DETALLE DE PERSONAJE (NUEVO)
    ========================================= */

// Función para obtener los nombres de los episodios
async function fetchEpisodeNames(episodeUrls) {
    const episodeIds = episodeUrls.map(url => url.split('/').pop());
    if (episodeIds.length === 0) return [];

    try {
        // La API de Rick and Morty permite consultar múltiples episodios por ID
        const response = await fetch(`${EPISODE_API_BASE_URL}${episodeIds.join(',')}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Si es un solo episodio, la API devuelve un objeto, no un array
        if (!Array.isArray(data)) {
            return [data.name];
        }
        return data.map(episode => episode.name);
    } catch (error) {
        console.error('Error fetching episode names:', error);
        return ['Información no disponible'];
    }
}

// Función para mostrar el modal con los detalles del personaje
async function mostrarDetallePersonaje(personaje) {
    if (personajeDetalleModal) { // Asegurarse de que el modal exista
        modalImagen.src = personaje.image;
        modalNombre.textContent = personaje.name;
        modalEspecie.textContent = personaje.species;
        modalEstado.textContent = personaje.status;
        modalGenero.textContent = personaje.gender;
        modalOrigen.textContent = personaje.origin.name;
        modalUbicacion.textContent = personaje.location.name;

        // Limpiar lista de episodios anterior
        modalEpisodiosLista.innerHTML = '<li>Cargando episodios...</li>';

        // Obtener y mostrar los nombres de los episodios
        const episodeNames = await fetchEpisodeNames(personaje.episode);
        modalEpisodiosLista.innerHTML = ''; // Limpiar el mensaje de carga
        if (episodeNames.length > 0) {
            episodeNames.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                modalEpisodiosLista.appendChild(li);
            });
        } else {
            modalEpisodiosLista.innerHTML = '<li>No hay episodios registrados.</li>';
        }

        personajeDetalleModal.style.display = 'flex'; // Mostrar el modal
    }
}

// Event listener para cerrar el modal
if (cerrarModalButton) {
    cerrarModalButton.addEventListener('click', () => {
        personajeDetalleModal.style.display = 'none'; // Ocultar el modal
    });
}

// Cerrar el modal haciendo clic fuera de su contenido
if (personajeDetalleModal) {
    window.addEventListener('click', (event) => {
        if (event.target === personajeDetalleModal) {
            personajeDetalleModal.style.display = 'none';
        }
    });
}


// Ejecutar la carga de personajes cuando el DOM esté completamente cargado, pero solo en main.html
document.addEventListener('DOMContentLoaded', () => {
    // Solo si el id 'personajes-grid' existe en la página actual, entonces es main.html
    if (document.getElementById('personajes-grid')) {
        loadMainPageCharacters();
    }
});