document.addEventListener("DOMContentLoaded", function () {
    fetchMitologia();

    const MitologiaFormElement = document.getElementById('MitologiaFormElement');
    if (MitologiaFormElement) {
        MitologiaFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveMitologia();
        });
    } else {
        console.error("Error: Element with ID 'MitologiaFormElement' not found.");
    }
});

function fetchMitologia() {
    fetch('http://10.188.35.72:8000/mythologies')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('MitologiaList');
            list.innerHTML = ''; // Clear previous content

            data.mytologies.forEach(mitologia => {
                const escapeHtml = (unsafe) => {
                    return unsafe
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
                };
                list.innerHTML += `
                    <div class="card border rounded-lg shadow-lg overflow-hidden mb-6">
                        <div class="image">
                            <img src="http://10.188.35.72:8000/images/${escapeHtml(mitologia.mytology_profile_img)}" alt="${escapeHtml(mitologia.name)}" class="w-full h-48 object-cover">
                        </div>
                        <div class="content p-4">
                            <h2 class="text-xl font-bold mb-2">${escapeHtml(mitologia.name)}</h2>
                            <p class="text-gray-700 text-sm mb-2">Id: ${mitologia.id}</p>
                            <p class="text-gray-700 text-sm mb-2">Sub-description: ${escapeHtml(mitologia.sub_description)}</p>
                            <p class="text-gray-700 text-sm mb-2">Description: ${escapeHtml(mitologia.description)}</p>
                            <p class="text-gray-700 text-sm mb-2">Origin: ${escapeHtml(mitologia.origin)}</p>
                            <p class="text-gray-700 text-sm mb-2">Period: ${escapeHtml(mitologia.period)}</p>
                            <p class="text-gray-700 text-sm mb-2">Gods Qty: ${mitologia.gods_qty}</p>
                            <p class="text-gray-700 text-sm mb-2">Sacred Texts: ${escapeHtml(mitologia.sacred_texts)}</p>
                            <p class="text-gray-700 text-sm mb-2">Main Mythology: ${escapeHtml(mitologia.main_mytology)}</p>
                            <p class="text-gray-700 text-sm mb-2">Creator: ${escapeHtml(mitologia.creator)}</p>
                            <p class="text-gray-700 text-sm mb-2">Created on: ${mitologia.data_creation}</p>
                            <p class="text-gray-700 text-sm mb-2">Last Update: ${mitologia.last_update}</p>
                            <p class="text-gray-700 text-sm mb-2">Main Symbol:
                                <div class="symbol">
                                    <span class="material-symbols-outlined">
                                        ${escapeHtml(mitologia.main_symbol)}
                                    </span>
                                </div>
                            </p>
                            <button class="btn btn-warning mr-2" style="background-color: #1abc9c;" 
                                onclick="showEditForm('${mitologia.id}', '${escapeHtml(mitologia.name)}', '${escapeHtml(mitologia.sub_description)}', '${escapeHtml(mitologia.description)}', '${escapeHtml(mitologia.origin)}', '${escapeHtml(mitologia.period)}', '${mitologia.gods_qty}', '${escapeHtml(mitologia.sacred_texts)}', '${escapeHtml(mitologia.main_mytology)}', '${escapeHtml(mitologia.creator)}', '${mitologia.data_creation}', '${mitologia.last_update}', '${escapeHtml(mitologia.main_symbol)}', '${mitologia.mytology_banner}', '${mitologia.mytology_profile_img}')">Atualizar</button>
                            <button style="background-color: #e74c3c;" onclick="deleteMitologia('${mitologia.id}')">Apagar</button>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error("Error fetching mitologias:", error));
}


function ShowInputs() {
    const inputs = document.getElementById('inputs')
    inputs.innerHTML='';
    inputs.innerHTML += `
    
    <section id="MitologiaForm" class="MitologiaForm"
                            style="padding: 2rem; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 0.5rem;">
                            <h2 id="formTitle"
                                style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; color: #4a5568;">
                                Cadastrar nova Mitologia</h2>
                            <form id="MitologiaFormElement" style="display: flex; flex-direction: column; gap: 1.5rem;">
                                <input type="hidden" id="MitologiaId">

                                <div>
                                    <label for="name"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Nome</label>
                                    <input type="text" id="name"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="sub_description"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Sub-descrição</label>
                                    <input type="text" id="sub_description"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="description"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Descrição</label>
                                    <textarea id="description"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required></textarea>
                                </div>

                                <div>
                                    <label for="origin"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Origem</label>
                                    <input type="text" id="origin"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="period"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Período</label>
                                    <input type="text" id="period"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="gods_qty"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Quantidade
                                        de Deuses</label>
                                    <input type="number" id="gods_qty"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>
        
                                <div>
                                    <label for="sacred_texts"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Textos
                                        Sagrados</label>
                                    <input type="text" id="sacred_texts"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="main_mytology"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Mitologia
                                        Principal</label>
                                    <input type="text" id="main_mytology"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="creator"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Criador</label>
                                    <input type="text" id="creator"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="data_creation"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Data
                                        de Criação</label>
                                    <input type="date" id="data_creation"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="last_update"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Última
                                        Atualização</label>
                                    <input type="date" id="last_update"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="main_symbol"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Símbolo
                                        Principal</label>
                                    <input type="text" id="main_symbol"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="mytology_banner"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Banner
                                        da Mitologia (URL)</label>
                                    <input type="txt" id="mytology_banner"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <div>
                                    <label for="mytology_profile_img"
                                        style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Imagem
                                        de Perfil (URL)</label>
                                    <input type="txt" id="mytology_profile_img"
                                        style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);"
                                        required>
                                </div>

                                <button type="submit"
                                    style="padding: 0.75rem 1.5rem; background-color: #4f46e5; color: white; font-weight: bold; border-radius: 0.375rem; cursor: pointer; transition: background-color 0.3s;">
                                    Salvar
                                </button>
                            </form>
                        </section>
    `
    const MitologiaFormElement = document.getElementById('MitologiaFormElement');
    if (MitologiaFormElement) {
        MitologiaFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveMitologia();
        });
    } else {
        console.error("Error: Element with ID 'MitologiaFormElement' not found.");
    }
}




function showEditForm(id, name, sub_description, description, origin, period, gods_qty, sacred_texts, main_mytology, creator, data_creation, last_update, main_symbol, mytology_banner, mytology_profile_img) {
    console.log("Editing mitologia:", { id, name }); // Log para verificar os dados recebidos

    // Certifique-se de que o formulário já foi gerado
    ShowInputs(); // Chame a função para garantir que o formulário está presente

    // Preenche os campos do formulário
    document.getElementById('MitologiaId').value = id || '';
    document.getElementById('name').value = name || '';
    document.getElementById('sub_description').value = sub_description || '';
    document.getElementById('description').value = description || '';
    document.getElementById('origin').value = origin || '';
    document.getElementById('period').value = period || '';
    document.getElementById('gods_qty').value = gods_qty || '';
    document.getElementById('sacred_texts').value = sacred_texts || '';
    document.getElementById('main_mytology').value = main_mytology || '';
    document.getElementById('creator').value = creator || '';
    document.getElementById('data_creation').value = data_creation || '';
    document.getElementById('last_update').value = last_update || '';
    document.getElementById('main_symbol').value = main_symbol || '';
    document.getElementById('mytology_banner').value = mytology_banner || '';
    document.getElementById('mytology_profile_img').value = mytology_profile_img || '';

    // Atualiza o título do formulário
    const formTitle = document.getElementById('formTitle');
    if (formTitle) {
        formTitle.innerText = 'Editar Mitologia';
    } else {
        console.error("Error: Element with ID 'formTitle' not found.");
    }

    // Exibe o formulário de edição
    const formElement = document.getElementById('MitologiaForm');
    if (formElement) {
        formElement.classList.remove('d-none');
    } else {
        console.error("Error: Element with ID 'MitologiaForm' not found.");
    }
}


function saveMitologia() {
    const id = document.getElementById('MitologiaId').value;
    const name = document.getElementById('name').value;
    const sub_description = document.getElementById('sub_description').value;
    const description = document.getElementById('description').value;
    const origin = document.getElementById('origin').value;
    const period = document.getElementById('period').value;
    const gods_qty = document.getElementById('gods_qty').value;
    const sacred_texts = document.getElementById('sacred_texts').value;
    const main_mytology = document.getElementById('main_mytology').value;
    const creator = document.getElementById('creator').value;
    const data_creation = document.getElementById('data_creation').value;
    const last_update = document.getElementById('last_update').value;
    const main_symbol = document.getElementById('main_symbol').value;
    const mytology_banner = document.getElementById('mytology_banner').value;
    const mytology_profile_img = document.getElementById('mytology_profile_img').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://10.188.35.72:8000/mythologies/${id}` : 'http://10.188.35.72:8000/mythologies';

    const mitologiaData = {
        name,
        sub_description,
        description,
        origin,
        period,
        gods_qty,
        sacred_texts,
        main_mytology,
        creator,
        data_creation,
        last_update,
        main_symbol,
        mytology_banner,
        mytology_profile_img
    };

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mitologiaData)
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
            fetchMitologia();
            document.getElementById('MitologiaForm').classList.add('d-none');
        })
        .catch(error => {
            console.error("Error saving mitologia:", error);
        });
}

function deleteMitologia(id) {
    fetch(`http://10.188.35.72:8000/mythologies/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao apagar mitologia: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            fetchMitologia();
        })
        .catch(error => console.error("Error deleting Mitologia:", error));
}


document.addEventListener("DOMContentLoaded", function () {
    fetchMitologia();

    const MitologiaFormElement = document.getElementById('MitologiaFormElement');
    if (MitologiaFormElement) {
        MitologiaFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveMitologia();
        });
    } else {
        console.error("Error: Element with ID 'UniConFormElement' not found.");
    }
});