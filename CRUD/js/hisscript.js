document.addEventListener("DOMContentLoaded", function () {
    fetchStories();
    

    const historyFormElement = document.getElementById('HistoryFormElement');
    if (historyFormElement) {
        historyFormElement.addEventListener('submit', function (event) {
            event.preventDefault(); // Previne o recarregamento da página
            console.log("Submitting form...");
            saveStory();
        });
    } else {
        console.error("Error: Element with ID 'HistoryFormElement' not found.");
    }

});



// Função para buscar histórias
function fetchStories() {
    fetch('http://10.188.35.72:8000/history/stories')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('StoryList');
            list.innerHTML = ''; // Limpa o conteúdo anterior

            data.stories.forEach(story => {
                list.innerHTML += `
                    <div class="card border rounded-lg shadow-lg overflow-hidden mb-6">
                        <div class="content p-4">
                            <h2 class="text-xl font-bold mb-2">${story.title}</h2>
                            <p class="text-gray-700 text-sm mb-2">Id: ${story.id}</p>
                            <p class="text-gray-700 text-sm mb-2">Author: ${story.author}</p>
                            <p class="text-gray-700 text-sm mb-2">Content: ${story.content}</p>
                            <p class="text-gray-700 text-sm mb-2">Source: ${story.source}</p>
                            <p class="text-gray-700 text-sm mb-2">Published on: ${new Date(story.publish_time).toLocaleDateString()}</p>
                            <p class="text-gray-700 text-sm mb-2">Last Updated: ${new Date(story.last_updated).toLocaleDateString()}</p>
                            <p class="text-gray-700 text-sm mb-2">Views: ${story.views}</p>
                            <p class="text-gray-700 text-sm mb-2">Age Classification: ${story.age_classification}</p>
                            <p class="text-gray-700 text-sm mb-2">God ID: ${story.god ? story.god.id : 'N/A'}</p>
                            <p class="text-gray-700 text-sm mb-2">Mythology ID: ${story.mythology ? story.mythology.id : 'N/A'}</p>
            
                            <!-- Botões de Ação -->
                            <button class="btn btn-warning mr-2" style="background-color: #1abc9c;" onclick="showEditForm(${story.id}, '${story.title}', '${story.content}', '${story.author}', '${story.source}', '${story.publish_time}', '${story.last_updated}', ${story.views}, ${story.age_classification}, ${story.god ? story.god.id : 'N/A'}, ${story.mythology ? story.mythology.id : 'N/A'})">Atualizar</button>
            
                            <button style="background-color: #e74c3c;" onclick="deleteStory(${story.id})">Apagar</button>
                        </div>
                    </div>`;
            });
            
        })
        .catch(error => console.error("Error fetching stories:", error));
}


function fetchMythologies() {
    fetch('http://10.188.35.72:8000/mythologies')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Adicione esta linha para ver a resposta completa
            const mytologySelect = document.getElementById('mytology_id');
            if (mytologySelect) {
                mytologySelect.innerHTML = `<option value="">Selecione uma Mitologia</option>`;
                if (data.mytologies && Array.isArray(data.mytologies)) {
                    data.mytologies.forEach(mytology => {
                        mytologySelect.innerHTML += `<option value="${mytology.id}">${mytology.name}</option>`;
                    });
                } else {
                    console.error("A propriedade 'mythologies' não foi encontrada ou não é um array.");
                }
            } else {
                console.error("Error: Element with ID 'mytology_id' not found.");
            }
        })
        .catch(error => console.error("Error fetching mythologies:", error));
}


function fetchGods() {
    fetch('http://10.188.35.72:8000/gods')
        .then(response => response.json())
        .then(data => {
            const godSelect = document.getElementById('god_id');
            if (godSelect) {
                godSelect.innerHTML = `<option value="">Selecione um Deus</option>`;
                console.log(data.gods)
                data.gods.forEach(god => {
                 
                    godSelect.innerHTML += `<option value="${god.id}">${god.name}</option>`;
                });
            } else {
                console.error("Error: Element with ID 'god_id' not found.");
            }
        })
        .catch(error => console.error("Error fetching gods:", error));
}

