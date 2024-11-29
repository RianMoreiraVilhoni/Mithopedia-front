document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const iddeus = urlParams.get('iddeus');

    if (iddeus) {
        fetchDeus(iddeus);
        fetchComments(iddeus);
    } else {
        console.error("ID da mitologia não encontrado na URL.");
    }

    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        if (query) {
            filterResults(query);
        } else {
            suggestions.style.display = 'none'; // Esconde as sugestões se a caixa estiver vazia
        }
    });

    function fetchMitologia() {
        fetch('http://localhost:8000/mythologies')
            .then(response => response.json())
            .then(data => {
                const list = document.getElementById('MitologiaList');
                list.innerHTML = ''; // Limpa o conteúdo anterior

                data.mytologies.forEach(mitologia => {
                    list.innerHTML += `
                    <div class="card">
                    <a href="pg-mitologias.html?idmitologico=${mitologia.id}" style="text-decoration:none;">
                        <img alt="${mitologia.name}" height="300" src="http://localhost:8000/images/${mitologia.mytology_profile_img}" width="200" />
                        <div class="category">MITOLOGIA</div>
                        <div class="icon">
                            <img alt="Mitology icon" height="40" src="http://localhost:8000/images/${mitologia.main_symbol}" width="40" />
                        </div>
                        <div class="title" style="color:#000;">${mitologia.name}</div>
                        <div class="guide">Guiar</div>
                    </a>
                </div>
                `;
                });
            })
            .catch(error => console.error("Error fetching mitologias:", error));
    }

    function filterResults(query) {
        const mitologiasPromise = fetch('http://localhost:8000/mythologies').then(response => response.json());
        const deusesPromise = fetch('http://localhost:8000/gods').then(response => response.json());
        const historiasPromise = fetch('http://localhost:8000/history/stories').then(response => response.json());

        Promise.all([mitologiasPromise, deusesPromise, historiasPromise])
            .then(([mitologiasData, deusesData, historiasData]) => {
                const mitologiasFiltered = mitologiasData.mytologies.filter(mitologia =>
                    mitologia.name && mitologia.name.toLowerCase().includes(query)
                );

                const deusesFiltered = deusesData.gods.filter(gods =>
                    gods.name && gods.name.toLowerCase().includes(query)
                );

                const historiasFiltered = historiasData.stories.filter(historia =>
                    historia.title && historia.title.toLowerCase().includes(query)
                );

                suggestions.innerHTML = ''; // Limpa as sugestões anteriores

                mitologiasFiltered.forEach(mitologia => {
                    suggestions.innerHTML += `
                        <div onclick="selectMitologia(${mitologia.id})">
                            Mitologia: ${mitologia.name}
                        </div>
                    `;
                });

                deusesFiltered.forEach(gods => {
                    suggestions.innerHTML += `
                        <div onclick="selectDeus(${gods.id})">
                            Deus: ${gods.name}
                        </div>
                    `;
                });

                historiasFiltered.forEach(historia => {
                    suggestions.innerHTML += `
                        <div onclick="selectHistoria(${historia.id})">
                            História: ${historia.title}
                        </div>
                    `;
                });

                suggestions.style.display = (mitologiasFiltered.length || deusesFiltered.length || historiasFiltered.length) ? 'block' : 'none'; // Mostra/esconde as sugestões
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    window.selectMitologia = function(id) {
        window.location.href = `pg-mitologias.html?idmitologico=${id}`;
    };

    window.selectDeus = function(id) {
        window.location.href = `deuses.html?iddeus=${id}`;
    };

    window.selectHistoria = function(id) {
        window.location.href = `historias.html?idhistoria=${id}`;
    };

    const HistoriaFormElement = document.getElementById('HistoriaFormElement');
    if (HistoriaFormElement) {
        HistoriaFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveHistoria();
        });
    } else {
        console.error("Error: Element with ID 'HistoriaFormElement' not found.");
    }

    const MitologiaFormElement = document.getElementById('MitologiaFormElement');
    if (MitologiaFormElement) {
        MitologiaFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveMitologia();
        });
    } else {
        console.error("Error: Element with ID 'MitologiaFormElement' not found.");
    }

    const DeusFormElement = document.getElementById('DeusFormElement');
    if (DeusFormElement) {
        DeusFormElement.addEventListener('submit', function (event) {
            event.preventDefault();
            saveDeus();
        });
    } else {
        console.error("Error: Element with ID 'DeusFormElement' not found.");
    }
});

function fetchDeus(id) {
    fetch(`http://localhost:8000/gods/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar deus: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('nome-god').innerText = `${data.name}`;
            document.getElementById('inside-text').innerHTML = `<p>${data.description}</p>`;
            
            const imgElement = document.getElementById('bg-img');
            if (data.symbol) {
                imgElement.innerHTML = `<img src="http://localhost:8000/images/${data.symbol}" alt="Foto Mito" id="img-in-main" class="img-in-main" style="height:550px;">`;
            }
        })
        .catch(error => {
            console.error("Error fetching mythology:", error);
        });
}



function fetchComments(id) {
    fetch(`http://localhost:8000/comments/gods/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar comentário: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('comment-list');
            list.innerHTML = '';
            if (Array.isArray(data.comments)) {
                data.comments.forEach(comentario => {
                    list.innerHTML += `
                        <div class="comment-card">
                            <div class="comment-header">
                                <span class="username">${comentario.user.name}</span>
                                <span class="time">${comentario.last_update}</span>
                            </div>
                            <div class="comment-body">${comentario.comment}</div>
                            <div class="comment-footer"></div>
                        </div>
                    `;
                });
            } else {
                console.error("Nenhum comentário encontrado");
            }
        })
        .catch(error => {
            console.error("Error fetching comments:", error);
        });
}



// Código para animação de scroll
document.addEventListener("DOMContentLoaded", function () {
    const animatedElements = document.querySelectorAll('.fotos_mito');

    function animateOnScroll() {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;

            if (isVisible) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// Botão de envio
document.getElementById("enviar-btn").addEventListener("click", function () {
    const tiSection = document.querySelector(".ti");
    const formContainer = document.querySelector(".form-container");

    tiSection.style.transform = "translateX(-10%)";
    formContainer.style.display = "block";
    setTimeout(() => {
        formContainer.style.transform = "translateX(10%)";
    }, 10);
});
