function Card({ title, description, icon, tone, features, isExpanded, onToggle }) {
  return (
    <article className="priority-card" style={{ '--tone': tone }}>
      <div className="priority-card__header">
        <div className="priority-card__top">
          <div className="priority-card__marker" />
          <div className="priority-card__icon">
            <i className={`bi ${icon}`} />
          </div>
        </div>
        <button className="priority-card__toggle" onClick={onToggle}>
          <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
        </button>
      </div>
      <h3>{title}</h3>
      <div className={`priority-card__content ${isExpanded ? 'expanded' : ''}`}>
        <p>{description}</p>
        {features && (
          <ul className="priority-card__features">
            {features.map((feature, index) => (
              <li key={index}>
                {typeof feature === 'string' ? (
                  <>
                    <i className="bi bi-check-circle"></i> {feature}
                  </>
                ) : (
                  <div className="feature-group">
                    <div className="feature-criterion">
                      {(() => {
                        const hasNonCompliant = feature.subitems.some(sub => sub.status === 'x');
                        const iconClass = hasNonCompliant ? 'bi-dash-circle' : 'bi-check-circle';
                        return <i className={`bi ${iconClass}`}></i>;
                      })()} {feature.criterion}
                    </div>
                    <ul className="feature-subitems">
                      {feature.subitems.map((subitem, subIndex) => (
                        <li key={subIndex}>
                          <i className={`bi ${subitem.status === 'x' ? 'bi-x-circle' : 'bi-check-circle'}`}></i> {subitem.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default Card