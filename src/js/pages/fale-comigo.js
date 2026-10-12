// ===== Configuração =====
// Email para onde as mensagens serão enviadas.
const EMAIL_DESTINO = "ovelhacem@gmail.com";

const formulario = document.getElementById("formContato");
const statusEnvio = document.getElementById("statusEnvio");

const campos = {
  nome: document.getElementById("nome"),
  email: document.getElementById("email"),
  mensagem: document.getElementById("mensagem"),
};

function limparErro(nomeCampo) {
  const spanErro = formulario.querySelector(`[data-erro-para="${nomeCampo}"]`);
  const wrapper = campos[nomeCampo].closest(".campo");
  spanErro.textContent = "";
  wrapper.classList.remove("invalido");
}

function mostrarErro(nomeCampo, texto) {
  const spanErro = formulario.querySelector(`[data-erro-para="${nomeCampo}"]`);
  const wrapper = campos[nomeCampo].closest(".campo");
  spanErro.textContent = texto;
  wrapper.classList.add("invalido");
}

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarFormulario() {
  let valido = true;

  const nome = campos.nome.value.trim();
  const email = campos.email.value.trim();
  const mensagem = campos.mensagem.value.trim();

  if (nome.length < 2) {
    mostrarErro("nome", "Conte-nos seu nome, por favor.");
    valido = false;
  } else {
    limparErro("nome");
  }

  if (!emailValido(email)) {
    mostrarErro("email", "Informe um email válido.");
    valido = false;
  } else {
    limparErro("email");
  }

  if (mensagem.length < 5) {
    mostrarErro("mensagem", "Escreva um pouco mais sobre sua mensagem.");
    valido = false;
  } else {
    limparErro("mensagem");
  }

  return valido;
}

function definirStatus(texto, tipo) {
  statusEnvio.textContent = texto;
  statusEnvio.classList.remove("sucesso", "falha");
  if (tipo) statusEnvio.classList.add(tipo);
}

// Envia a mensagem pelo FormSubmit (serviço gratuito que encaminha para o
// EMAIL_DESTINO), sem depender de app de email no aparelho do visitante.
// Se falhar (offline, bloqueio), abre o mailto como alternativa.
async function enviarEmail(nome, email, mensagem) {
  try {
    const resposta = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(EMAIL_DESTINO)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: nome,
          email: email,
          message: mensagem,
          _subject: `Fale Comigo - mensagem de ${nome}`,
          _replyto: email,
          _template: "table",
          _captcha: "false",
        }),
      }
    );
    const dados = await resposta.json();
    if (!resposta.ok || String(dados.success) !== "true") {
      throw new Error(dados.message || "Falha no envio");
    }
    formulario.reset();
    definirStatus("Mensagem enviada! Obrigado por falar conosco.", "sucesso");
  } catch (erro) {
    definirStatus("Não foi possível enviar agora. Abrindo seu aplicativo de email...", "falha");
    const assunto = encodeURIComponent(`Fale Comigo - mensagem de ${nome}`);
    const corpo = encodeURIComponent(
      `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
    );
    window.location.href = `mailto:${EMAIL_DESTINO}?subject=${assunto}&body=${corpo}`;
  }
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    definirStatus("Por favor, revise os campos destacados.", "falha");
    return;
  }

  const nome = campos.nome.value.trim();
  const email = campos.email.value.trim();
  const mensagem = campos.mensagem.value.trim();

  definirStatus("Enviando...", "sucesso");
  enviarEmail(nome, email, mensagem);
});

// Remove a mensagem de erro assim que a pessoa começa a corrigir o campo.
Object.keys(campos).forEach((nomeCampo) => {
  campos[nomeCampo].addEventListener("input", () => limparErro(nomeCampo));
});