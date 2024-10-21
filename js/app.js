document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const postFormContainer = document.getElementById('postFormContainer');
    const createPostBtn = document.getElementById('createPostBtn');
    const closeFormBtn = document.getElementById('closeFormBtn');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let currentEditIndex = null; 

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString(undefined, options); 
    };

    const renderPosts = () => {
        postsContainer.innerHTML = '';
        posts.forEach((post, index) => {
            const postElement = `
                <div class="card mb-3">
                    ${post.image ? `<img src="${post.image}" class="card-img-top" alt="Post image">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.content}</p>
                        <p class="text-muted">${post.date}</p> 
                        <button class="btn btn-warning" onclick="editPost(${index})">
                            <i class="fas fa-pencil-alt"></i> Editar
                        </button>
                        <button class="btn btn-danger" onclick="confirmDelete(${index})">
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
            postsContainer.innerHTML += postElement;
        });
    };

    const savePosts = () => {
        localStorage.setItem('posts', JSON.stringify(posts));
    };

    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const imageInput = document.getElementById('image');
        const image = imageInput.files[0];
        let imageUrl = '';

        if (!title || !content) {
            alert('Por favor, ingresa un título y contenido.');
            return;
        }

        const currentDate = new Date();

        if (image) {
            const reader = new FileReader();
            reader.onloadend = function() {
                imageUrl = reader.result;
                const post = { title, content, image: imageUrl, date: formatDate(currentDate) }; 
                posts.push(post);
                savePosts();
                renderPosts();
            };
            reader.readAsDataURL(image);
        } else {
            const post = { title, content, image: '', date: formatDate(currentDate) }; 
            posts.push(post);
            savePosts();
            renderPosts();
        }

        postForm.reset();
        postFormContainer.style.display = 'none'; 
        createPostBtn.style.display = 'block'; 
    });

    window.confirmDelete = function(index) {
        if (confirm('¿Estás seguro de eliminar esta publicación?')) {
            posts.splice(index, 1);
            savePosts();
            renderPosts();
        }
    };

    window.editPost = function(index) {
        const post = posts[index];
        currentEditIndex = index; 

        document.getElementById('editTitle').value = post.title;
        document.getElementById('editContent').value = post.content;

        const editModal = new bootstrap.Modal(document.getElementById('editPostModal'));
        editModal.show();
    };

    document.getElementById('saveEditBtn').addEventListener('click', function() {
        const updatedTitle = document.getElementById('editTitle').value.trim();
        const updatedContent = document.getElementById('editContent').value.trim();
        const updatedImageInput = document.getElementById('editImage');
        const updatedImage = updatedImageInput.files[0];

        if (!updatedTitle || !updatedContent) {
            alert('Por favor, ingresa tanto un título como contenido.');
            return;
        }

        if (updatedImage) {
            const reader = new FileReader();
            reader.onloadend = function() {
                posts[currentEditIndex].image = reader.result; 
                posts[currentEditIndex].title = updatedTitle;
                posts[currentEditIndex].content = updatedContent; 
                savePosts();
                renderPosts();
            };
            reader.readAsDataURL(updatedImage);
        } else {
            posts[currentEditIndex].title = updatedTitle; 
            posts[currentEditIndex].content = updatedContent; 
            savePosts();
            renderPosts();
        }

        const editModal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
        editModal.hide();
    });

    createPostBtn.addEventListener('click', function() {
        postFormContainer.style.display = 'block';
        createPostBtn.style.display = 'none'; 
    });

    closeFormBtn.addEventListener('click', function() {
        postFormContainer.style.display = 'none'; 
        createPostBtn.style.display = 'block'; 
    });

    renderPosts();
});
