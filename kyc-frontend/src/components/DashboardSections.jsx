import { useNavigate } from 'react-router-dom'

function toArray(data) {
  return Array.isArray(data) ? data : []
}

function DashboardSections({ sections }) {
  const navigate = useNavigate()

  return (
    <div className="stack">
      <div className="stat-grid">
        {sections.map((section) => (
          <div className="card stat-tile" key={section.key}>
            <div className="stat-tile-label">{section.title}</div>
            <div className="stat-tile-value">{section.data?.count ?? 0}</div>
          </div>
        ))}
      </div>

      {sections.map((section) => {
        const items = toArray(section.data?.items)
        return (
          <div className="stack" key={section.key}>
            <div className="section-title-row">
              <h2>{section.title}</h2>
              {section.description ? <span className="subtle">{section.description}</span> : null}
            </div>

            {items.length === 0 ? (
              <div className="card">
                <p>No items.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {section.columns.map((column) => (
                        <th key={column.header}>{column.header}</th>
                      ))}
                      {section.detailPath ? <th></th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        {section.columns.map((column) => (
                          <td key={column.header} className={column.wrap ? 'wrap-cell' : undefined}>
                            {column.render(item)}
                          </td>
                        ))}
                        {section.detailPath ? (
                          <td>
                            <button type="button" onClick={() => navigate(section.detailPath(item))}>
                              {section.actionLabel ?? 'Open'}
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default DashboardSections
