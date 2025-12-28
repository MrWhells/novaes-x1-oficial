/* ==========================================================
   CÉREBRO DA LOJA NOVAESX1 - VERSÃO ELITE FINAL
   ========================================================== */

// 1. BASE DE DADOS INTEGRADA
const produtos = [
    { id: 1, categoria: 'chuteiras', destaque: true, nome: 'Nike Zoom Orange', preco: 'R$ 259,90', img: ['assets/nike-airzoom-orange.webp', 'assets/nike-airzoom-orange.webp'], tag: 'Speed', descricao: 'Grip extremo e amortecimento responsivo. A cor laranja vibrante destaca você na arena.' },
    { id: 2, categoria: 'chuteiras', destaque: true, nome: 'Nike Air Zoom', preco: 'R$ 299,90', img: ['assets/nike-zoom-blue.webp', 'assets/nike-zoom-blue.webp'], tag: '', descricao: 'Tecnologia Air Zoom clássica para máximo retorno de energia e estabilidade.' },
    { id: 3, categoria: 'chuteiras', destaque: true, nome: 'Nike Air Zoom Vini Jr', preco: 'R$ 389,90', img: 'assets/nike-airzoom-vinijunior.webp', tag: 'Elite', descricao: 'Edição especial inspirada no craque Vini Jr. Design focado em agilidade lateral.' },
    { id: 4, categoria: 'vestuario', destaque: true, nome: 'Camisa Dry Fit', preco: 'R$ 89,90', img: 'assets/dry-fit.webp', tag: 'Promo', descricao: 'Tecido respirável de alta tecnologia. Mantém o corpo seco durante o treino.' },
    { id: 5, categoria: 'acessorios', destaque: false, nome: 'Kit com 10 Cones', preco: 'R$ 45,90', img: 'assets/cones-treino.webp', tag: '', descricao: 'Kit com 10 cones resistentes para treinos de agilidade e drible curto.' },
    { id: 6, categoria: 'acessorios', destaque: true, nome: 'Kit com 50 Cones', preco: 'R$ 149,90', img: 'assets/cones-treino.webp', tag: '', descricao: 'Kit completo para treinamento de equipes profissionais.' },
    { id: 7, categoria: 'acessorios', destaque: true, nome: 'Luva Kronos', preco: 'R$ 219,90', img: 'assets/luvakronos.webp', tag: '', descricao: 'PALMA: 3mm de Látex Semi-Profissional. CORTE: Negativo. Altamente resistente.'},
    { id: 8, categoria: 'acessorios', destaque: true, nome: 'Bola Penalty Lider', preco: 'R$ 149,90', img: 'assets/bola-penalty-lider.webp', tag: '', descricao: 'Bola oficial de treino Penalty Lider original profissional.' },
    { id: 9, categoria: 'vestuario', destaque: true, nome: 'Camisa Dry Fit Feminina', preco: 'R$ 109,90', img: 'assets/dryfit-feminina.webp', tag: 'Desc. 10%', descricao: 'Camisa Dry Fit para treinos intensos com respiradouros.' },
    { id: 11, categoria: 'vestuario', destaque: true, nome: 'Regata T', preco: 'R$ 169,90', img: 'assets/camiseta.jpg', tag: 'Desc. 10%', descricao: 'Camiseta para treinos intensos com respiradouros.' },
    { id: 10, categoria: 'vestuario', destaque: false, nome: 'Boné', preco: 'R$ 109,90', img: 'assets/bone.webp', tag: 'Top', descricao: 'Boné para corrida e treinos externos.' },
];

let carrinho = JSON.parse(localStorage.getItem('carrinhoNovaes')) || [];

