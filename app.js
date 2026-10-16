document.addEventListener("DOMContentLoaded", () => {
    initGlobalSearchSystem();
    initOrderCalculator();
});

/**
 * BUSCADOR INTERNO EN TIEMPO REAL CON RESALTADO
 */
function initGlobalSearchSystem() {
    const searchInput = document.getElementById("global-search-input");
    const clearBtn = document.getElementById("clear-search-btn");
    const dropdown = document.getElementById("search-results-dropdown");
    const targetElements = document.querySelectorAll(".search-target");

    if (!searchInput) return;

    targetElements.forEach(el => {
        if (!el.dataset.originalContent) {
            el.dataset.originalContent = el.textContent;
        }
    });

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 0) {
            clearBtn.classList.remove("hidden");
            executeSearch(query, targetElements, dropdown);
        } else {
            resetSearch(targetElements, dropdown, clearBtn);
        }
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        resetSearch(targetElements, dropdown, clearBtn);
        searchInput.focus();
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add("hidden");
        }
    });
}

function executeSearch(query, elements, dropdown) {
    dropdown.innerHTML = "";
    let matchCount = 0;

    elements.forEach(el => {
        const text = el.dataset.originalContent;
        if (text.toLowerCase().includes(query)) {
            matchCount++;
            const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
            el.innerHTML = text.replace(regex, `<mark class="search-highlight">$1</mark>`);

            if (matchCount <= 8) {
                const item = document.createElement("div");
                item.className = "p-3.5 hover:bg-stone-800 cursor-pointer text-xs text-stone-200 transition flex items-center justify-between";
                const previewText = text.length > 60 ? text.substring(0, 60) + "..." : text;
                item.innerHTML = `<span class="truncate">${previewText}</span><i class="fa-solid fa-chevron-right text-[10px] text-amber-500"></i>`;
                item.addEventListener("click", () => {
                    dropdown.classList.add("hidden");
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                });
                dropdown.appendChild(item);
            }
        } else {
            el.innerHTML = text;
        }
    });

    if (matchCount > 0) {
        dropdown.classList.remove("hidden");
    } else {
        dropdown.innerHTML = `<div class="p-3.5 text-xs text-stone-400 text-center">No se encontraron resultados para "${query}"</div>`;
        dropdown.classList.remove("hidden");
    }
}

function resetSearch(elements, dropdown, clearBtn) {
    clearBtn.classList.add("hidden");
    dropdown.classList.add("hidden");
    dropdown.innerHTML = "";
    elements.forEach(el => {
        if (el.dataset.originalContent) {
            el.innerHTML = el.dataset.originalContent;
        }
    });
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * CALCULADORA DE PEDIDOS Y WHATSAPP
 */
function initOrderCalculator() {
    const qtyTradicional = document.getElementById("qty-tradicional");
    const qtyEnchilada = document.getElementById("qty-enchilada");
    const qtyFamiliar = document.getElementById("qty-familiar");
    const totalPriceEl = document.getElementById("total-price");
    const sendBtn = document.getElementById("send-whatsapp-btn");

    if (!qtyTradicional || !sendBtn) return;

    const PRICES = { tradicional: 95, enchilada: 105, familiar: 320 };

    function calculateTotal() {
        const q1 = Math.max(0, parseInt(qtyTradicional.value) || 0);
        const q2 = Math.max(0, parseInt(qtyEnchilada.value) || 0);
        const q3 = Math.max(0, parseInt(qtyFamiliar.value) || 0);

        const total = (q1 * PRICES.tradicional) + (q2 * PRICES.enchilada) + (q3 * PRICES.familiar);
        totalPriceEl.textContent = `$${total} MXN`;
        return { q1, q2, q3, total };
    }

    [qtyTradicional, qtyEnchilada, qtyFamiliar].forEach(input => {
        input.addEventListener("input", calculateTotal);
    });

    sendBtn.addEventListener("click", () => {
        const { q1, q2, q3, total } = calculateTotal();
        if (total === 0) {
            alert("Por favor selecciona al menos una orden antes de enviar tu pedido.");
            return;
        }

        let message = `*¡Hola! Quisiera hacer un pedido de Enchiladas Huastecas:*\n\n`;
        if (q1 > 0) message += `• ${q1}x Orden Tradicional ($${q1 * PRICES.tradicional} MXN)\n`;
        if (q2 > 0) message += `• ${q2}x Orden Cecina Enchilada ($${q2 * PRICES.enchilada} MXN)\n`;
        if (q3 > 0) message += `• ${q3}x Paquete Familiar ($${q3 * PRICES.familiar} MXN)\n`;
        message += `\n*Total:* $${total} MXN`;

        window.open(`https://wa.me/527712399072?text=${encodeURIComponent(message)}`, "_blank");
    });
}