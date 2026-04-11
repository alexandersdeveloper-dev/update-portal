export default function PrivacyModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Política de Privacidade">
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Política de Privacidade</h2>
          <p className="modal-subtitle">Radar da Transparência – Município de Parintins/AM</p>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Fechar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="modal-body">

          <section className="modal-section">
            <h3>1. Disposições Preliminares e Finalidade</h3>
            <p>A presente Política de Privacidade tem por escopo estabelecer, de forma clara, transparente e juridicamente adequada, as diretrizes atinentes ao tratamento de dados eventualmente realizados no âmbito do sistema denominado Radar da Transparência, ambiente digital de caráter informativo, desenvolvido com a finalidade de disponibilizar indicadores, dados consolidados e informações de interesse público.</p>
            <p>O presente instrumento visa assegurar a observância dos princípios da legalidade, finalidade, adequação, necessidade, transparência, segurança e responsabilização, nos termos da legislação vigente, notadamente a Lei nº 13.709/2018 (LGPD).</p>
          </section>

          <section className="modal-section">
            <h3>2. Natureza do Ambiente</h3>
            <p>O Radar da Transparência constitui ferramenta de caráter:</p>
            <ul>
              <li>meramente informativo;</li>
              <li>não oficial para fins jurídicos;</li>
              <li>voltado ao acompanhamento técnico e à promoção da transparência ativa.</li>
            </ul>
            <p>As informações nele disponibilizadas não substituem, sob qualquer hipótese, os meios oficiais de publicação institucional, tampouco produzem efeitos jurídicos, administrativos ou probatórios.</p>
          </section>

          <section className="modal-section">
            <h3>3. Dados Eventualmente Coletados</h3>
            <p>O acesso ao sistema poderá implicar a coleta automática de dados de natureza técnica, não sensíveis, tais como:</p>
            <ul>
              <li>endereço IP (Internet Protocol);</li>
              <li>tipo e versão do navegador utilizado;</li>
              <li>sistema operacional;</li>
              <li>data e hora de acesso;</li>
              <li>páginas visitadas e tempo de permanência;</li>
              <li>informações de interação com a interface.</li>
            </ul>
            <p>Ressalta-se que não são coletados dados pessoais sensíveis, tampouco informações que permitam a identificação direta do usuário, salvo nas hipóteses legalmente autorizadas.</p>
          </section>

          <section className="modal-section">
            <h3>4. Finalidade do Tratamento dos Dados</h3>
            <p>Os dados eventualmente coletados destinam-se exclusivamente às seguintes finalidades:</p>
            <ul>
              <li>monitoramento estatístico de acessos;</li>
              <li>aprimoramento da experiência do usuário;</li>
              <li>diagnóstico de desempenho e estabilidade do sistema;</li>
              <li>identificação de falhas técnicas e correções operacionais;</li>
              <li>garantia da segurança da aplicação.</li>
            </ul>
            <p>É vedada a utilização dos dados para finalidades diversas das aqui estabelecidas.</p>
          </section>

          <section className="modal-section">
            <h3>5. Base Legal para o Tratamento</h3>
            <p>O tratamento de dados realizado no âmbito do sistema encontra fundamento nas hipóteses legais previstas na LGPD, especialmente:</p>
            <ul>
              <li>cumprimento de obrigação legal ou regulatória;</li>
              <li>execução de políticas públicas;</li>
              <li>legítimo interesse da Administração Pública, observado o equilíbrio entre a finalidade institucional e os direitos do titular.</li>
            </ul>
          </section>

          <section className="modal-section">
            <h3>6. Compartilhamento de Dados</h3>
            <p>Os dados coletados não são compartilhados com terceiros, exceto:</p>
            <ul>
              <li>quando exigido por determinação legal ou judicial;</li>
              <li>quando necessário para cumprimento de obrigações legais;</li>
              <li>para órgãos de controle e fiscalização, quando aplicável.</li>
            </ul>
            <p>Não há comercialização, cessão ou divulgação indevida de dados.</p>
          </section>

          <section className="modal-section">
            <h3>7. Armazenamento e Segurança</h3>
            <p>Os dados eventualmente coletados são armazenados em ambiente seguro, observando-se medidas técnicas e administrativas aptas a proteger contra:</p>
            <ul>
              <li>acessos não autorizados;</li>
              <li>vazamentos;</li>
              <li>perda, alteração ou destruição indevida.</li>
            </ul>
            <p>São adotadas práticas compatíveis com os padrões de segurança da informação aplicáveis à Administração Pública.</p>
          </section>

          <section className="modal-section">
            <h3>8. Utilização de Cookies</h3>
            <p>O sistema poderá utilizar cookies estritamente necessários e/ou de natureza estatística, com as seguintes finalidades:</p>
            <ul>
              <li>funcionamento adequado da aplicação;</li>
              <li>coleta de dados agregados de navegação;</li>
              <li>melhoria da usabilidade.</li>
            </ul>
            <p>Os cookies utilizados não possuem caráter invasivo nem permitem identificação direta do usuário.</p>
          </section>

          <section className="modal-section">
            <h3>9. Direitos do Usuário (Titular dos Dados)</h3>
            <p>Nos termos da legislação vigente, são assegurados ao usuário, quando aplicável:</p>
            <ul>
              <li>confirmação da existência de tratamento de dados;</li>
              <li>acesso às informações eventualmente coletadas;</li>
              <li>correção de dados incompletos ou desatualizados;</li>
              <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>informação sobre compartilhamento de dados;</li>
              <li>revogação de consentimento, quando cabível.</li>
            </ul>
          </section>

          <section className="modal-section">
            <h3>10. Limitação de Responsabilidade</h3>
            <p>O Município e os responsáveis pelo sistema não se responsabilizam por:</p>
            <ul>
              <li>utilização indevida das informações por terceiros;</li>
              <li>interpretações equivocadas dos dados apresentados;</li>
              <li>decisões tomadas com base em informações preliminares ou não oficiais.</li>
            </ul>
          </section>

          <section className="modal-section">
            <h3>11. Alterações da Política</h3>
            <p>A presente Política poderá ser atualizada a qualquer tempo, visando adequação normativa, melhoria dos serviços ou evolução tecnológica, sendo recomendada sua consulta periódica.</p>
          </section>

          <section className="modal-section">
            <h3>12. Canal de Contato</h3>
            <p>Para esclarecimentos, solicitações ou exercício de direitos relacionados à privacidade, o usuário poderá utilizar os canais oficiais do Município, por meio de:</p>
            <ul>
              <li>e-mail institucional;</li>
              <li>ou outros canais de atendimento disponibilizados.</li>
            </ul>
          </section>

          <section className="modal-section">
            <h3>13. Disposições Finais</h3>
            <p>Ao acessar e utilizar o sistema Radar da Transparência, o usuário declara estar ciente das disposições constantes nesta Política de Privacidade, reconhecendo sua natureza informativa e as limitações inerentes ao ambiente.</p>
          </section>

          <div className="modal-closing">
            <p>O presente documento constitui instrumento formal de governança informacional, alinhado às diretrizes de transparência pública e proteção de dados, reforçando o compromisso institucional com a legalidade, a ética administrativa e a segurança das informações.</p>
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