function ShowInput() {
    fetchMythologies();
    fetchGods();
    const inputs = document.getElementById('StoryList')
    inputs.innerHTML='';
    inputs.innerHTML += `
    <section id="HistoryForm" class="d-none" style="padding: 2rem;height:300px; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 0.5rem;">
        <h2 id="formTitle" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; color: #4a5568;">Cadastrar nova História</h2>
        <form id="HistoryFormElement" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <input type="hidden" id="HistoryId">

            <div>
                <label for="title" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Título</label>
                <input type="text" id="title" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="content" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Conteúdo</label>
                <textarea id="content" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required></textarea>
            </div>

            <div>
                <label for="author" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Autor</label>
                <input type="text" id="author" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="source" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Fonte</label>
                <input type="text" id="source" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="publish_time" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Data de Publicação</label>
                <input type="datetime-local" id="publish_time" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="last_updated" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Última Atualização</label>
                <input type="datetime-local" id="last_updated" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="views" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Visualizações</label>
                <input type="number" id="views" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="age_classification" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Classificação Etária</label>
                <input type="number" id="age_classification" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
            </div>

            <div>
                <label for="god_id" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Deus</label>
                <select id="god_id" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
                    <option value="">Selecione um Deus</option>
                </select>
            </div>

            <div>
                <label for="mytology_id" style="display: block; font-size: 0.875rem; font-weight: 600; color: #4a5568;">Mitologia</label>
                <select id="mytology_id" style="margin-top: 0.25rem; width: 100%; padding: 0.5rem; border: 1px solid #d2d6dc; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);" required>
                    <option value="">Selecione uma Mitologia</option>
                </select>
            </div>

            <button type="submit" style="padding: 0.75rem 1.5rem; background-color: #4f46e5; color: white; font-weight: bold; border-radius: 0.375rem; cursor: pointer; transition: background-color 0.3s;">
                Salvar
            </button>
        </form>
    </section>
    `;
}

function showAddForm() {

    const formElement = document.getElementById('HistoryForm');
    if (formElement) {
        formElement.classList.remove('d-none');
    } else {
        console.error("Error: Element with ID 'HistoryForm' not found.");
    }

    document.getElementById('HistoryId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('author').value = '';
    document.getElementById('source').value = '';
    document.getElementById('publish_time').value = '';
    document.getElementById('last_updated').value = '';
    document.getElementById('views').value = '';
    document.getElementById('age_classification').value = '';
    document.getElementById('god_id').value = '';
    document.getElementById('mytology_id').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar História';
}

function showEditForm(id, title, content, author, source, publish_time, last_updated, views, age_classification, god, mytology) {
    document.getElementById('HistoryForm').classList.remove('d-none');
    document.getElementById('HistoryId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('content').value = content;
    document.getElementById('author').value = author;
    document.getElementById('source').value = source;
    document.getElementById('publish_time').value = publish_time.split('T')[0]; // Formato YYYY-MM-DD
    document.getElementById('last_updated').value = last_updated.split('T')[0]; // Formato YYYY-MM-DD
    document.getElementById('views').value = views;
    document.getElementById('age_classification').value = age_classification;
    document.getElementById('god_id').value = god;
    document.getElementById('mytology_id').value = mytology;
    document.getElementById('formTitle').innerText = 'Editar História';
}

function saveStory() {
    const id = document.getElementById('HistoryId').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;
    const source = document.getElementById('source').value;
    const publish_time = document.getElementById('publish_time').value;
    const last_updated = document.getElementById('last_updated').value;
    const views = document.getElementById('views').value;
    const age_classification = document.getElementById('age_classification').value;
    const god = document.getElementById('god_id').value;
    const mytology = document.getElementById('mytology_id').value;

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.72:8000/history/stories/${id}` : 'http://10.188.35.72:8000/history/stories';

    const storyData = {
        title,
        content,
        author,
        source,
        publish_time,
        last_updated,
        views,
        age_classification,
        god,
        mytology
    };

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(storyData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                console.error(`Error: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Story saved:", data);
        fetchStories();
        document.getElementById('HistoryForm').classList.add('d-none');
    })
    .catch(error => {
        console.error("Error saving story:", error);
    });
}


function deleteStory(id) {
    fetch(`http://10.188.35.72:8000/stories/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error deleting story: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            fetchStories();
        })
        .catch(error => console.error("Error deleting story:", error));
}
