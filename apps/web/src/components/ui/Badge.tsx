import React from 'react'
import { colors, radius, spacing } from '../../theme'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: string
  removable?: boolean
  onRemove?: () => void
  className?: string
  style?: React.CSSProperties
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  removable = false,
  onRemove,
  className = '',
  style,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: `${colors.primary.DEFAULT}20`,
          color: colors.primary.light,
          border: `1px solid ${colors.primary.DEFAULT}40`,
        }
      case 'accent':
        return {
          background: `${colors.accent.DEFAULT}20`,
          color: colors.accent.light,
          border: `1px solid ${colors.accent.DEFAULT}40`,
        }
      case 'success':
        return {
          background: `${colors.status.success}20`,
          color: colors.status.success,
          border: `1px solid ${colors.status.success}40`,
        }
      case 'warning':
        return {
          background: `${colors.status.warning}20`,
          color: colors.status.warning,
          border: `1px solid ${colors.status.warning}40`,
        }
      case 'error':
        return {
          background: `${colors.status.error}20`,
          color: colors.status.error,
          border: `1px solid ${colors.status.error}40`,
        }
      case 'info':
        return {
          background: `${colors.status.info}20`,
          color: colors.status.info,
          border: `1px solid ${colors.status.info}40`,
        }
      default:
        return {
          background: `${colors.gray[500]}20`,
          color: colors.gray[300],
          border: `1px solid ${colors.gray[600]}`,
        }
    }
  }

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: size === 'sm' ? `2px ${spacing.xs}` : `${spacing.xs} ${spacing.sm}`,
    fontSize: size === 'sm' ? '10px' : '12px',
    fontWeight: 600,
    borderRadius: radius.full,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    ...getVariantStyles(),
    ...style,
  }

  const iconSize = size === 'sm' ? '12px' : '14px'

  return (
    <span className={className} style={baseStyles}>
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: iconSize }}>
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
          }}
          onMouseOver={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = '0.7' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: iconSize }}>
            close
          </span>
        </button>
      )}
    </span>
  )
}

export const Chip = Badge

export default Badge
