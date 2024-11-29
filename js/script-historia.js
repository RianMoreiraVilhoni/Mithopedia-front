document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idMitologia = urlParams.get('idmitologico');

    if (idMitologia) {
        fetchMitologia(idMitologia);
        fetchHistorias(idMitologia);
        fetchComments(idMitologia);
    } else {
        console.error("ID da mitologia não encontrado na URL.");
    }
});

function fetchMitologia(id) {
    fetch(`http://localhost:8000/mythologies/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar mitologia: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('nome-mito').innerText = `Mitologia ${data.name}`;
            document.getElementById('inside-text').innerHTML = `<p>${data.description}</p>`;
            
            const imgElement = document.getElementById('bg-img');
            if (data.mytology_profile_img) {
                imgElement.innerHTML = `<img src="http://localhost:8000/images/${data.mytology_profile_img}" alt="Foto Mito" id="img-in-main" class="img-in-main" style="height:550px;">`;
            }

            const resourcesBox = document.getElementById('popular-resources-box');
            if (Array.isArray(data.popular_resources)) {
                resourcesBox.innerHTML = '';
                data.popular_resources.forEach(resource => {
                    resourcesBox.innerHTML += `<a href="${resource.link}">${resource.title}</a>`;
                });
            }
        })
        .catch(error => {
            console.error("Error fetching mythology:", error);
        });
}

function fetchHistorias(id) {
    fetch(`http://localhost:8000/history/mythologies/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar história: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('story-list');
            list.innerHTML = '';

            if (Array.isArray(data.stories)) {
                data.stories.forEach(story => {
                    list.innerHTML += `
                        <div class="card_carro">
                            <div class="image_historia"><img src="http://localhost:8000/images/${story.source}" alt="img-his"></div>
                            <div class="title">${story.title}</div>
                            <div class="description">Lorem Ipsum is simply dummy text of the printing industry.</div>
                            
                            <a href="historias.html?idhistorico=${story.id}" class="button" style="text-decoration:none;">Visualizar</a>
                        </div>
                    `;
                });

                // Inicia o carousel após adicionar os cards
                initializeCarousel();
            } else {
                console.error("Nenhuma história encontrada.");
            }
        })
        .catch(error => {
            console.error("Error fetching story:", error);
        });
}

function fetchComments(id) {
    fetch(`http://localhost:8000/comments/mitology/${id}`)
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
                    // Verificando se 'user' e 'name' existem antes de acessar
                

                    const commentText = comentario.comment ? comentario.comment : "Comentário não disponível.";

                    list.innerHTML += `
                        <div class="comment-card">
                            <div class="comment-header">

                                <span class="username">${comentario.name}</span>
                    
                            </div>
                            <div class="comment-body">${commentText}</div>
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


function initializeCarousel() {
    const carousel = document.querySelector('.card-carousel');
    const cards = document.querySelectorAll('.card_carro');

    if (!carousel || cards.length === 0) {
        console.error("Carousel ou cards não encontrados.");
        return;
    }

    let currentIndex = 0;
    const visibleCards = 4;
    const cardWidth = cards[0].offsetWidth + 20;

    function updateCarousel() {
        const offset = -currentIndex * cardWidth;
        carousel.style.transform = `translateX(${offset}px)`;
    }

    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - visibleCards;
            updateCarousel();
        });
    } else {
        console.warn("Botão 'prev' não encontrado.");
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < cards.length - visibleCards) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    } else {
        console.warn("Botão 'next' não encontrado.");
    }

    setInterval(() => {
        currentIndex = (currentIndex < cards.length - visibleCards) ? currentIndex + 1 : 0;
        updateCarousel();
    }, 3000);
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

function saveComment() {
    const commentText = document.getElementById('comment') ? document.getElementById('comment').value.trim() : '';
    const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
    const mytology = new URLSearchParams(window.location.search).get('idmitologico');
    const date = new Date().toISOString(); // Data atual
    const last_upd = new Date().toISOString(); // Data da última atualização

    // Validações simples
    if (!name || !commentText) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const newComment = {
        comment: commentText,
        date: date,
        last_update: last_upd,
        name: name,
        mytology: mytology, // ID da mitologia, que vem da URL
        god: null, // (Se necessário, pode ser substituído por um valor específico)
        history: null // (Se necessário, pode ser substituído por um valor específico)
    };

    // Envia o comentário para a API
    fetch('http://localhost:8000/comments/', {
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
    .then(data => {
        alert("Comentário enviado com sucesso!");

        // Limpa o formulário
        document.getElementById('name').value = '';
        document.getElementById('comment').value = '';

        // Atualiza a lista de comentários
        fetchComments(mytology);
    })
    .catch(error => {
        console.error("Error saving comment:", error);
        alert("Erro ao enviar comentário. Tente novamente.");
    });
}
