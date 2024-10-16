// Simula uma base de dados de produtos
let products = JSON.parse(localStorage.getItem('produtos')) || [];

// Variável global para armazenar produtos no carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para salvar produtos no LocalStorage
function salvarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(products));
}

// Função para salvar carrinho no LocalStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Exibe os detalhes do produto, incluindo a imagem
function showDetails(nome, preco, quantidade, imagemSrc) {
    const popup = document.getElementById('product-details-popup');
    const overlay = document.getElementById('popup-overlay');
    
    popup.innerHTML = `
        <h3>${nome}</h3>
        <img src="${imagemSrc}" alt="${nome}">
        <p>Preço: R$${preco}</p>
        <p>Quantidade: ${quantidade}</p>
        <button onclick="fecharDetalhes()">Fechar</button>
    `;
    
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

// Fechar popup de detalhes
function fecharDetalhes() {
    document.getElementById('product-details-popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
}

// Adicionar ao carrinho
function adicionarAoCarrinho(nome, preco, quantidade) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade += parseInt(quantidade);
    } else {
        carrinho.push({ nome, preco, quantidade: parseInt(quantidade) });
    }
    salvarCarrinho();
    alert(`${nome} foi adicionado ao carrinho.`);
    atualizarCarrinho();
}

// Atualiza o carrinho
function atualizarCarrinho() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;

    carrinho.forEach((produto, index) => {
        total += produto.preco * produto.quantidade;
        const itemHTML = `
            <div class="cart-item">
                <p>${produto.nome} - R$${produto.preco} x ${produto.quantidade}</p>
                <div class="cart-item-buttons">
                    <button onclick="alterarQuantidade(${index}, -1)">-</button>
                    <span>${produto.quantidade}</span>
                    <button onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
            </div>
        `;
        cartItems.insertAdjacentHTML('beforeend', itemHTML);
    });

    document.getElementById('total-price').innerText = total.toFixed(2);
    salvarCarrinho();
}

// Altera a quantidade de um item no carrinho
function alterarQuantidade(index, change) {
    const item = carrinho[index];
    item.quantidade += change;
    if (item.quantidade <= 0) {
        carrinho.splice(index, 1); // Remove o item se a quantidade for 0
    }
    atualizarCarrinho();
}

// Finaliza a compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
    } else {
        alert("Compra finalizada! Total: R$" + document.getElementById('total-price').innerText);
        carrinho = [];
        atualizarCarrinho();
    }
}

// Mostrar/ocultar o formulário de cadastro ao clicar no link "Cadastrar Produto"
document.getElementById('cadastro-link').addEventListener('click', function(event) {
    event.preventDefault();
    const cadastroSection = document.getElementById('cadastro-produto');
    const productsSection = document.getElementById('products');

    // Alternar visibilidade da seção de cadastro
    if (cadastroSection.style.display === 'none' || cadastroSection.style.display === '') {
        cadastroSection.style.display = 'block'; // Exibe o formulário
        productsSection.style.display = 'none'; // Esconde a lista de produtos
    } else {
        cadastroSection.style.display = 'none'; // Esconde o formulário
        productsSection.style.display = 'block'; // Exibe a lista de produtos
    }
});

// Função para cadastrar novo produto
document.getElementById('form-cadastro').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-produto').value;
    const categoria = document.getElementById('categoria-produto').value;
    const preco = parseFloat(document.getElementById('preco-produto').value).toFixed(2);
    const quantidade = document.getElementById('quantidade-produto').value;
    const imagemInput = document.getElementById('imagem-produto');
    
    // Lê a imagem selecionada
    const imagemSrc = URL.createObjectURL(imagemInput.files[0]);

    // Adiciona o novo produto à lista de produtos
    const novoProduto = { nome, preco, quantidade, categoria, imagemSrc };
    products.push(novoProduto);
    salvarProdutos();

    const categoriaSection = document.getElementById(categoria);

    const produtoHTML = `
        <div class="product">
            <h3>${nome}</h3>
            <img src="${imagemSrc}" alt="${nome}" class="product-img">
            <p>Preço: R$${preco}</p>
            <p>Quantidade: ${quantidade}</p>
            <button onclick="showDetails('${nome}', '${preco}', '${quantidade}', '${imagemSrc}')">Ver Detalhes</button>
            <button onclick="adicionarAoCarrinho('${nome}', ${preco}, ${quantidade})">Adicionar ao Carrinho</button>
        </div>
    `;

    categoriaSection.insertAdjacentHTML('beforeend', produtoHTML);
    alert("Produto cadastrado com sucesso!");
    document.getElementById('form-cadastro').reset();
});

// Carregar produtos salvos ao iniciar
function carregarProdutos() {
    products.forEach(produto => {
        const categoriaSection = document.getElementById(produto.categoria);
        const produtoHTML = `
            <div class="product">
                <h3>${produto.nome}</h3>
                <img src="${produto.imagemSrc}" alt="${produto.nome}" class="product-img">
                <p>Preço: R$${produto.preco}</p>
                <p>Quantidade: ${produto.quantidade}</p>
                <button onclick="showDetails('${produto.nome}', '${produto.preco}', '${produto.quantidade}', '${produto.imagemSrc}')">Ver Detalhes</button>
                <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco}, ${produto.quantidade})">Adicionar ao Carrinho</button>
            </div>
        `;
        categoriaSection.insertAdjacentHTML('beforeend', produtoHTML);
    });
}

// Carregar o estado inicial
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    atualizarCarrinho();
});

// Elementos de overlay para exibir popup de detalhes
document.body.insertAdjacentHTML('beforeend', `
    <div id="popup-overlay"></div>
    <div id="product-details-popup"></div>
`);

// Mostrar/ocultar a seção "Meu Carrinho"
document.getElementById('meu-carrinho').style.display = 'block';
