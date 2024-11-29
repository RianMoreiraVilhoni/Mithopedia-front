document.addEventListener("DOMContentLoaded", function () {
    fetchComments();

    const commentFormElement = document.getElementById('commentFormElement');
    if (commentFormElement) {
        commentFormElement.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede a recarga da página
            saveComment();
        });
    }
});

function fetchComments() {
    fetch('http://10.188.35.72:8000/comments')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('commentList');
            list.innerHTML = '';

            data.comments.forEach(comment => {
                list.innerHTML += `
                    <div class="border rounded-lg shadow-lg p-4 mb-4">
                        <p><strong>Comentário:</strong> ${comment.comment}</p>
                        <p><strong>Data:</strong> ${new Date(comment.date).toLocaleString()}</p>
                        <p><strong>Última Atualização:</strong> ${new Date(comment.last_update).toLocaleString()}</p>
                        <p><strong>Likes:</strong> ${comment.likes}</p>
                        <button class="btn btn-warning mr-2" style="background-color: #1abc9c;" onclick="showEditForm(${comment.id})">Atualizar</button>
                        <button style="background-color: #e74c3c;" onclick="deleteComment(${comment.id})">Apagar</button>
                    </div>`;
            });
        })
        .catch(error => console.error("Error fetching comments:", error));
}

function showCommentForm() {
    
    const inputs = document.getElementById('commentList');
    inputs.innerHTML='';
    inputs.innerHTML += `
        <section id="commentForm" class="p-4 bg-white shadow-md rounded">
            <h2 class="text-xl font-bold mb-4">Cadastrar Novo Comentário</h2>
            <form id="commentFormElement">
                <div>
                    <label for="comment">Comentário</label>
                    <input type="text" id="comment" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="date">Data</label>
                    <input type="datetime-local" id="date" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="last_upd">ultimo update</label>
                    <input type="datetime-local" id="last_upd" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="likes">Likes</label>
                    <input type="number" id="likes" value="0" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="user">Usuário ID</label>
                    <input type="number" id="user" required class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="god">Deus ID</label>
                    <input type="number" id="god" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="mytology">Mitologia ID</label>
                    <input type="number" id="mytology" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="history">História ID</label>
                    <input type="number" id="history" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label for="status">status</label>
                    <input type="number" id="status" class="w-full p-2 border rounded">
                </div>
                <button type="submit" class="mt-4 bg-blue-500 text-white p-2 rounded" >Salvar</button>
            </form>
        </section>
    `;
    document.getElementById('commentFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveComment();
    });
}

function saveComment() {
    const comment = document.getElementById('comment').value;
    const date = document.getElementById('date').value;
    const last_upd = document.getElementById('last_upd').value;
    const likes = document.getElementById('likes').value;
    const user = document.getElementById('user').value;
    const god = document.getElementById('god').value;
    const mytology = document.getElementById('mytology').value;
    const history = document.getElementById('history').value;
    const status = document.getElementById('status').value;

    // Format dates to ISO strings
    const formattedDate = new Date(date).toISOString();
    const formattedLastUpdate = new Date(last_upd).toISOString();

    const newComment = {
        comment,
        date: formattedDate,
        last_update: formattedLastUpdate,
        likes: parseInt(likes) || 0,
        status: parseInt(status),
        user: parseInt(user),
        god: god ? parseInt(god, 10) : null,
        mytology: mytology ? parseInt(mytology, 10) : null,
        history: history ? parseInt(history, 10) : null,
    };

    console.log(newComment);

    fetch('http://10.188.35.72:8000/comments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Erro ao salvar comentário'); });
        }
        return response.json();
    })
    .then(() => {
        fetchComments();
        document.getElementById('commentFormContainer').innerHTML = '';
    })
    .catch(error => console.error("Error saving comment:", error));
}


function deleteComment(id) {
    fetch(`http://10.188.35.72:8000/comments/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao apagar comentário');
        }
        return response.json();
    })
    .then(() => {
        fetchComments();
    })
    .catch(error => console.error("Error deleting comment:", error));
}

function showEditForm(id) {
    // Aqui você pode implementar a lógica para mostrar um formulário de edição
}