// 2. FUNÇÕES DE RENDERIZAÇÃO (VITRINE)
function carregarLoja() {
    const grades = {
        chuteiras: document.getElementById('grade-chuteiras'),
        vestuario: document.getElementById('grade-vestuario'),
        acessorios: document.getElementById('grade-acessorios')
    };
    if (!grades.chuteiras) return;

    Object.values(grades).forEach(g => g.innerHTML = "");

    produtos.forEach(prod => {
        const cardHTML = `
            <div class="produto-card" data-description="${prod.descricao}">
                ${prod.tag ? `<span class="tag-destaque">${prod.tag}</span>` : ''}
                <div class="produto-img">
                    <img src="${Array.isArray(prod.img) ? prod.img[0] : prod.img}" alt="${prod.nome}">
                </div>
                <div class="produto-detalhes">
                    <h3>${prod.nome}</h3>
                    <p class="preco">${prod.preco}</p>
                    <button class="btn-comprar" onclick="event.stopPropagation(); adicionarAoCarrinhoDirect(${prod.id})">ADICIONAR AO CARRINHO</button>
                </div>
            </div>`;
        if (grades[prod.categoria]) grades[prod.categoria].innerHTML += cardHTML;
    });
}

// 3. LÓGICA DA MODAL (DETALHES E GALERIA)
function configurarModal() {
    const modal = document.getElementById('modal-detalhes');
    if (!modal) return;

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.produto-card');
        if (card && !e.target.classList.contains('btn-comprar')) {
            const nomeCard = card.querySelector('h3').innerText;
            const produtoOriginal = produtos.find(p => p.nome === nomeCard);

            if (produtoOriginal) {
                produtoOriginal.tamanhoSelecionado = null;
                document.getElementById('modal-nome').innerText = produtoOriginal.nome;
                document.getElementById('modal-preco').innerText = produtoOriginal.preco;
                document.getElementById('modal-descricao').innerText = card.getAttribute('data-description') || produtoOriginal.descricao;

                const imgGrande = document.getElementById('modal-img-grande');
                const containerMini = document.getElementById('modal-miniaturas');
                const fotos = Array.isArray(produtoOriginal.img) ? produtoOriginal.img : [produtoOriginal.img];
                
                imgGrande.src = fotos[0];
                containerMini.innerHTML = ''; 

                if (fotos.length > 1) {
                    fotos.forEach((url, index) => {
                        const mini = document.createElement('img');
                        mini.src = url;
                        mini.className = 'foto-miniatura' + (index === 0 ? ' active' : '');
                        mini.onclick = () => {
                            imgGrande.src = url;
                            document.querySelectorAll('.foto-miniatura').forEach(m => m.classList.remove('active'));
                            mini.classList.add('active');
                        };
                        containerMini.appendChild(mini);
                    });
                }

                const grid = document.getElementById('grid-tamanhos');
                const containerTamanhos = document.getElementById('container-tamanhos');
                grid.innerHTML = '';

                if (produtoOriginal.categoria === 'acessorios') {
                    containerTamanhos.style.display = 'none';
                } else {
                    containerTamanhos.style.display = 'block';
                    const lista = (produtoOriginal.categoria === 'vestuario') ? ['P', 'M', 'G', 'GG', 'XG'] : [37, 38, 39, 40, 41, 42, 43];
                    lista.forEach(t => {
                        const btn = document.createElement('button');
                        btn.className = 'btn-tamanho';
                        btn.innerText = t;
                        btn.onclick = () => {
                            document.querySelectorAll('.btn-tamanho').forEach(b => b.classList.remove('selecionado'));
                            btn.classList.add('selecionado');
                            produtoOriginal.tamanhoSelecionado = t;
                        };
                        grid.appendChild(btn);
                    });
                }

                document.getElementById('btn-adicionar-modal').onclick = () => {
                    if (produtoOriginal.categoria !== 'acessorios' && !produtoOriginal.tamanhoSelecionado) {
                        alert("Por favor, selecione um tamanho!"); return;
                    }
                    adicionarAoCarrinho(produtoOriginal.id, produtoOriginal.tamanhoSelecionado);
                    modal.style.display = 'none';
                    toggleCart(true);
                };
                modal.style.display = 'flex';
            }
        }
        if (e.target.classList.contains('fechar-modal') || e.target === modal) modal.style.display = 'none';
    });
}

// 4. LÓGICA DO CARRINHO (SINCRO E STORAGE)
function adicionarAoCarrinhoDirect(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto.categoria !== 'acessorios') {
        alert("Por favor, selecione o tamanho clicando no produto.");
    } else {
        adicionarAoCarrinho(id, null);
    }
}

