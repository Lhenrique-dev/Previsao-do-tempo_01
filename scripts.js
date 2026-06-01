/*
Lógica de Programação
- Algoritmo(Receita de bolo - passo a passo)

Fluxo básico
[x] Descobrir quando o botão foi clicado;
[x] Pegar o nome da cidade no input;
[x] Enviar a cidade para o servidor
[x] Pegar a resposta e colocar na tela.

Fluxo de voz
[x] Descobrir quando o botão foi clicado;
[x] Comecar a ouvir e pegar a transcrição
[x] Enviar a transcrição para o servidor;
[x] Pegar a resposta e colocar na tela.


Fluxo da IA 
[x] Pegar os dados da cidade
[x] Enviar dados para a IA
[x] Colocar os dados na tela 

*/
let chaveIA = "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"

async function cliqueiNoBotao() {
  let cidade = document.querySelector(".input-city").value
  let caixa = document.querySelector(".medium-box")
  let chave = "7f5c58e2e6d02dad307993511bfae6a2"
  let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`
  
  //Preciso avisar o JavaScript que eu vou até o servidor
  //Traduzir a resposta do servidor

  let respostaServidor = await fetch(endereco)
  let dadosJson = await respostaServidor.json()

  console.log(dadosJson)

  //Math.floor : Arredondaa o valor da temperatura para baixo
  caixa.innerHTML = `
      <h2 class="cidade">${dadosJson.name}</h2>
      <p class="temp">${Math.floor(dadosJson.main.temp)} °C</p>
      <img class="icone" src =" https://openweathermap.org/payload/api/media/file/${dadosJson.weather[0].icon}.png">
      <p class="umidade">Umidade: ${dadosJson.main.humidity}%</p>
      <button class="botao-ia" onclick="sugestaoDeRoupa()">Sugestão de Roupas</button>
      <p class="resposta-ia">Resposta da IA</p>

    `


}

function detectaVoz() {
  let reconhecimento = new window.webkitSpeechRecognition()
  reconhecimento.lang = "pt-BR"
  reconhecimento.start()

  reconhecimento.onresult = function (evento) {
    let textoTranscrito = evento.results[0][0].transcript
    document.querySelector(".input-city").value = textoTranscrito
    cliqueiNoBotao()

  }


}

async function sugestaoDeRoupa() {
  let temperatura = document.querySelector(".temp").textContent
  let umidade = document.querySelector(".umidade").textContent
  let cidade = document.querySelector(".cidade").textContent

  let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
       "Content-Type": "application/json",
       "Authorization": "Bearer " +  chaveIA 
    },
    body: JSON.stringify({
       "model": "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        {
          role: "user",
          content: `Me dê uma sugestão de qual roupa usar hoje.
          Estou na cidade de: ${cidade}, a temperatura atual é: ${temperatura} 
          e a umidade está em: ${umidade}.
          Me dê sugestões de 2 frases curtas
          
          `
        },
      ]
    })
  })

  /*
  METODO HTTP
  - PADRAO - : Pegar dados do servidor;
  - POST - : Enviar dados para o servidor / Receber resposta;
  - PUT - : Atualizar dados no servidor;
  - DELETE - : Deletar dados no servidor.
  
  */

  let dados = await resposta.json()
  document.querySelector(".resposta-ia").innerHTML = dados.choices[0].message.content
  console.log(dados)

}
