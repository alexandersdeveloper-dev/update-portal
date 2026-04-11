import { useState } from 'react'
import Card from './Card.jsx'

const topLinks = [
  'Mapa do site',
  'Lei de Acesso à Informação',
  'Portal transparência',
  'E-SIC',
  'Ouvidoria'
]

const navItems = ['Prefeitura', 'Portal da Transparência', 'Serviço de Informação', 'Ouvidoria', 'Contatos']

const cards = [
  {
    title: 'Informações Prioritárias',
    description: 'Dados essenciais e prioritários para transparência pública.',
    icon: 'bi-star-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '1.1 Possui sítio oficial próprio na internet',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '1.2 Possui portal da transparência próprio ou compartilhado na internet?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '1.3 O acesso ao portal transparência está visível na capa do site?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '1.4 O site e o portal de transparência contêm ferramenta de pesquisa de conteúdo?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      }
    ]
  },
  {
    title: 'Informações Institucionais',
    description: 'Informações sobre a estrutura e funcionamento institucional.',
    icon: 'bi-building',
    tone: '#2f86de',
    features: [
      {
        criterion: '2.1 Divulga a sua estrutura organizacional e a norma que a institui/altera?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.2 Divulga competências e/ou atribuições?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.3 Identifica o nome dos atuais responsáveis pela gestão do Poder/Órgão?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.4 Divulga os endereços e telefones atuais do Poder ou órgão e e-mails institucionais?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.5 Divulga o horário de atendimento?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.6 Divulga os atos normativos próprios?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.7 Divulga as perguntas e respostas mais frequentes?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.8 Participa em redes sociais e apresenta, no seu sítio institucional?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      },
      {
        criterion: '2.9 Inclui botão do Radar da Transparência Pública?',
        subitems: [{ text: 'Disponibilidade', status: 'check' }]
      }
    ]
  },
  {
    title: 'Receitas',
    description: 'Relatórios e dados sobre a arrecadação e receitas municipais.',
    icon: 'bi-currency-dollar',
    tone: '#2f86de',
    features: [
      {
        criterion: '3.1 Divulga as receitas do Poder ou órgão, evidenciando sua previsão e realização?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'x' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '3.2 Divulga a classificação orçamentária por natureza da receita (categoria econômica, origem, espécie, desdobramento)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'x' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '3.3 Divulga a lista dos inscritos em dívida ativa',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Despesas',
    description: 'Informações claras sobre gastos e despesas públicas.',
    icon: 'bi-file-earmark-text',
    tone: '#2f86de',
    features: [
      {
        criterion: '4.1 Divulga o total das despesas empenhadas, liquidadas e pagas?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '4.2 Divulga as despesas por classificação orçamentária?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '4.3 Possibilita a consulta de empenhos com os detalhes do beneficiário do pagamento ou credor, o valor, o bem fornecido ou serviço prestado e a identificação do procedimento licitatório?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Convênios e Transferências',
    description: 'Dados sobre convênios e transferências de recursos.',
    icon: 'bi-handshake',
    tone: '#2f86de',
    features: [
      {
        criterion: '5.1 Divulga as transferências recebidas a partir da celebração de convênios/acordos com indicação, no mínimo, do número/ano do convênio/termo ou ajuste, do valor total previsto dos recursos envolvidos, do valor recebido, do objeto, da vigência, da origem (órgão repassador/concedente) e o inteiro teor do instrumento de convênio/transferência?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '5.2 Divulga as transferências realizadas a partir da celebração de convênios/acordos/ajustes, com indicação, no mínimo, do número/ano do convênio/termo ou ajuste, do beneficiário, do objeto, da vigência, do valor total previsto para repasse, do valor concedido e inteiro teor do instrumento de convênio/termo ou ajuste?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '5.3 Divulga os acordos firmados que não envolvam transferência de recursos financeiros, identificando as partes, o número/ano do convênio/termo ou ajuste, o objeto, a vigência, as obrigações ajustadas e o inteiro teor do instrumento de convênio/termo ou ajuste?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Recursos humanos',
    description: 'Informações sobre pessoal e recursos humanos.',
    icon: 'bi-people-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '6.1 Divulga a relação nominal dos servidores/autoridades/membros, seus cargos/funções, as respectivas lotações, as suas datas de admissão/exoneração/inativação e a carga horária do cargo/função ocupada/desempenhada?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '6.2 Divulga a remuneração nominal de cada servidor/autoridade/Membro?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '6.3 Divulga a tabela com o padrão remuneratório dos cargos e funções?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '6.4 Divulga a lista de seus estagiários, contendo o nome dos estudantes; a data de contratação e a data de término do respectivo contrato?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '6.5 Publica lista dos terceirizados que prestam serviços para o Poder ou órgão/entidades, contendo, em relação a cada um deles: nome completo, função ou atividade exercida e nome da empresa empregadora?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '6.6 Divulga a íntegra dos editais de concursos e seleções públicas realizados pelo Poder ou órgão para provimento de cargos e empregos públicos?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '6.7 Divulga informações sobre os demais atos dos concursos públicos e processos seletivos do Poder ou órgão, contendo no mínimo a lista de aprovados com as classificações e as nomeações?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Diárias',
    description: 'Movimentações de diárias e passagens oficiais para equipes.',
    icon: 'bi-plane-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '7.1 Divulga o nome e o cargo/função do beneficiário, além do valor total recebido, número de diárias usufruídas por afastamento, período de afastamento, motivo do afastamento e local de destino?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '7.2 Divulga tabela ou relação que explicite os valores das diárias dentro do Estado, fora do Estado e fora do país, conforme legislação local?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Licitações',
    description: 'Processos de licitações e contratações públicas.',
    icon: 'bi-clipboard-check',
    tone: '#2f86de',
    features: [
      {
        criterion: '8.1 Divulga a relação das licitações em ordem sequencial, informando o número e modalidade licitatória, o objeto, a data, o valor estimado/homologado e a situação?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '8.2 Divulga a íntegra dos editais de licitação?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '8.3 Divulga a íntegra dos demais documentos das fases interna e externa das licitações?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '8.4 Divulga a íntegra dos principais documentos dos processos de dispensa e inexigibilidade de licitação?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '8.5 Divulga a íntegra das Atas de Adesão – SRP?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '8.6 Divulga o plano de contratações anual?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' }
        ]
      },
      {
        criterion: '8.7 Divulga a relação dos licitantes e/ou contratados sancionados administrativamente pelo Poder ou órgão?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Contratos',
    description: 'Contratos e acordos firmados pela administração.',
    icon: 'bi-file-earmark-check',
    tone: '#2f86de',
    features: [
      {
        criterion: '9.1 Divulga a relação dos contratos celebrados em ordem sequencial, com o seu respectivo resumo, contendo, no mínimo, indicação do contratado(a), do valor, do objeto e da vigência, bem como dos aditivos deles decorrentes?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '9.2 Divulga o inteiro teor dos contratos e dos respectivos termos aditivos?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '9.3 Divulga a relação/lista dos fiscais de cada contrato vigente e encerrado?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '9.4 Divulga a ordem cronológica de seus pagamentos, bem como as justificativas que fundamentaram a eventual alteração dessa ordem?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Obras',
    description: 'Informações sobre obras públicas em andamento.',
    icon: 'bi-tools',
    tone: '#2f86de',
    features: [
      {
        criterion: '10.1 Divulga informações sobre as obras contendo o objeto, a situação atual, as datas de início e de conclusão da obra, empresa contratada e o percentual concluído?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '10.2 Divulga os quantitativos, os preços unitários e totais contratados?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' }
        ]
      },
      {
        criterion: '10.3 Divulga os quantitativos executados e os preços efetivamente pagos?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' }
        ]
      },
      {
        criterion: '10.4 Divulga relação das obras paralisadas contendo o motivo, o responsável pela inexecução temporária do objeto do contrato e a data prevista para o reinício da sua execução?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Planejamento e Prestação de Contas',
    description: 'Planejamento orçamentário e prestação de contas.',
    icon: 'bi-bar-chart-line-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '11.1 Publica a Prestação de Contas do Ano Anterior (Balanço Geral)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '11.2 Divulga o Relatório de Gestão ou Atividades?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '11.3 Divulga a íntegra da decisão da apreciação ou julgamento das contas pelo Tribunal de Contas?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' }
        ]
      },
      {
        criterion: '11.4 Divulga o resultado do julgamento das Contas do Chefe do Poder Executivo pelo Poder Legislativo?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' }
        ]
      },
      {
        criterion: '11.5 Divulga o Relatório de Gestão Fiscal (RGF)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '11.6 Divulga o Relatório Resumido da Execução Orçamentária (RREO)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '11.7 Divulga o plano estratégico institucional?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '11.8 Divulga a Lei do Plano Plurianual (PPA) e seus anexos?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '11.9 Divulga a Lei de Diretrizes Orçamentárias (LDO) e seus anexos?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'SIC',
    description: 'Serviço de Informação ao Cidadão.',
    icon: 'bi-info-circle-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '12.1 Existe o SIC no site ou no portal de transparência e indica a unidade/setor responsável?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '12.2 Indica o endereço físico, o telefone e o e-mail da unidade responsável pelo SIC, além do horário de funcionamento?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '12.3 Há possibilidade de envio de pedidos de informação de forma eletrônica (e-SIC)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '12.4 A solicitação por meio de eSic é simples, ou seja, sem a exigência de itens de identificação do requerente que dificultem ou impossibilitem o acesso à informação, tais como: envio de documentos, assinatura reconhecida, declaração de responsabilidade, maioridade?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '12.5 Divulga nesta seção, instrumento normativo local que regulamente a Lei nº 12.527/2011 – LAI?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '12.6 Divulga, na seção relativa ao e-SIC, os prazos de resposta ao cidadão, incluindo o recursal, e as autoridades competentes para o exame dos pedidos, além do procedimento referente à realização do pedido e de eventual recurso?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '12.7 Divulga relatório anual estatístico contendo a quantidade de pedidos de acesso recebidos, atendidos, indeferidos, bem como informações genéricas sobre os solicitantes?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '12.8 Divulga lista de documentos classificados em cada grau de sigilo, contendo pelo menos o assunto sobre o qual versa a informação, a categoria na qual ela se encontra, o dispositivo legal que fundamenta a classificação e o respectivo prazo?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '12.9 Divulga lista das informações que tenham sido desclassificadas nos últimos 12 (doze) meses?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Acessibilidade',
    description: 'Informações sobre acessibilidade e inclusão.',
    icon: 'bi-universal-access-circle',
    tone: '#2f86de',
    features: [
      {
        criterion: '13.1 O site oficial e o portal de transparência contêm símbolo de acessibilidade em destaque?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '13.2 O site e o portal de transparência contêm exibição do “caminho” de páginas percorridas pelo usuário?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '13.3 O site e o portal de transparência contêm opção de alto contraste?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '13.4 O site e o portal de transparência contêm ferramenta de redimensionamento de texto?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '13.5 Contém mapa do site institucional?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Ouvidoria',
    description: 'Canal para manifestações e acompanhamento.',
    icon: 'bi-ear-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '14.1 Há informações sobre o atendimento presencial pela Ouvidoria (Indicação de endereço físico e telefone, além do horário de funcionamento)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '14.2 Há canal eletrônico de acesso/interação com a ouvidoria?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '14.3 Divulga Carta de Serviços ao Usuário?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'LGPD e Governo Digital',
    description: 'Proteção de dados e iniciativas de governo digital.',
    icon: 'bi-shield-lock-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '15.1 Identifica o encarregado/responsável pelo tratamento de dados pessoais e disponibiliza Canal de Comunicação com esse servidor (telefone e/ou e-mail)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '15.2 Publica a sua Política de Privacidade e Proteção de Dados?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '15.3 Possibilita a demanda e o acesso a serviços públicos por meio digital, sem necessidade de solicitação presencial?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '15.4 Possibilita o acesso automatizado por sistemas externos em dados abertos (estruturados e legíveis por máquina), e a página contém as regras de utilização?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '15.5 Regulamenta a Lei Federal nº 14.129/2021 (Governo Digital) e divulga a normativa em seu portal?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '15.6 Realiza e divulga resultados de pesquisas de satisfação?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Renúncia de Receita',
    description: 'Dados sobre renúncias fiscais e de receita.',
    icon: 'bi-cash-stack',
    tone: '#2f86de',
    features: [
      {
        criterion: '16.1 Divulga as desonerações tributárias concedidas e a fundamentação legal individualizada?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '16.2 Divulga os valores da renúncia fiscal prevista e realizada, por tipo ou espécie de benefício ou incentivo fiscal?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '16.3 Identifica os beneficiários das desonerações tributárias (benefícios ou incentivos fiscais)?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '16.4 Divulga informações sobre projetos de incentivo à cultura (incluindo esportivos), identificando os projetos aprovados, o respectivo beneficiário e o valor aprovado?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Emendas parlamentares',
    description: 'Informações sobre emendas parlamentares.',
    icon: 'bi-bank',
    tone: '#2f86de',
    features: [
      {
        criterion: '17.1 Identifica as emendas parlamentares federais recebidas, contendo informações sobre a origem, a forma de repasse, o tipo de emenda, o número da emenda, a autoria, o valor previsto e realizado, o objeto e função de governo?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '17.2 Identifica as emendas parlamentares estaduais e municipais, contendo informações sobre a origem, a forma de repasse, o tipo de emenda, o número da emenda, a autoria, o valor previsto e realizado, o objeto e função de governo?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '17.3 Demonstra a execução orçamentária e financeira oriunda das emendas parlamentares recebidas e próprias?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Gravação de Relatórios', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Saúde',
    description: 'Dados e informações sobre saúde pública.',
    icon: 'bi-heart-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '18.1 Divulga o plano de saúde, a programação anual e o relatório de gestão?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '18.2 Divulga informações relacionadas aos serviços de saúde, indicando os horários, os profissionais prestadores de serviços, as especialidades e local?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '18.3 Divulga a lista de espera de regulação para acesso às consultas, exames e serviços médicos?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '18.4 Divulga lista dos medicamentos a serem fornecidos pelo SUS e informações de como obter medicamentos, incluindo os de alto custo?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '18.5 Divulga os estoques de medicamentos das farmácias públicas?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '18.6 Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Saúde?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      }
    ]
  },
  {
    title: 'Educação e Assistência Social',
    description: 'Informações sobre educação e assistência social.',
    icon: 'bi-book-fill',
    tone: '#2f86de',
    features: [
      {
        criterion: '19.1 Divulga o plano de educação e o respectivo relatório de resultados?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' },
          { text: 'Série Histórica', status: 'check' },
          { text: 'Filtro de Pesquisa', status: 'check' }
        ]
      },
      {
        criterion: '19.2 Divulga a lista de espera em creches públicas e os critérios de priorização de acesso a elas?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' },
          { text: 'Atualidade', status: 'check' }
        ]
      },
      {
        criterion: '19.3 Divulga informações atualizadas sobre a composição e o funcionamento do Conselho do Fundeb?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      },
      {
        criterion: '19.4 Divulga informações atualizadas sobre a composição e o funcionamento do Conselho de Assistência Social?',
        subitems: [
          { text: 'Disponibilidade', status: 'check' }
        ]
      }
    ]
  }
]

function App() {
  const [expandedCard, setExpandedCard] = useState(null)

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="topbar">
          <div className="container topbar__inner">
            <div className="topbar__links">
              {topLinks.map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
            <div className="topbar__social social">
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>

        <div className="masthead">
          <div className="container masthead__inner">
            <div className="brand-cluster">
              <a href="#top">
                <img
                  className="brand-cluster__logo"
                  src="https://acheitudo.com.br/images/logo.png"
                  alt="Logo da Prefeitura de Parintins"
                />
              </a>
            </div>
            <div className="masthead__badges">
              <a className="info-badge" href="https://transparencia.parintins.am.gov.br/" target="_blank" rel="noreferrer">
                <i className="bi bi-shield-check"></i>
                <span>Portal da Transparência</span>
              </a>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-portal" aria-label="Navegação principal">
          <div className="container navbar-inner">
            <div className="navbar-nav">
              {navItems.map((item) => (
                <a key={item} className="nav-link" href="#">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="cards-section">
          <div className="cards-grid container">
            {cards.map((card, index) => (
              <Card
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                tone={card.tone}
                features={card.features}
                isExpanded={expandedCard === index}
                onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <h2>AcheiTudo</h2>
            <p>Portal inspirado no visual institucional do site com cores, gradações e posicionamento semelhantes.</p>
          </div>
          <div className="footer-links">
            <a href="#">Política de privacidade</a>
            <a href="#">Termos de uso</a>
            <a href="#">Fale conosco</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
