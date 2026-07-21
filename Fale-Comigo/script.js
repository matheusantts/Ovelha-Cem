// ===== Configuração =====
// Email para onde as mensagens serão enviadas.
const EMAIL_DESTINO = "contato@suaigreja.com.br";

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

// Envia a mensagem abrindo o cliente de email do usuário (mailto),
// já preenchido com o assunto e o corpo da mensagem.
function enviarPorMailto(nome, email, mensagem) {
  const assunto = encodeURIComponent(`Fale Conosco - mensagem de ${nome}`);
  const corpo = encodeURIComponent(
    `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
  );

  window.location.href = `mailto:${EMAIL_DESTINO}?subject=${assunto}&body=${corpo}`;
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

  definirStatus("Abrindo seu aplicativo de email...", "sucesso");
  enviarPorMailto(nome, email, mensagem);
});

// Remove a mensagem de erro assim que a pessoa começa a corrigir o campo.
Object.keys(campos).forEach((nomeCampo) => {
  campos[nomeCampo].addEventListener("input", () => limparErro(nomeCampo));
});
