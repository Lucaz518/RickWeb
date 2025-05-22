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

//  Seleccionar elementos del DOM

const productosGrid = document.querySelector('.productos-grid');
const favoritosTiendaLista = document.querySelector('.favoritos-tienda-lista');
const favoritosTiendaSeccion = document.querySelector('.favoritos-tienda');
const sinFavoritosTienda = document.querySelector('.sin-favoritos-tienda');
const botonesAgregarCarrito = document.querySelectorAll('.add-to-cart-button');

//  Inicializar el array de favoritos desde localStorage (si existe)
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
actualizarFavoritosTiendaLista();  //  Llamar a la función para mostrar los favoritos iniciales
