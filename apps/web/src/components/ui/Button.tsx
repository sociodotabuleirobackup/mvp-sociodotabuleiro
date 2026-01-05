import React from 'react'
import { colors, radius, spacing, shadows } from '../../theme'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  style?: React.CSSProperties
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  style,
}) => {
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: `${spacing.xs} ${spacing.sm}`,
          fontSize: '12px',
          minHeight: '32px',
        }
      case 'md':
        return {
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: '14px',
          minHeight: '44px',
        }
      case 'lg':
        return {
          padding: `${spacing.md} ${spacing.lg}`,
          fontSize: '16px',
          minHeight: '52px',
        }
    }
  }

  const getVariantStyles = (): React.CSSProperties => {
    if (disabled) {
      return {
        background: colors.gray[700],
        color: colors.gray[500],
        border: 'none',
        cursor: 'not-allowed',
      }
    }

    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${colors.primary.DEFAULT} 0%, ${colors.primary.dark} 100%)`,
          color: 'white',
          border: 'none',
          boxShadow: shadows.glow.sm,
        }
      case 'secondary':
        return {
          background: `linear-gradient(135deg, ${colors.accent.DEFAULT} 0%, ${colors.accent.dark} 100%)`,
          color: colors.background.DEFAULT,
          border: 'none',
        }
      case 'outline':
        return {
          background: 'transparent',
          color: colors.primary.light,
          border: `1px solid ${colors.primary.DEFAULT}`,
        }
      case 'ghost':
        return {
          background: 'transparent',
          color: colors.gray[300],
          border: 'none',
        }
      case 'danger':
        return {
          background: colors.status.error,
          color: 'white',
          border: 'none',
        }
      default:
        return {}
    }
  }

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  }

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = 'translateY(-1px)'
      e.currentTarget.style.filter = 'brightness(1.1)'
    }
  }

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.filter = 'brightness(1)'
  }

  const iconElement = icon && (
    <span 
      className="material-symbols-outlined" 
      style={{ fontSize: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px' }}
    >
      {loading ? 'progress_activity' : icon}
    </span>
  )

  return (
    <button
      type={type}
      className={className}
      style={baseStyles}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {loading && !icon && (
        <span 
          className="material-symbols-outlined animate-spin" 
          style={{ fontSize: '20px' }}
        >
          progress_activity
        </span>
      )}
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  )
}

export default Button
