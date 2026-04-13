export default function AvisoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Aviso Importante">
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Aviso Importante</h2>
          <p className="modal-subtitle">Radar da Transparência – Município de Parintins/AM</p>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Fechar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <p>Este painel não constitui meio oficial de divulgação institucional. Seu conteúdo possui natureza meramente informativa, preliminar e não vinculante, razão pela qual não gera direitos, obrigações, efeitos legais ou presunção de veracidade oficial. Para fins formais, legais ou administrativos, deverão ser observados exclusivamente os canais oficiais de publicação do Município.</p>
          </section>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-close" onClick={onClose} type="button">Entendi</button>
        </div>

      </div>
    </div>
  )
}
