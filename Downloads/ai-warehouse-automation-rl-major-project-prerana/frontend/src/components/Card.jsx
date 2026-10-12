import { forwardRef } from 'react'

export const Card = forwardRef(({ title, subtitle, children, className = '', action }, ref) => {
  return (
    <div ref={ref} className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-surface-900">{title}</h3>}
            {subtitle && <p className="text-sm text-surface-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )
})

Card.displayName = 'Card'