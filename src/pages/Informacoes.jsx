const itens = [
  {
    numero: 'I',
    titulo: 'Disponibilidade',
    percentual: null,
    destaque: true,
    texto: 'Será sempre o primeiro item a ser verificado. Avalia-se se a informação está integralmente disponível no portal, conforme a descrição do critério, preferencialmente em formato HTML.',
    alerta: 'Caso o avaliador assinale este item como "não atendido", todo o critério receberá pontuação zero — ou seja, os demais itens de verificação (atualidade, série histórica, gravação de relatórios e filtro de pesquisa) serão automaticamente considerados "não atendidos".',
  },
  {
    numero: 'II',
    titulo: 'Atualidade',
    percentual: null,
    texto: 'Avalia-se se as informações são atuais. De modo geral, considera-se que as informações estão atualizadas quando as mais recentes datarem de, no máximo, 30 dias da data em que for realizada a consulta. Esse parâmetro pode variar conforme o critério analisado, devendo ser observadas as orientações específicas previstas em cada item.',
    alerta: 'Atualizações automáticas de páginas (datas geradas pelo sistema sempre que o usuário acessa — stamp automático) não devem ser consideradas para avaliação da atualidade, pois não se trata de atualização de conteúdo.',
  },
  {
    numero: 'III',
    titulo: 'Série Histórica',
    percentual: null,
    texto: 'Avalia-se se existe a divulgação do histórico de informações dos últimos 3 anos que antecedem à pesquisa. Busca-se conferir se a organização mantém o repositório de informações disponibilizadas ao longo do tempo.',
  },
  {
    numero: 'IV',
    titulo: 'Gravação de Relatórios',
    percentual: null,
    texto: 'Trata-se da possibilidade de gravar o conjunto de informações conforme requisitos especificados para cada critério, em pelo menos um formato editável (extensões do tipo xls, xlsx, txt, csv, odt, calc, ods, doc, docx e outros).',
  },
  {
    numero: 'V',
    titulo: 'Filtro de Pesquisa',
    percentual: null,
    texto: 'Instrumento que permite ao usuário selecionar parâmetros para localizar informações específicas dentro do conjunto de dados correspondente a cada critério avaliado, refinando os resultados e direcionando a consulta conforme opções previamente estruturadas.',
    alerta: 'Não se confunde com a ferramenta de pesquisa geral do portal, que é avaliada em critério próprio.',
  },
]

export default function Informacoes() {
  return (
    <main>
      <section className="info-section">
        <div className="container">

          <div className="info-header">
            <h1 className="info-title">Itens de Verificação</h1>
            <p className="info-subtitle">
              Cada critério avaliado é subdividido nos itens abaixo. Quando um ou mais itens não forem aplicáveis, seu percentual é redistribuído proporcionalmente entre os demais.
            </p>
          </div>

          <div className="info-list">
            {itens.map((item) => (
              <div key={item.numero} className={`info-card${item.destaque ? ' info-card--destaque' : ''}`}>
                <div className="info-card__header">
                  <span className="info-card__numero">{item.numero}</span>
                  <div className="info-card__meta">
                    <h2 className="info-card__titulo">{item.titulo}</h2>
                    {item.percentual && (
                      <span className="info-card__percentual">{item.percentual}%</span>
                    )}
                    {item.destaque && (
                      <span className="info-card__obrigatorio">Verificação obrigatória</span>
                    )}
                  </div>
                </div>
                <p className="info-card__texto">{item.texto}</p>
                {item.alerta && (
                  <div className="info-card__alerta">
                    <i className="bi bi-exclamation-triangle-fill" />
                    <span>{item.alerta}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="info-header" style={{ marginTop: '2.5rem' }}>
            <h1 className="info-title">Critérios de Avaliação</h1>
          </div>

          <div className="info-list">
            <div className="info-card info-card--essencial">
              <div className="info-card__header">
                <span className="importance-chip importance-chip--essencial">Essencial</span>
              </div>
              <p className="info-card__texto">
                Os critérios classificados como "essenciais" são aqueles referentes a informações da execução orçamentária e financeira que se o Poder ou órgão deixar de dar transparência, fica impedido de receber transferências voluntárias e contratar operações de crédito, de acordo com os arts. 48 e 48-A c/c o art. 51 da Lei Complementar nº 101/2000.
              </p>
            </div>

            <div className="info-card info-card--obrigatoria">
              <div className="info-card__header">
                <span className="importance-chip importance-chip--obrigatoria">Obrigatório</span>
              </div>
              <p className="info-card__texto">
                Os critérios classificados como "obrigatórios" são aqueles cujo dever de divulgação na internet está explicitamente prevista em leis e atos normativos.
              </p>
            </div>

            <div className="info-card info-card--recomendada">
              <div className="info-card__header">
                <span className="importance-chip importance-chip--recomendada">Recomendado</span>
              </div>
              <p className="info-card__texto">
                Já os "recomendados" são informações importantes para o público em geral, que, apesar de não constarem expressamente como exigíveis na legislação, são boas práticas que devem ser estimuladas.
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
