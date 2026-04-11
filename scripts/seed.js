/**
 * Script de migração: popula o Supabase com os dados do App.jsx
 *
 * Uso:
 *   SERVICE_ROLE_KEY=<sua_chave_service_role> node scripts/seed.js
 *
 * A service_role key está em: Supabase → Settings → API → service_role
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://iwylyzrspmpmflulmxzy.supabase.co'
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌  Faltou a SERVICE_ROLE_KEY.')
  console.error('   Execute: SERVICE_ROLE_KEY=<chave> node scripts/seed.js')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

// ─── Dados completos dos 19 cards ────────────────────────────────────────────

const cards = [
  {
    title: 'Informações Prioritárias',
    description: 'Dados essenciais e prioritários para transparência pública.',
    icon: 'bi-star-fill',
    tone: '#2f86de',
    importance: 'essencial',
    features: [
      { criterion: '1.1 Possui sítio oficial próprio na internet', subitems: ['Disponibilidade'] },
      { criterion: '1.2 Possui portal da transparência próprio ou compartilhado na internet?', subitems: ['Disponibilidade'] },
      { criterion: '1.3 O acesso ao portal transparência está visível na capa do site?', subitems: ['Disponibilidade'] },
      { criterion: '1.4 O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo?', subitems: ['Disponibilidade'] },
    ],
  },
  {
    title: 'Informações Institucionais',
    description: 'Informações sobre a estrutura e funcionamento institucional.',
    icon: 'bi-building',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '2.1 Divulga a sua estrutura organizacional e a norma que a institui/altera?', subitems: ['Disponibilidade'] },
      { criterion: '2.2 Divulga competências e/ou atribuições?', subitems: ['Disponibilidade'] },
      { criterion: '2.3 Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?', subitems: ['Disponibilidade'] },
      { criterion: '2.4 Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?', subitems: ['Disponibilidade'] },
      { criterion: '2.5 Divulga o horário de atendimento?', subitems: ['Disponibilidade'] },
      { criterion: '2.6 Divulga os atos normativos próprios?', subitems: ['Disponibilidade'] },
      { criterion: '2.7 Divulga as perguntas e respostas mais frequentes?', subitems: ['Disponibilidade'] },
      { criterion: '2.8 Participa em redes sociais e apresenta, no seu sítio institucional?', subitems: ['Disponibilidade'] },
      { criterion: '2.9 Inclui botão do Radar da Transparência Pública?', subitems: ['Disponibilidade'] },
    ],
  },
  {
    title: 'Receitas',
    description: 'Relatórios e dados sobre a arrecadação e receitas municipais.',
    icon: 'bi-currency-dollar',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '3.1 Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '3.2 Divulga a classificação orçamentária por natureza da receita (categoria econômica, origem, espécie, desdobramento)?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '3.3 Divulga a lista dos inscritos em dívida ativa', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Despesas',
    description: 'Informações claras sobre gastos e despesas públicas.',
    icon: 'bi-file-earmark-text',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '4.1 Divulga o total das despesas empenhadas, liquidadas e pagas?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '4.2 Divulga as despesas por classificação orçamentária?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '4.3 Possibilita a consulta de empenhos com os detalhes do beneficiário do pagamento ou credor, o valor, o bem fornecido ou serviço prestado e a identificação do procedimento licitatório?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Convênios e Transferências',
    description: 'Dados sobre convênios e transferências de recursos.',
    icon: 'bi-handshake',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '5.1 Divulga as transferências recebidas a partir da celebração de convênios/acordos com indicação, no mínimo, do número/ano do convênio/termo ou ajuste, do valor total previsto dos recursos envolvidos, do valor recebido, do objeto, da vigência, da origem (órgão repassador/concedente) e o inteiro teor do instrumento de convênio/transferência?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '5.2 Divulga as transferências realizadas a partir da celebração de convênios/acordos/ajustes, com indicação, no mínimo, do número/ano do convênio/termo ou ajuste, do beneficiário, do objeto, da vigência, do valor total previsto para repasse, do valor concedido e inteiro teor do instrumento de convênio/termo ou ajuste?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '5.3 Divulga os acordos firmados que não envolvam transferência de recursos financeiros, identificando as partes, o número/ano do convênio/termo ou ajuste, o objeto, a vigência, as obrigações ajustadas e o inteiro teor do instrumento de convênio/termo ou ajuste?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Recursos humanos',
    description: 'Informações sobre pessoal e recursos humanos.',
    icon: 'bi-people-fill',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '6.1 Divulga a relação nominal dos servidores/autoridades/membros, seus cargos/funções, as respectivas lotações, as suas datas de admissão/exoneração/inativação e a carga horária do cargo/função ocupada/desempenhada?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '6.2 Divulga a remuneração nominal de cada servidor/autoridade/Membro?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '6.3 Divulga a tabela com o padrão remuneratório dos cargos e funções?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '6.4 Divulga a lista de seus estagiários, contendo o nome dos estudantes; a data de contratação e a data de término do respectivo contrato?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '6.5 Publica lista dos terceirizados que prestam serviços para o Poder ou órgão/entidades, contendo, em relação a cada um deles: nome completo, função ou atividade exercida e nome da empresa empregadora?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '6.6 Divulga a íntegra dos editais de concursos e seleções públicas realizados pelo Poder ou órgão para provimento de cargos e empregos públicos?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '6.7 Divulga informações sobre os demais atos dos concursos públicos e processos seletivos do Poder ou órgão, contendo no mínimo a lista de aprovados com as classificações e as nomeações?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Diárias',
    description: 'Movimentações de diárias e passagens oficiais para equipes.',
    icon: 'bi-plane-fill',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '7.1 Divulga o nome e o cargo/função do beneficiário, além do valor total recebido, número de diárias usufruídas por afastamento, período de afastamento, motivo do afastamento e local de destino?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '7.2 Divulga tabela ou relação que explicite os valores das diárias dentro do Estado, fora do Estado e fora do país, conforme legislação local?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Licitações',
    description: 'Processos de licitações e contratações públicas.',
    icon: 'bi-clipboard-check',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '8.1 Divulga a relação das licitações em ordem sequencial, informando o número e modalidade licitatória, o objeto, a data, o valor estimado/homologado e a situação?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '8.2 Divulga a íntegra dos editais de licitação?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '8.3 Divulga a íntegra dos demais documentos das fases interna e externa das licitações?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '8.4 Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade de licitação?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '8.5 Divulga a íntegra das Atas de Adesão – SRP?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '8.6 Divulga o plano de contratações anual?', subitems: ['Disponibilidade', 'Atualidade'] },
      { criterion: '8.7 Divulga a relação dos licitantes e/ou contratados sancionados administrativamente pelo Poder ou órgão?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Contratos',
    description: 'Contratos e acordos firmados pela administração.',
    icon: 'bi-file-earmark-check',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '9.1 Divulga a relação dos contratos celebrados em ordem sequencial, com o seu respectivo resumo, contendo, no mínimo, indicação do contratado(a), do valor, do objeto e da vigência, bem como dos aditivos deles decorrentes?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '9.2 Divulga o inteiro teor dos contratos e dos respectivos termos aditivos?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '9.3 Divulga a relação/lista dos fiscais de cada contrato vigente e encerrado?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '9.4 Divulga a ordem cronológica de seus pagamentos, bem como as justificativas que fundamentaram a eventual alteração dessa ordem?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Obras',
    description: 'Informações sobre obras públicas em andamento.',
    icon: 'bi-tools',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '10.1 Divulga informações sobre as obras contendo o objeto, a situação atual, as datas de início e de conclusão da obra, empresa contratada e o percentual concluído?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '10.2 Divulga os quantitativos, os preços unitários e totais contratados?', subitems: ['Disponibilidade', 'Atualidade', 'Gravação de Relatórios'] },
      { criterion: '10.3 Divulga os quantitativos executados e os preços efetivamente pagos?', subitems: ['Disponibilidade', 'Atualidade', 'Gravação de Relatórios'] },
      { criterion: '10.4 Divulga relação das obras paralisadas contendo o motivo, o responsável pela inexecução temporária do objeto do contrato e a data prevista para o reinício da sua execução?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Planejamento e Prestação de Contas',
    description: 'Planejamento orçamentário e prestação de contas.',
    icon: 'bi-bar-chart-line-fill',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '11.1 Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '11.2 Divulga o Relatório de Gestão ou Atividades?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '11.3 Divulga a íntegra da decisão da apreciação ou julgamento das contas pelo Tribunal de Contas?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica'] },
      { criterion: '11.4 Divulga o resultado do julgamento das Contas do Chefe do Poder Executivo pelo Poder Legislativo?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica'] },
      { criterion: '11.5 Divulga o Relatório de Gestão Fiscal (RGF)?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '11.6 Divulga o Relatório Resumido da Execução Orçamentária (RREO)?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '11.7 Divulga o plano estratégico institucional?', subitems: ['Disponibilidade'] },
      { criterion: '11.8 Divulga a Lei do Plano Plurianual (PPA) e seus anexos?', subitems: ['Disponibilidade'] },
      { criterion: '11.9 Divulga a Lei de Diretrizes Orçamentárias (LDO) e seus anexos?', subitems: ['Disponibilidade'] },
    ],
  },
  {
    title: 'SIC',
    description: 'Serviço de Informação ao Cidadão.',
    icon: 'bi-info-circle-fill',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '12.1 Existe o SIC no site ou no portal de transparência e indica a unidade/setor responsável?', subitems: ['Disponibilidade'] },
      { criterion: '12.2 Indica o endereço físico, o telefone e o e-mail da unidade responsável pelo SIC, além do horário de funcionamento?', subitems: ['Disponibilidade'] },
      { criterion: '12.3 Há possibilidade de envio de pedidos de informação de forma eletrônica (e-SIC)?', subitems: ['Disponibilidade'] },
      { criterion: '12.4 A solicitação por meio de eSic é simples, ou seja, sem a exigência de itens de identificação do requerente que dificultem ou impossibilitem o acesso à informação, tais como: envio de documentos, assinatura reconhecida, declaração de responsabilidade, maioridade?', subitems: ['Disponibilidade'] },
      { criterion: '12.5 Divulga nesta seção, instrumento normativo local que regulamente a Lei nº 12.527/2011 – LAI?', subitems: ['Disponibilidade'] },
      { criterion: '12.6 Divulga, na seção relativa ao e-SIC, os prazos de resposta ao cidadão, incluindo o recursal, e as autoridades competentes para o exame dos pedidos, além do procedimento referente à realização do pedido e de eventual recurso?', subitems: ['Disponibilidade'] },
      { criterion: '12.7 Divulga relatório anual estatístico contendo a quantidade de pedidos de acesso recebidos, atendidos, indeferidos, bem como informações genéricas sobre os solicitantes?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '12.8 Divulga lista de documentos classificados em cada grau de sigilo, contendo pelo menos o assunto sobre o qual versa a informação, a categoria na qual ela se encontra, o dispositivo legal que fundamenta a classificação e o respectivo prazo?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '12.9 Divulga lista das informações que tenham sido desclassificadas nos últimos 12 (doze) meses?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Acessibilidade',
    description: 'Informações sobre acessibilidade e inclusão.',
    icon: 'bi-universal-access-circle',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '13.1 O site oficial e o portal de transparência contêm símbolo de acessibilidade em destaque?', subitems: ['Disponibilidade'] },
      { criterion: '13.2 O site e o portal de transparência contêm exibição do "caminho" de páginas percorridas pelo usuário?', subitems: ['Disponibilidade'] },
      { criterion: '13.3 O site e o portal de transparência contêm opção de alto contraste?', subitems: ['Disponibilidade'] },
      { criterion: '13.4 O site e o portal de transparência contêm ferramenta de redimensionamento de texto?', subitems: ['Disponibilidade'] },
      { criterion: '13.5 Contém mapa do site institucional?', subitems: ['Disponibilidade'] },
    ],
  },
  {
    title: 'Ouvidoria',
    description: 'Canal para manifestações e acompanhamento.',
    icon: 'bi-ear-fill',
    tone: '#2f86de',
    importance: 'obrigatoria',
    features: [
      { criterion: '14.1 Há informações sobre o atendimento presencial pela Ouvidoria (Indicação de endereço físico e telefone, além do horário de funcionamento)?', subitems: ['Disponibilidade'] },
      { criterion: '14.2 Há canal eletrônico de acesso/interação com a ouvidoria?', subitems: ['Disponibilidade'] },
      { criterion: '14.3 Divulga Carta de Serviços ao Usuário?', subitems: ['Disponibilidade'] },
    ],
  },
  {
    title: 'LGPD e Governo Digital',
    description: 'Proteção de dados e iniciativas de governo digital.',
    icon: 'bi-shield-lock-fill',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '15.1 Identifica o encarregado/responsável pelo tratamento de dados pessoais e disponibiliza Canal de Comunicação com esse servidor (telefone e/ou e-mail)?', subitems: ['Disponibilidade'] },
      { criterion: '15.2 Publica a sua Política de Privacidade e Proteção de Dados?', subitems: ['Disponibilidade'] },
      { criterion: '15.3 Possibilita a demanda e o acesso a serviços públicos por meio digital, sem necessidade de solicitação presencial?', subitems: ['Disponibilidade'] },
      { criterion: '15.4 Possibilita o acesso automatizado por sistemas externos em dados abertos (estruturados e legíveis por máquina), e a página contém as regras de utilização?', subitems: ['Disponibilidade'] },
      { criterion: '15.5 Regulamenta a Lei Federal nº 14.129/2021 (Governo Digital) e divulga a normativa em seu portal?', subitems: ['Disponibilidade'] },
      { criterion: '15.6 Realiza e divulga resultados de pesquisas de satisfação?', subitems: ['Disponibilidade'] },
    ],
  },
  {
    title: 'Renúncia de Receita',
    description: 'Dados sobre renúncias fiscais e de receita.',
    icon: 'bi-cash-stack',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '16.1 Divulga as desonerações tributárias concedidas e a fundamentação legal individualizada?', subitems: ['Disponibilidade'] },
      { criterion: '16.2 Divulga os valores da renúncia fiscal prevista e realizada, por tipo ou espécie de benefício ou incentivo fiscal?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '16.3 Identifica os beneficiários das desonerações tributárias (benefícios ou incentivos fiscais)?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '16.4 Divulga informações sobre projetos de incentivo à cultura (incluindo esportivos), identificando os projetos aprovados, o respectivo beneficiário e o valor aprovado?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Emendas parlamentares',
    description: 'Informações sobre emendas parlamentares.',
    icon: 'bi-bank',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '17.1 Identifica as emendas parlamentares federais recebidas, contendo informações sobre a origem, a forma de repasse, o tipo de emenda, o número da emenda, a autoria, o valor previsto e realizado, o objeto e função de governo?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '17.2 Identifica as emendas parlamentares estaduais e municipais, contendo informações sobre a origem, a forma de repasse, o tipo de emenda, o número da emenda, a autoria, o valor previsto e realizado, o objeto e função de governo?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
      { criterion: '17.3 Demonstra a execução orçamentária e financeira oriunda das emendas parlamentares recebidas e próprias?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Gravação de Relatórios', 'Filtro de Pesquisa'] },
    ],
  },
  {
    title: 'Saúde',
    description: 'Dados e informações sobre saúde pública.',
    icon: 'bi-heart-fill',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '18.1 Divulga o plano de saúde, a programação anual e o relatório de gestão?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Filtro de Pesquisa'] },
      { criterion: '18.2 Divulga informações relacionadas aos serviços de saúde, indicando os horários, os profissionais prestadores de serviços, as especialidades e local?', subitems: ['Disponibilidade', 'Atualidade', 'Filtro de Pesquisa'] },
      { criterion: '18.3 Divulga a lista de espera de regulação para acesso às consultas, exames e serviços médicos?', subitems: ['Disponibilidade'] },
      { criterion: '18.4 Divulga lista dos medicamentos a serem fornecidos pelo SUS e informações de como obter medicamentos, incluindo os de alto custo?', subitems: ['Disponibilidade', 'Atualidade', 'Filtro de Pesquisa'] },
      { criterion: '18.5 Divulga os estoques de medicamentos das farmácias públicas?', subitems: ['Disponibilidade', 'Atualidade', 'Filtro de Pesquisa'] },
      { criterion: '18.6 Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Saúde?', subitems: ['Disponibilidade'] },
    ],
  },
  {
    title: 'Educação e Assistência Social',
    description: 'Informações sobre educação e assistência social.',
    icon: 'bi-book-fill',
    tone: '#2f86de',
    importance: 'recomendada',
    features: [
      { criterion: '19.1 Divulga o plano de educação e o respectivo relatório de resultados?', subitems: ['Disponibilidade', 'Atualidade', 'Série Histórica', 'Filtro de Pesquisa'] },
      { criterion: '19.2 Divulga a lista de espera em creches públicas e os critérios de priorização de acesso a elas?', subitems: ['Disponibilidade', 'Atualidade'] },
      { criterion: '19.3 Divulga informações atualizadas sobre a composição e o funcionamento do Conselho do Fundeb?', subitems: ['Disponibilidade'] },
      { criterion: '19.4 Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Assistência Social?', subitems: ['Disponibilidade'] },
    ],
  },
]

// ─── Execução ────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🚀 Iniciando migração...\n')

  let totalCriteria = 0
  let totalSubitems = 0

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]

    const { data: category, error: catError } = await supabase
      .from('categories')
      .insert({
        name: card.title,
        description: card.description,
        icon: card.icon,
        tone: card.tone,
        importance: card.importance,
        order: i,
      })
      .select('id')
      .single()

    if (catError) {
      console.error(`❌ Categoria "${card.title}": ${catError.message}`)
      continue
    }

    for (let j = 0; j < card.features.length; j++) {
      const feature = card.features[j]
      const codeMatch = feature.criterion.match(/^(\d+\.\d+)/)
      const code = codeMatch ? codeMatch[1] : `${i + 1}.${j + 1}`

      const { data: criterion, error: critError } = await supabase
        .from('criteria')
        .insert({
          category_id: category.id,
          code,
          text: feature.criterion,
          order: j,
        })
        .select('id')
        .single()

      if (critError) {
        console.error(`  ❌ Critério ${code}: ${critError.message}`)
        continue
      }

      totalCriteria++

      for (let k = 0; k < feature.subitems.length; k++) {
        const { error: subError } = await supabase
          .from('subitems')
          .insert({
            criterion_id: criterion.id,
            label: feature.subitems[k],
            counts_for_score: true,
            order: k,
          })

        if (subError) {
          console.error(`    ❌ Subitem "${feature.subitems[k]}": ${subError.message}`)
        } else {
          totalSubitems++
        }
      }
    }

    console.log(`✅ ${card.title} (${card.importance}) — ${card.features.length} critérios`)
  }

  console.log(`\n🎉 Concluído!`)
  console.log(`   Categorias : ${cards.length}`)
  console.log(`   Critérios  : ${totalCriteria}`)
  console.log(`   Subitens   : ${totalSubitems}`)
}

seed().catch((err) => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
