// ==================== PRODUTOS ====================
const products = [
    // Bebidas
    { id: 1, name: "Sucos",      price: 14.90, desc: "Cacau 70% com leite fresco e canela",              img: "https://picsum.photos/id/201/300/300", category: "bebidas" },
    { id: 12, name: "Refrigerante",  price: 12.90, desc: "Expresso duplo + raspas de chocolate",              img: "https://picsum.photos/id/1015/300/300", category: "bebidas" },
    { id: 13, name: "Café",  price: 12.90, desc: "Expresso duplo + raspas de chocolate",              img: "https://picsum.photos/id/1015/300/300", category: "bebidas" },
   
    // Chocolates & Doces
    { id: 2, name: "Brownie Recheado",       price: 42.00, desc: "Para 2 pessoas + frutas da estação",               img: "https://picsum.photos/id/292/300/300", category: "chocolates" },
    { id: 3, name: "Bolo Mini", price: 19.50, desc: "Nozes caramelizadas e calda quente",               img: "https://picsum.photos/id/312/300/300", category: "chocolates" },
    { id: 4, name: "Brigadeiros",    price: 26.00, desc: "Massa crocante e recheio cremoso",                  img: "https://picsum.photos/id/431/300/300", category: "chocolates" },
    { id: 7, name: "Cupcake",   price: 28.00, desc: "Caixa gourmet para presentear",                     img: "https://picsum.photos/id/160/300/300", category: "chocolates" },
    { id: 8, name: "Tortinha de Limão", price: 17.50, desc: "Finalizado com flor de sal",                        img: "https://picsum.photos/id/201/300/300", category: "chocolates" },

    // Salgados
    { id: 9,  name: "Pão de Queijo",       price: 9.90,  desc: "Massa crocante recheada com frango e catupiry", img: "https://picsum.photos/id/450/300/300", category: "salgados" },
    { id: 10, name: "Sanduiche de ovos Premium",       price: 11.50, desc: "Empada gourmet com toque de chocolate",         img: "https://picsum.photos/id/460/300/300", category: "salgados" },
    { id: 11, name: "Salgados", price: 10.90, desc: "Pastel crocante com redução de chocolate",     img: "https://picsum.photos/id/470/300/300", category: "salgados" },
    { id: 11, name: "Bolos", price: 10.90, desc: "Pastel crocante com redução de chocolate",     img: "https://picsum.photos/id/470/300/300", category: "salgados" },

];



let cart = [];

// ==================== FUNÇÕES ====================
function renderMenu(filteredProducts = products) {
    const container = document.getElementById('menu-grid');
    if (!container) return;

    container.innerHTML = '';

    filteredProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'menu-card bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-[1.02]';
        card.dataset.category = p.category;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                openProductModal(p);
            }
        });

        card.innerHTML = `
            <img src="${p.img}" class="w-full h-52 object-cover">
            <div class="p-5">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-lg text-[var(--choco)]">${p.name}</h4>
                        <p class="text-xs text-gray-500 mt-1">${p.desc}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-[var(--green)] font-bold text-xl">R$ ${p.price.toFixed(2)}</div>
                    </div>
                </div>
                <button onclick="addToCart(${p.id}); event.stopPropagation();" 
                        class="mt-6 w-full bg-[var(--choco)] hover:bg-[#3f2210] text-white py-4 rounded-2xl text-sm font-semibold transition-all">
                    ADICIONAR AO CARRINHO
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterProducts(category) {
    // Atualiza botão ativo
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Filtra os produtos
    let filtered = products;
    if (category !== 'todos') {
        filtered = products.filter(p => p.category === category);
    }

    renderMenu(filtered);
}

// ==================== CARRINHO ====================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    showToast(`✅ ${product.name} adicionado!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateCartCount();
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        renderCart();
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-basket text-6xl text-gray-300"></i>
                <p class="mt-4 text-gray-400">Seu carrinho está vazio</p>
            </div>
        `;
        document.getElementById('subtotal').textContent = 'R$ 0,00';
        document.getElementById('total-price').textContent = 'R$ 0,00';
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'flex gap-4';
        div.innerHTML = `
            <img src="${item.img}" class="w-16 h-16 object-cover rounded-2xl">
            <div class="flex-1">
                <div class="flex justify-between">
                    <div class="font-medium">${item.name}</div>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 text-xs">remover</button>
                </div>
                <div class="text-xs text-gray-500">${item.desc}</div>
                <div class="flex items-center justify-between mt-4">
                    <div class="flex items-center border rounded-2xl">
                        <button onclick="changeQuantity(${item.id}, -1)" class="w-8 h-8 flex items-center justify-center">-</button>
                        <span class="px-4 font-medium">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" class="w-8 h-8 flex items-center justify-center">+</button>
                    </div>
                    <div class="font-semibold">R$ ${itemTotal.toFixed(2)}</div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('total-price').textContent = `R$ ${subtotal.toFixed(2)}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) renderCart();
}

function goToCheckout() {
    if (cart.length === 0) return;
    toggleCart();
    const checkout = document.getElementById('checkout-modal');
    if (checkout) checkout.classList.remove('hidden');
}

function closeCheckout() {
    const checkout = document.getElementById('checkout-modal');
    if (checkout) checkout.classList.add('hidden');
}

function processarPedido() {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    alert(`✅ Pedido realizado com sucesso!\n\nTotal: R$ ${total.toFixed(2)}`);
    cart = [];
    updateCartCount();
    closeCheckout();
    showToast('🎉 Pedido enviado!');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:100px;right:30px;background:var(--green);color:white;padding:16px 24px;border-radius:9999px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);z-index:99999;font-weight:500;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'all 0.4s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ==================== MODAL DE DETALHES ====================
function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="w-full h-64 object-cover rounded-2xl mb-6">
        <div class="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm mb-4">
            ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </div>
        <h2 class="text-3xl font-bold text-[var(--choco)] mb-2">${product.name}</h2>
        <div class="text-3xl font-bold text-[var(--green)] mb-6">R$ ${product.price.toFixed(2)}</div>
        <p class="text-gray-700 text-lg leading-relaxed mb-8">${product.desc}</p>
        <div class="flex gap-4">
            <button onclick="addToCart(${product.id}); closeProductModal();" 
                    class="flex-1 bg-[var(--choco)] text-white py-4 rounded-2xl font-semibold hover:bg-[#3f2210]">Adicionar ao Carrinho</button>
            <button onclick="closeProductModal()" 
                    class="flex-1 border-2 border-gray-300 py-4 rounded-2xl font-semibold hover:bg-gray-100">Fechar</button>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartCount();

    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Remove active de todos
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filtra produtos
            filterProducts(category);
        });
    });

    // Ativa "Todos" por padrão
    const todosBtn = document.querySelector('.category-btn[data-category="todos"]');
    if (todosBtn) todosBtn.classList.add('active');
});