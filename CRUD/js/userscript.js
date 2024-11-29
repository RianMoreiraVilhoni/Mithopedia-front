document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();

    const UserFormElement = document.getElementById('UserFormElement');
    if (UserFormElement) {
        UserFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveUser();
        });
    } else {
        console.error("Error: Element with ID 'UserFormElement' not found.");
    }
});

// Função para buscar e renderizar usuários
function fetchUsers() {
    fetch('http://10.188.35.72:8000/users')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('UserList');
            list.innerHTML = ''; // Limpa o conteúdo anterior

            data.users.forEach(user => {
                list.innerHTML += `
                    <div class="card border rounded-lg shadow-lg overflow-hidden mb-6">
                        <div class="content p-4">
                            <h2 class="text-xl font-bold mb-2">${user.name}</h2>
                            <p class="text-gray-700 text-sm mb-2">ID: ${user.id}</p>
                            <p class="text-gray-700 text-sm mb-2">Email: ${user.email}</p>
                            <p class="text-gray-700 text-sm mb-2">Tipo: ${user.type}</p>

                            <!-- Botões de Ação -->
                            <button class="btn btn-warning mr-2" style="background-color: #1abc9c;" onclick="showEditForm('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.type}')">Atualizar</button>

                            <button style="background-color: #e74c3c;" onclick="deleteUser('${user.id}')">Apagar</button>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error("Error fetching users:", error));
}

// Função para exibir o formulário de adicionar usuário
function showAddForm() {
    const formElement = document.getElementById('UserForm');
    if (formElement) {
        formElement.classList.remove('d-none');
    } else {
        console.error("Error: Element with ID 'UserForm' not found.");
    }

    document.getElementById('UserId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('type').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Usuário';
}

// Função para exibir o formulário de editar usuário
function showEditForm(id, name, email, password, type) {
    const formElement = document.getElementById('UserForm');
    if (formElement) {
        formElement.classList.remove('d-none');
    }

    document.getElementById('UserId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    document.getElementById('type').value = type;
    document.getElementById('formTitle').innerText = 'Editar Usuário';
}

// Função para salvar um usuário (criar ou atualizar)
function saveUser() {
    const id = document.getElementById('UserId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const type = document.getElementById('type').value;

    const user = {
        id: id,
        name: name,
        email: email,
        password: password,
        type: type
    };

    const url = id ? `http://10.188.35.72:8000/users/${id}` : 'http://10.188.35.72:8000/users';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar o usuário');
            }
            return response.json();
        })
        .then(() => {
            fetchUsers();  // Recarrega a lista de usuários
            hideForm();    // Esconde o formulário
        })
        .catch(error => console.error('Erro ao salvar o usuário:', error));
}

// Função para deletar um usuário
function deleteUser(id) {
    fetch(`http://10.188.35.72:8000/users/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar o usuário');
            }
            return response.json();
        })
        .then(() => {
            fetchUsers();  // Recarrega a lista após deletar
        })
        .catch(error => console.error('Erro ao deletar o usuário:', error));
}

// Função para esconder o formulário
function hideForm() {
    const formElement = document.getElementById('UserForm');
    if (formElement) {
        formElement.classList.add('d-none');
    } else {
        console.error("Error: Element with ID 'UserForm' not found.");
    }
}
