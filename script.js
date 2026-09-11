const PRECO_PRODUTO = 30;

const estados = [
    0,
    5,
    10,
    15,
    20,
    25,
    30
];

function transicao(estadoAtual, moeda) {

    if (estadoAtual >= 30) {

        return 30;
    }

    const proximoValor = estadoAtual + moeda;

    if (proximoValor >= PRECO_PRODUTO) {

        return 30;
    }

    return proximoValor;
}

let estadoAtual = 0;

let saldoReal = 0;

let quantidadeTransicoes = 0;

const balanceDisplay =
    document.getElementById("balanceDisplay");

const stateDisplay =
    document.getElementById("stateDisplay");

const previousState =
    document.getElementById("previousState");

const currentState =
    document.getElementById("currentState");

const transitionInput =
    document.getElementById("transitionInput");

const message =
    document.getElementById("message");

const transitionHistory =
    document.getElementById("transitionHistory");

const transitionCount =
    document.getElementById("transitionCount");

const productMessage =
    document.getElementById("productMessage");

const resultSection =
    document.getElementById("resultSection");

const productsResult =
    document.getElementById("productsResult");

const changeResult =
    document.getElementById("changeResult");

const resultMessage =
    document.getElementById("resultMessage");

const finishButton =
    document.getElementById("finishButton");

const resetButton =
    document.getElementById("resetButton");

const coinButtons =
    document.querySelectorAll(".coin-button");

const stateNodes =
    document.querySelectorAll(".state-node");

function formatarReais(centavos) {

    return (
        "R$ " +
        (centavos / 100)
            .toFixed(2)
            .replace(".", ",")
    );
}

function nomeEstado(estado) {

    if (estado >= 30) {

        return "q30+";
    }

    return `q${estado}`;
}

function atualizarDisplay() {

    balanceDisplay.textContent =
        formatarReais(saldoReal);

    stateDisplay.textContent =
        nomeEstado(estadoAtual);

    currentState.textContent =
        nomeEstado(estadoAtual);

    atualizarDiagrama();
}

function atualizarDiagrama() {

    stateNodes.forEach(node => {

        const estadoNode =
            Number(node.dataset.state);

        node.classList.remove("active");

        if (estadoNode === estadoAtual) {

            node.classList.add("active");
        }

    });
}

function tocarSomMoeda() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) {

        return;
    }

    const audioContext =
        new AudioContext();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(
        900,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        1800,
        audioContext.currentTime + 0.08
    );


    gain.gain.setValueAtTime(
        0.001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.25,
        audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.12
    );


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.12
    );
}

function animarBotao(botao) {

    botao.classList.remove("coin-animation");

    void botao.offsetWidth;

    botao.classList.add("coin-animation");
}

function registrarTransicao(
    estadoAnterior,
    moeda,
    novoEstado
) {

    quantidadeTransicoes++;

    transitionCount.textContent =
        `${quantidadeTransicoes} ${quantidadeTransicoes === 1
            ? "transição"
            : "transições"
        }`;

    const emptyHistory =
        transitionHistory.querySelector(
            ".empty-history"
        );

    if (emptyHistory) {

        emptyHistory.remove();
    }

    const row =
        document.createElement("div");

    row.className =
        "history-row current-transition";


    row.innerHTML = `

        <span class="history-state">
            ${nomeEstado(estadoAnterior)}
        </span>

        <span class="history-input">
            +${moeda}¢
        </span>

        <span>→</span>

        <span class="history-state">
            ${nomeEstado(novoEstado)}
        </span>

    `;

    transitionHistory.prepend(row);

    setTimeout(() => {

        row.classList.remove(
            "current-transition"
        );

    }, 800);
}

function inserirMoeda(moeda) {

    const estadoAnterior =
        estadoAtual;

    const novoEstado =
        transicao(
            estadoAtual,
            moeda
        );

    saldoReal += moeda;

    estadoAtual =
        novoEstado;

    previousState.textContent =
        nomeEstado(estadoAnterior);

    transitionInput.textContent =
        `${moeda}¢`;

    currentState.textContent =
        nomeEstado(novoEstado);

    registrarTransicao(
        estadoAnterior,
        moeda,
        novoEstado
    );

    atualizarDisplay();

    if (estadoAtual >= 30) {

        message.textContent =
            "Valor suficiente! Você pode finalizar a compra.";

        productMessage.textContent =
            "PRONTO PARA FINALIZAR";

    } else {

        const faltante =
            PRECO_PRODUTO - saldoReal;

        message.textContent =
            `Faltam ${formatarReais(faltante)}.`;

        productMessage.textContent =
            "INSIRA MAIS MOEDAS";
    }

    tocarSomMoeda();
}

coinButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const moeda =
                Number(button.dataset.value);

            animarBotao(button);

            inserirMoeda(moeda);
        }
    );

});

function finalizarCompra() {

    if (saldoReal < PRECO_PRODUTO) {

        const faltante =
            PRECO_PRODUTO - saldoReal;

        message.textContent =
            `Não é possível finalizar. ` +
            `Faltam ${formatarReais(faltante)}.`;

        return;
    }

    const quantidadeProdutos =
        Math.floor(
            saldoReal / PRECO_PRODUTO
        );

    const troco =
        saldoReal % PRECO_PRODUTO;

    productsResult.textContent =
        quantidadeProdutos;

    changeResult.textContent =
        formatarReais(troco);

    if (troco > 0) {

        resultMessage.textContent =
            `Retire seu(s) produto(s) e ` +
            `retire seu troco de ` +
            `${troco} centavo${troco === 1 ? "" : "s"}!`;

    } else {

        resultMessage.textContent =
            `Retire seu(s) produto(s)!`;
    }

    message.textContent =
        "Compra finalizada!";


    productMessage.textContent =
        "RETIRE SEU PRODUTO";

    resultSection.classList.remove(
        "hidden"
    );

    coinButtons.forEach(button => {

        button.disabled = true;

    });

    finishButton.disabled = true;
}

finishButton.addEventListener(
    "click",
    finalizarCompra
);

function novaCompra() {

    estadoAtual = 0;

    saldoReal = 0;

    quantidadeTransicoes = 0;

    balanceDisplay.textContent =
        "R$ 0,00";

    stateDisplay.textContent =
        "q0";

    previousState.textContent =
        "q0";

    currentState.textContent =
        "q0";

    transitionInput.textContent =
        "—";

    message.textContent =
        "Insira uma moeda.";

    productMessage.textContent =
        "AGUARDANDO COMPRA";

    transitionHistory.innerHTML = `

        <div class="empty-history">
            Nenhuma transição realizada ainda.
        </div>

    `;

    transitionCount.textContent =
        "0 transições";

    resultSection.classList.add(
        "hidden"
    );

    coinButtons.forEach(button => {

        button.disabled = false;

    });

    finishButton.disabled = false;

    atualizarDiagrama();
}

resetButton.addEventListener(
    "click",
    novaCompra
);

atualizarDisplay();