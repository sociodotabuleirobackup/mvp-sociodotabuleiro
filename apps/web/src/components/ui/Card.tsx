import React from 'react'
import { colors, radius, spacing, shadows, glass } from '../../theme'

type CardVariant = 'glass' | 'solid' | 'outline' | 'glow'

interface CardProps {
  children: React.ReactNode
  variant?: CardVariant
  padding?: keyof typeof spacing | 'none'
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  onClick,
  className = '',
  style,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'glass':
        return {
          background: glass.light.background,
          backdropFilter: `blur(${glass.light.blur})`,
          WebkitBackdropFilter: `blur(${glass.light.blur})`,
          border: `1px solid ${glass.light.border}`,
        }
      case 'solid':
        return {
          background: colors.background.elevated,
          border: `1px solid ${colors.border.DEFAULT}`,
        }
      case 'outline':
        return {
          background: 'transparent',
          border: `1px solid ${colors.border.light}`,
        }
      case 'glow':
        return {
          background: glass.medium.background,
          backdropFilter: `blur(${glass.medium.blur})`,
          WebkitBackdropFilter: `blur(${glass.medium.blur})`,
          border: `1px solid ${colors.primary.DEFAULT}`,
          boxShadow: shadows.glow.primary,
        }
      default:
        return {}
    }
  }

  const baseStyles: React.CSSProperties = {
    borderRadius: radius.lg,
    padding: padding === 'none' ? 0 : spacing[padding],
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    ...getVariantStyles(),
    ...style,
  }

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = variant === 'glow' 
        ? `${shadows.glow.primary}, ${shadows.card}`
        : shadows.card
    }
  }

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = variant === 'glow' ? shadows.glow.primary : 'none'
    }
  }

  return (
    <div
      className={className}
      style={baseStyles}
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </div>
  )
}

export default Card
