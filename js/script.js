document.addEventListener("DOMContentLoaded", function () {
    fetchMitologia();
    fetchGods();

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

    // Inicialização do carrossel, animação de scroll e outras funcionalidades
    initializeCarousel();
    setupScrollAnimations();

    // Funções auxiliares
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

    function setupScrollAnimations() {
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
        animateOnScroll(); // Executa no carregamento da página
    }

    document.getElementById("enviar-btn").addEventListener("click", function () {
        const tiSection = document.querySelector(".ti");
        const formContainer = document.querySelector(".card-email");

        tiSection.style.transform = "translateX(-10%)";
        formContainer.style.display = "block";
        setTimeout(() => {
            formContainer.style.transform = "translateX(10%)";
        }, 10);
    });

    // Duplicação de colunas para animação
    [...document.querySelectorAll('.column')].forEach(column => {
        column.style.setProperty('--animation', 'slide');
        column.style.setProperty('height', '200%');
        column.innerHTML += column.innerHTML;
    });
});

function fetchGods() {
    fetch(`http://localhost:8000/gods`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar deus: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('god-list');
            list.innerHTML = '';

            if (Array.isArray(data.gods)) {
                data.gods.forEach(gods => {
                    list.innerHTML += `
                        <a href="deuses.html?iddeus=${gods.id}" style="text-decoration: none;">
                    <div class="deus-card">
                        <img alt="Chinese gods and goddesses illustration" height="150"
                            src="http://localhost:8000/images/${gods.symbol}"
                            width="250" />
                        <div class="deus-card-content">
                            <div class="deus-card-icon">
                                <i class="fas fa-gem">
                                </i>
                            </div>
                            <div class="deus-card-title">
                                ${gods.name}
                            </div>
                            <div class="deus-card-description">
                                ${gods.sub_description}
                            </div>
                        </div>
                    </div>
                </a>
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