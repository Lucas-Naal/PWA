document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const createPostBtn = document.getElementById('createPostBtn');
    const postFormContainer = document.getElementById('postFormContainer');
    const closeFormBtn = document.getElementById('closeFormBtn');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let currentEditIndex = null; // Para almacenar el índice del post que se está editando


    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('service-worker.js').then(function(registration) {
                console.log('Service Worker registrado con éxito:', registration);
            }).catch(function(error) {
                console.log('Error al registrar el Service Worker:', error);
            });
        });
    }
    

    // Mostrar publicaciones
    const renderPosts = () => {
        postsContainer.innerHTML = '';
        posts.forEach((post, index) => {
            const currentDate = new Date(post.date).toLocaleString(); // Formato de fecha
            const postElement = `
                <div class="card mb-3">
                    ${post.image ? `<img src="${post.image}" class="card-img-top" alt="Post image">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.content}</p>
                        <div><p>${currentDate}</p></div>
                        <button class="btn btn-warning" onclick="editPost(${index})">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-danger" onclick="deletePost(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            postsContainer.innerHTML += postElement;
        });
    };

    // Guardar publicaciones en localStorage
    const savePosts = () => {
        localStorage.setItem('posts', JSON.stringify(posts));
    };

    // Crear nuevas publicaciones
    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const imageInput = document.getElementById('image');
        const image = imageInput.files[0];
        let imageUrl = '';

        // Validar el contenido del post
        if (!title || !content) {
            alert('Por favor, ingrese un título y contenido.');
            return;
        }

        // Si hay una imagen seleccionada, procesarla
        if (image) {
            const reader = new FileReader();
            reader.onloadend = function() {
                imageUrl = reader.result;
                const post = { title, content, image: imageUrl, date: Date.now() };
                posts.push(post);
                savePosts();
                renderPosts();
            };
            reader.readAsDataURL(image);
        } else {
            // Si no hay imagen, crear el post sin imagen
            const post = { title, content, image: '', date: Date.now() };
            posts.push(post);
            savePosts();
            renderPosts();
        }

        // Reiniciar el formulario después de publicar
        postForm.reset();
        postFormContainer.style.display = 'none'; // Ocultar el formulario
        createPostBtn.style.display = 'block'; // Mostrar el botón nuevamente
    });

    // Eliminar publicación
    window.deletePost = function(index) {
        if (confirm('¿Está seguro de que desea eliminar esta publicación?')) {
            posts.splice(index, 1);
            savePosts();
            renderPosts();
        }
    };

    // Función para abrir el modal y cargar los datos
    window.editPost = function(index) {
        const post = posts[index];
        currentEditIndex = index; // Guardar el índice de la publicación que se está editando

        // Llenar el modal con los datos de la publicación
        document.getElementById('editTitle').value = post.title;
        document.getElementById('editContent').value = post.content;

        // Mostrar el modal
        const editModal = new bootstrap.Modal(document.getElementById('editPostModal'));
        editModal.show();
    };

    // Guardar los cambios de edición
    document.getElementById('saveEditBtn').addEventListener('click', function() {
        const updatedTitle = document.getElementById('editTitle').value.trim();
        const updatedContent = document.getElementById('editContent').value.trim();
        const updatedImageInput = document.getElementById('editImage');
        const updatedImage = updatedImageInput.files[0];

        // Validar que los campos no estén vacíos
        if (!updatedTitle || !updatedContent) {
            alert('Por favor, ingrese un título y contenido.');
            return;
        }

        // Procesar la nueva imagen si se seleccionó una
        if (updatedImage) {
            const reader = new FileReader();
            reader.onloadend = function() {
                posts[currentEditIndex].image = reader.result; // Actualizar imagen
                posts[currentEditIndex].title = updatedTitle; // Actualizar título
                posts[currentEditIndex].content = updatedContent; // Actualizar contenido
                savePosts();
                renderPosts();
            };
            reader.readAsDataURL(updatedImage);
        } else {
            // Si no hay nueva imagen, solo actualizar el título y contenido
            posts[currentEditIndex].title = updatedTitle;
            posts[currentEditIndex].content = updatedContent;
            savePosts();
            renderPosts();
        }

        // Cerrar el modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
        editModal.hide();
    });

    // Mostrar el contenedor del formulario y ocultar el botón
    createPostBtn.addEventListener('click', function() {
        console.log('Botón Crear Publicación clickeado');
        postFormContainer.style.display = 'block'; // Mostrar formulario
        createPostBtn.style.display = 'none'; // Ocultar botón
    });

    // Cerrar formulario
    closeFormBtn.addEventListener('click', function() {
        postFormContainer.style.display = 'none'; // Ocultar formulario
        createPostBtn.style.display = 'block'; // Mostrar botón
    });

    // Renderizar publicaciones al cargar
    renderPosts();
});
