import React from 'react'
import { useNavigate } from 'react-router'
import { colors, spacing, blur } from '../../theme'

interface AppHeaderProps {
  title?: string
  subtitle?: string
  onBack?: () => void
  onClose?: () => void
  showBack?: boolean
  showClose?: boolean
  transparent?: boolean
  children?: React.ReactNode
  className?: string
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onClose,
  showBack = false,
  showClose = false,
  transparent = false,
  children,
  className = '',
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.sm} ${spacing.md}`,
    minHeight: '56px',
    background: transparent ? 'transparent' : colors.background.surface,
    backdropFilter: transparent ? undefined : `blur(${blur.md})`,
    borderBottom: transparent ? 'none' : `1px solid ${colors.border.DEFAULT}`,
  }

  const iconButtonStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    color: colors.gray[400],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  const titleContainerStyles: React.CSSProperties = {
    flex: 1,
    textAlign: 'center',
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
  }

  const titleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: 'white',
    margin: 0,
  }

  const subtitleStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.gray[500],
    margin: 0,
    marginTop: '2px',
  }

  return (
    <header className={className} style={containerStyles}>
      <div style={{ width: '40px' }}>
        {showBack && (
          <button
            onClick={handleBack}
            style={iconButtonStyles}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.color = colors.gray[400]
            }}
            aria-label="Voltar"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
      </div>

      <div style={titleContainerStyles}>
        {title && <h1 style={titleStyles}>{title}</h1>}
        {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
        {children}
      </div>

      <div style={{ width: '40px' }}>
        {showClose && (
          <button
            onClick={onClose}
            style={iconButtonStyles}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.color = colors.gray[400]
            }}
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    </header>
  )
}

export default AppHeader
