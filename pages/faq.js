/* ---------- FAQ ---------- */
const FAQ=[
  ['Como a TaskGO calcula a estimativa de preço?','Nossa IA analisa o tipo de serviço, o porte, a urgência, a sua localização e o histórico de milhares de atendimentos já realizados na plataforma para gerar uma faixa de preço realista. O valor final é sempre confirmado com o profissional antes do início do serviço.'],
  ['O que é o código de chegada?','É um código de 4 dígitos gerado para cada pedido. Quando o profissional chega, você informa o código a ele (ou confere o que ele apresenta). Sem essa validação, o atendimento não é iniciado no app — é uma camada extra de segurança para os dois lados.'],
  ['Como funciona o pagamento via PIX?','Você paga pelo app com PIX, cartão ou boleto. O valor fica retido pela TaskGO e só é liberado ao profissional após a confirmação da conclusão. O profissional acompanha o saldo na carteira e pode sacar via chave PIX quando quiser.'],
  ['Quanto tempo leva para sacar o dinheiro?','Saques via PIX caem em até 30 minutos em dias úteis. No plano TaskGO Plus, o saque é instantâneo e sem taxa.'],
  ['Consigo acompanhar o profissional no mapa?','Sim. Assim que o pedido é aceito, você acompanha o deslocamento em tempo real, com distância em quilômetros e tempo estimado de chegada, igual a um app de mobilidade.'],
  ['Existe garantia no serviço?','Todo serviço contratado pelo app tem Garantia TaskGO de 90 dias. Se algo não sair como combinado, você abre um chamado e nosso time media a solução — incluindo reexecução ou reembolso.'],
  ['Posso cancelar um pedido?','Pode. Cancelamentos feitos antes do profissional iniciar o deslocamento são gratuitos. Após o deslocamento, pode haver cobrança de uma taxa de compensação.'],
  ['Como me torno um profissional TaskGO?','Crie sua conta como profissional, envie documento com foto, selfie de validação e comprovantes de experiência. A análise leva até 48h. Aprovado, você já começa a receber pedidos.']
];
function faqList(items){
  return items.map((f,i)=>'<div class="faq-item" id="faq'+i+'"><button class="faq-q" onclick="toggleFaq('+i+')">'+f[0]+ic('plus')+'</button><div class="faq-a"><div>'+f[1]+'</div></div></div>').join('');
}
function toggleFaq(i){const el=$('#faq'+i);if(el)el.classList.toggle('open');}