function adicionarAoCarrinho(id, tamanho) {
    const produtoBase = produtos.find(p => p.id === Number(id));
    const itemExistente = carrinho.find(item => item.id === id && item.tamanho === tamanho);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produtoBase, quantidade: 1, tamanho: tamanho });
    }
    atualizarCarrinho();
    animarIcone();
}

function atualizarCarrinho() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    container.innerHTML = '';
    let totalGeral = 0;
    let totalItens = 0;

    carrinho.forEach((item, index) => {
        const precoNum = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.'));
        const subtotal = precoNum * item.quantidade;
        totalGeral += subtotal;
        totalItens += item.quantidade;

        container.innerHTML += `
            <div class="cart-item-list">
                <div class="cart-item-img"><img src="${Array.isArray(item.img) ? item.img[0] : item.img}"></div>
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    ${item.tamanho ? `<p class="cart-item-tamanho">Tamanho: <strong>${item.tamanho}</strong></p>` : ''}
                    <p>${item.preco}</p>
                    <div class="quantidade-controles">
                        <button onclick="mudarQuantidade(${index}, -1)">-</button>
                        <span class="qtd-numero">${item.quantidade}</span>
                        <button onclick="mudarQuantidade(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="btn-remove" onclick="removerDoCarrinho(${index})">✕</button>
            </div>`;
    });

    document.getElementById('cart-count').innerText = totalItens;
    document.getElementById('cart-total-value').innerText = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    localStorage.setItem('carrinhoNovaes', JSON.stringify(carrinho));
}

function mudarQuantidade(index, delta) {
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    atualizarCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function toggleCart(open) {
    const sideCart = document.getElementById('side-cart');
    const overlay = document.getElementById('cart-overlay');
    if (open) {
        sideCart.classList.add('active');
        overlay.classList.add('active');
    } else {
        sideCart.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function animarIcone() {
    const icon = document.getElementById('cart-icon');
    if (!icon) return;
    icon.classList.add('cart-bump');
    setTimeout(() => icon.classList.remove('cart-bump'), 400);
}

// 5. CARROSSEL DA HOME (SÓ RODA NA INDEX)
function carregarDestaquesHome() {
    const sliderTrack = document.querySelector('.slider-track'); 
    
    // Se não encontrar o carrossel na página, ele para aqui e não trava o resto
    if (!sliderTrack) return; 

    // Filtra apenas produtos marcados como destaque: true no seu array
    const destaques = produtos.filter(p => p.destaque === true);
    sliderTrack.innerHTML = ''; 

    destaques.forEach(prod => {
        const foto = Array.isArray(prod.img) ? prod.img[0] : prod.img;
        sliderTrack.innerHTML += `
            <div class="slide-item">
                <a href="./loja.html#${prod.categoria}" style="text-decoration: none; color: inherit;">
                    <img src="${foto}" alt="${prod.nome}">
                    <div class="slide-info">
                        <h4>${prod.nome}</h4>
                        <span class="slide-preco">${prod.preco}</span>
                    </div>
                </a>
            </div>`;
    });
    console.log("Carrossel carregado com sucesso!");
}

// 6. INICIALIZAÇÃO SEGURA (CONTROLE DE PÁGINAS)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Funções de Carrinho (Comuns a todas as páginas)
    atualizarCarrinho();
    const cartBtn = document.getElementById('cart-icon');
    if (cartBtn) cartBtn.onclick = () => toggleCart(true);
    
    const closeBtn = document.getElementById('close-cart');
    if (closeBtn) closeBtn.onclick = () => toggleCart(false);

    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.onclick = () => toggleCart(false);

    // 2. Só roda se for a Loja
    if (document.getElementById('grade-chuteiras')) {
        carregarLoja();
        configurarModal();
    }

    // 3. Só roda se for a Home
    if (document.querySelector('.slider-track')) {
        carregarDestaquesHome();
    }
    
    const btnCheckout = document.querySelector('.btn-checkout');
    if (btnCheckout) {
        btnCheckout.onclick = () => {
            if (carrinho.length === 0) alert("Carrinho vazio!");
            else window.location.href = 'checkout.html';
        };
    }
});