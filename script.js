document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos-container');
    const formularioProducto = document.getElementById('formulario-producto');
    const imagenInput = document.getElementById('imagen'); // Obtiene el input de imagen
    const imagenNombreInput = document.getElementById('imagen-nombre'); // Obtiene el input de nombre de imagen

    const modal = document.getElementById('modal-editar');
    const cerrarModal = document.getElementById('cerrar-modal');
    const formularioEditar = document.getElementById('form-editar-producto');
    const nombreEditarInput = document.getElementById('nombre-editar');
    const cantidadEditarInput = document.getElementById('cantidad-editar');

    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Función para renderizar productos
    function renderizarProductos() {
        productosContainer.innerHTML = '';
        productos.forEach((producto, index) => {
            const productoElement = document.createElement('div');
            productoElement.classList.add('producto');
            const estaAgotado = producto.cantidad === 0 ? 'agotado' : '';
            productoElement.innerHTML = `
                <div class="producto-imagen ${estaAgotado}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>Cantidad: ${producto.cantidad}</p>
                </div>
                <div class="producto-menu">
                    <button class="editar">Editar</button>
                    <button class="borrar">Borrar</button>
                </div>
            `;

            // Asignar eventos a los botones
            const editarButton = productoElement.querySelector('.editar');
            const borrarButton = productoElement.querySelector('.borrar');

            editarButton.addEventListener('click', () => editarProducto(index));
            borrarButton.addEventListener('click', () => borrarProducto(index));

            productosContainer.appendChild(productoElement);
        });
    }

    // Función para eliminar producto
    function borrarProducto(index) {
        if(confirm('¿Estás seguro de que quieres borrar este producto?')) {
            productos.splice(index, 1);
            localStorage.setItem('productos', JSON.stringify(productos));
            renderizarProductos();
        }
    }

    // Función para agregar producto
    function agregarProducto(nombre, cantidad, imagen) {
        const producto = { nombre, cantidad, imagen };
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
        renderizarProductos();
    }

    // Manejo del formulario de agregar producto
    formularioProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const cantidad = document.getElementById('cantidad').value.trim();

        // Verificar que el nombre y cantidad sean válidos
        if (!nombre) {
            alert('Por favor, ingresa un nombre válido.');
            return;
        }
        if (cantidad === '' || isNaN(cantidad) || parseInt(cantidad) < 0) {
            alert('Por favor, ingresa una cantidad válida (0 o más).');
            return;
        }

        // Verificar que el nombre de la imagen esté presente en el textbox
        const imagenNombre = imagenNombreInput.value.trim();
        if (!imagenNombre) {
            alert('Por favor, selecciona una imagen.');
            return;
        }

        // Si hay una imagen seleccionada, leer la imagen y agregar el producto
        if (imagenInput.files && imagenInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imagen = e.target.result; // Obtenemos la imagen en base64
                agregarProducto(nombre, parseInt(cantidad), imagen);
                formularioProducto.reset();
                imagenNombreInput.value = ''; // Limpiar el campo de nombre de imagen
            };

            reader.readAsDataURL(imagenInput.files[0]); // Lee el archivo como base64
        } else {
            alert('Por favor, selecciona una imagen.');
        }
    });

    // Función para editar producto
    function editarProducto(index) {
        const producto = productos[index];
        nombreEditarInput.value = producto.nombre;
        cantidadEditarInput.value = producto.cantidad;

        // Mostrar el modal
        modal.style.display = 'flex';

        // Al enviar el formulario de edición
        formularioEditar.onsubmit = (e) => {
            e.preventDefault();

            const nombre = nombreEditarInput.value.trim();
            const cantidad = cantidadEditarInput.value.trim();

            if (!nombre) {
                alert('Por favor, ingresa un nombre válido.');
                return;
            }
            if (cantidad === '' || isNaN(cantidad) || parseInt(cantidad) < 0) {
                alert('Por favor, ingresa una cantidad válida (0 o más).');
                return;
            }

            // Actualiza el producto en el array
            productos[index] = { ...producto, nombre, cantidad: parseInt(cantidad) };
            localStorage.setItem('productos', JSON.stringify(productos));
            renderizarProductos();

            // Cierra el modal
            modal.style.display = 'none';
        };
    }

    // Cerrar el modal
    cerrarModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cuando haces clic fuera del modal, también lo cierra
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Evento para mostrar el nombre de la imagen en el textbox
    imagenInput.addEventListener('change', function() {
        const archivo = this.files[0]; // Obtén el archivo seleccionado
        const nombreImagen = archivo ? archivo.name : ''; // Obtén el nombre del archivo
        imagenNombreInput.value = nombreImagen; // Asigna el nombre al textbox

        // Debugging: Verifica si el evento se está disparando y el nombre está siendo asignado
        console.log('Archivo seleccionado:', nombreImagen);
    });

    // Inicializamos la renderización de productos
    renderizarProductos();
});
