export default function TermsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Termos de Uso">
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Termos de Uso</h2>
          <p className="modal-subtitle">Radar da Transparência – Município de Parintins/AM</p>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Fechar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="modal-body">

          <section className="modal-section">
            <h3>1. Disposições Preliminares</h3>
            <p>Os presentes Termos de Uso têm por finalidade disciplinar o acesso, a navegação e a utilização do sistema denominado Radar da Transparência, ambiente digital desenvolvido com o objetivo de disponibilizar informações, indicadores e dados de interesse público, em caráter meramente informativo e não vinculante.</p>
            <p>Ao acessar e utilizar o sistema, o usuário declara ciência e concordância integral com as disposições aqui estabelecidas.</p>
          </section>

          <section className="modal-section">
            <h3>2. Natureza do Sistema e Finalidade</h3>
            <p>O Radar da Transparência constitui ferramenta de:</p>
            <ul>
              <li>caráter informativo;</li>
              <li>uso técnico e institucional;</li>
              <li>natureza não oficial para fins jurídicos.</li>
            </ul>
            <p>As informações disponibilizadas possuem finalidade exclusivamente informativa e de acompanhamento, não substituindo, em hipótese alguma, os meios oficiais de publicação do Município, tais como diário oficial, portais institucionais formais ou atos administrativos regularmente publicados.</p>
          </section>

          <section className="modal-section">
            <h3>3. Ausência de Valor Legal e Efeitos Jurídicos</h3>
            <p>O usuário declara estar ciente de que o conteúdo disponibilizado no sistema não possui valor legal, normativo, probatório ou vinculante. Dessa forma:</p>
            <ul>
              <li>não gera direitos ou obrigações;</li>
              <li>não pode ser utilizado como documento oficial;</li>
              <li>não substitui certidões, publicações oficiais ou atos administrativos formais;</li>
              <li>não produz efeitos perante órgãos públicos ou terceiros.</li>
            </ul>
            <p>Qualquer utilização das informações para fins legais, administrativos ou judiciais deverá observar exclusivamente os meios oficiais de publicação.</p>
          </section>

          <section className="modal-section">
            <h3>4. Responsabilidade do Usuário</h3>
            <p>O usuário compromete-se a:</p>
            <ul>
              <li>utilizar o sistema de forma lícita e ética;</li>
              <li>não empregar as informações para fins indevidos, ilícitos ou enganosos;</li>
              <li>não distorcer, manipular ou apresentar os dados fora de seu contexto original;</li>
              <li>não utilizar as informações como base exclusiva para decisões formais ou jurídicas.</li>
            </ul>
            <p>O uso indevido das informações será de inteira responsabilidade do usuário, eximindo a Administração Pública de quaisquer consequências decorrentes.</p>
          </section>

          <section className="modal-section">
            <h3>5. Limitação de Responsabilidade da Administração</h3>
            <p>A Administração Pública Municipal, bem como os responsáveis pela manutenção do sistema, não se responsabilizam por:</p>
            <ul>
              <li>eventuais inconsistências, divergências ou desatualizações de dados;</li>
              <li>interpretações equivocadas das informações apresentadas;</li>
              <li>decisões tomadas com base exclusiva nos dados disponibilizados;</li>
              <li>danos diretos ou indiretos decorrentes do uso do sistema.</li>
            </ul>
            <p>O sistema poderá sofrer interrupções, falhas técnicas ou indisponibilidades, sem aviso prévio, não sendo garantida sua continuidade ininterrupta.</p>
          </section>

          <section className="modal-section">
            <h3>6. Atualização e Integridade das Informações</h3>
            <p>Embora sejam adotadas medidas para assegurar a confiabilidade das informações, não há garantia de que os dados estejam sempre completos, atualizados ou isentos de inconsistências. As informações apresentadas podem estar sujeitas a:</p>
            <ul>
              <li>atualizações posteriores;</li>
              <li>correções técnicas;</li>
              <li>ajustes administrativos.</li>
            </ul>
          </section>

          <section className="modal-section">
            <h3>7. Propriedade Intelectual e Uso das Informações</h3>
            <p>Os dados e informações disponibilizados no sistema possuem caráter público, porém:</p>
            <ul>
              <li>não podem ser utilizados de forma enganosa ou descontextualizada;</li>
              <li>não devem ser apresentados como fonte oficial;</li>
              <li>devem respeitar os princípios da boa-fé e da finalidade informativa.</li>
            </ul>
            <p>É vedada a utilização do sistema para fins que comprometam a integridade das informações ou a imagem institucional do Município.</p>
          </section>

          <section className="modal-section">
            <h3>8. Proteção de Dados e Privacidade</h3>
            <p>O tratamento de dados eventualmente realizado no âmbito do sistema observará as diretrizes estabelecidas na Lei Geral de Proteção de Dados (LGPD), sendo regido por política específica de privacidade.</p>
          </section>

          <section className="modal-section">
            <h3>9. Modificações do Sistema e dos Termos</h3>
            <p>O Município reserva-se o direito de:</p>
            <ul>
              <li>modificar, suspender ou descontinuar o sistema a qualquer tempo;</li>
              <li>alterar estes Termos de Uso sempre que necessário.</li>
            </ul>
            <p>Recomenda-se a consulta periódica deste documento para ciência de eventuais atualizações.</p>
          </section>

          <section className="modal-section">
            <h3>10. Canais Oficiais e Validade das Informações</h3>
            <p>Para fins formais, legais ou administrativos, o usuário deverá sempre recorrer:</p>
            <ul>
              <li>ao Diário Oficial do Município;</li>
              <li>aos canais institucionais oficiais;</li>
              <li>aos atos administrativos devidamente publicados.</li>
            </ul>
            <p>O Radar da Transparência não substitui tais meios.</p>
          </section>

          <section className="modal-section">
            <h3>11. Disposições Finais</h3>
            <p>O uso do sistema implica na aceitação plena e irrestrita destes Termos de Uso.</p>
            <p>O presente instrumento constitui manifestação formal das diretrizes de utilização do sistema, estando alinhado aos princípios da transparência pública, legalidade administrativa e responsabilidade institucional.</p>
          </section>

          <div className="modal-closing">
            <p>O usuário reconhece expressamente que o Radar da Transparência consiste em ferramenta de caráter meramente informativo, não oficial e não vinculante, inexistindo qualquer garantia de validade jurídica das informações nele contidas, sendo vedada sua utilização como fundamento exclusivo para quaisquer atos, decisões ou comprovações perante a Administração Pública ou terceiros.</p>
          </div>

        </div>

        <div className="modal-footer">
          <button className="modal-btn-close" onClick={onClose} type="button">
            Fechar
          </button>
        </div>

      </div>
    </div>
  )
}
