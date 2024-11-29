document.addEventListener("DOMContentLoaded", function () {
    fetchGods();

    const GodsFormElement = document.getElementById('GodsFormElement');
    if (GodsFormElement) {
        GodsFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveGod();
        });
    } else {
        console.error("Error: Element with ID 'GodsFormElement' not found.");
    }
    
});

// Função para buscar todos os deuses
function fetchGods() {
    fetch('http://10.188.35.72:8000/gods')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('GodsList');
            list.innerHTML = ''; // Limpa o conteúdo anterior

            data.gods.forEach(god => {
                list.innerHTML += `
                    <div class="card border rounded-lg shadow-lg overflow-hidden mb-6" style="height:400px;">
                    
                        
                        <div class="content p-4">
                        <div class="god-img">
                        <img src="http://10.188.35.72:8000/images/${god.symbol}" alt="${god.name}">
                    </div>
                            <h2 class="text-xl font-bold mb-2">${god.name}</h2>
                            <p class="text-gray-700 text-sm mb-2">Id: ${god.id}</p>
                            <p class="text-gray-700 text-sm mb-2">Sub-descrição: ${god.sub_description}</p>
                            <p class="text-gray-700 text-sm mb-2">Descrição: ${god.description}</p>
                            <p class="text-gray-700 text-sm mb-2">Símbolo: ${god.symbol}</p>
                            <p class="text-gray-700 text-sm mb-2">Domínio: ${god.domain}</p>
                            <p class="text-gray-700 text-sm mb-2">Parentesco: ${god.kinship}</p>
                            <p class="text-gray-700 text-sm mb-2">Características: ${god.caracteristics}</p>
                            <p class="text-gray-700 text-sm mb-2">Animal Sagrado: ${god.sacred_animal}</p>
                            <p class="text-gray-700 text-sm mb-2">Cor Sagrada: ${god.sacred_colour}</p>
                            <p class="text-gray-700 text-sm mb-2">Criado em: ${god.data_creation}</p>
                            <p class="text-gray-700 text-sm mb-2">Última atualização: ${god.last_update}</p>

                            <!-- Botões de Ação -->
                            <button class="btn btn-warning mr-2" style="background-color: #1abc9c;" onclick="showEditForm(${god.id}, '${god.name}', '${god.sub_description}', '${god.description}', '${god.symbol}', '${god.domain}', '${god.kinship}', '${god.caracteristics}', '${god.sacred_animal}', '${god.sacred_colour}', '${god.data_creation}', '${god.last_update}')">Atualizar</button>

                            <button style="background-color: #e74c3c;" onclick="deleteGod(${god.id})">Apagar</button>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error("Error fetching gods:", error));
}

function showAddForm() {
    const formElement = document.getElementById('GodsForm');
    formElement.innerHTML='';
    formElement.innerHTML += `
    <section class="d-none"
        style="padding: 2rem;height:300px; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 0.5rem;">
        <h2 id="formTitle" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; color: #4a5568;">
            Cadastrar novo Deus</h2>
        <form id="GodsFormElement" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <input type="hidden" id="GodId">

            <div>
                <label for="name" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Nome do Deus</label>
                <input type="text" id="name" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="sub_description" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Sub-descrição</label>
                <input type="text" id="sub_description" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="description" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Descrição</label>
                <textarea id="description" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required></textarea>
            </div>

            <div>
                <label for="symbol" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Símbolo</label>
                <input type="text" id="symbol" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="domain" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Domínio (Poder ou Área de Atuação)</label>
                <input type="text" id="domain" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="kinship" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Parentesco</label>
                <input type="text" id="kinship" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="caracteristics" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Características</label>
                <input type="text" id="caracteristics" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="sacred_animal" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Animal Sagrado</label>
                <input type="text" id="sacred_animal" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="sacred_colour" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Cor Sagrada</label>
                <input type="text" id="sacred_colour" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="data_creation" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Criado em</label>
                <input type="date" id="data_creation" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="last_update" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Última atualização</label>
                <input type="date" id="last_update" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <button type="submit" style="padding: 0.75rem 1.5rem; background-color: #4f46e5; color: white; font-weight: bold; border-radius: 0.375rem; cursor: pointer; transition: background-color 0.3s;">
                Salvar
            </button>
        </form>
    </section>
    `;
}



// Função para exibir o formulário de edição de deus existente
function showEditForm(id, name, sub_description, description, symbol, domain, kinship, caracteristics, sacred_animal, sacred_colour, data_creation, last_update) {
    document.getElementById('GodsForm').classList.remove('d-none');
    document.getElementById('GodId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('sub_description').value = sub_description;
    document.getElementById('description').value = description;
    document.getElementById('symbol').value = symbol;
    document.getElementById('domain').value = domain;
    document.getElementById('kinship').value = kinship;
    document.getElementById('caracteristics').value = caracteristics;
    document.getElementById('sacred_animal').value = sacred_animal;
    document.getElementById('sacred_colour').value = sacred_colour;
    document.getElementById('data_creation').value = data_creation;
    document.getElementById('last_update').value = last_update;
    document.getElementById('formTitle').innerText = 'Editar Deus';
}

// Função para salvar um novo deus ou atualizar um existente
function saveGod() {
    const id = document.getElementById('GodId').value;
    const name = document.getElementById('name').value;
    const sub_description = document.getElementById('sub_description').value;
    const description = document.getElementById('description').value;
    const symbol = document.getElementById('symbol').value;
    const domain = document.getElementById('domain').value;
    const kinship = document.getElementById('kinship').value;
    const caracteristics = document.getElementById('caracteristics').value;
    const sacred_animal = document.getElementById('sacred_animal').value;
    const sacred_colour = document.getElementById('sacred_colour').value;
    const data_creation = document.getElementById('data_creation').value;
    const last_update = document.getElementById('last_update').value;

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.72:8000/gods/${id}` : 'http://10.188.35.72:8000/gods';

    const godData = {
        name,
        sub_description,
        description,
        symbol,
        domain,
        kinship,
        caracteristics,
        sacred_animal,
        sacred_colour,
        data_creation,
        last_update
    };

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(godData)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                });
            }
            return response.json();
        })
        .then(() => {
            fetchGods();
            document.getElementById('GodsForm').classList.add('d-none');
        })
        .catch(error => {
            console.error("Error saving god:", error);
        });
}

// Função para apagar um deus
function deleteGod(id) {
    fetch(`http://10.188.35.72:8000/gods/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao apagar deus: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            fetchGods();
        })
        .catch(error => console.error("Error deleting god:", error));
}
