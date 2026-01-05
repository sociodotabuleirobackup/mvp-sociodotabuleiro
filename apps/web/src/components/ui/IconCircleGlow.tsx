import React from 'react'
import { colors, radius } from '../../theme'

type GlowColor = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info'
type IconSize = 'sm' | 'md' | 'lg' | 'xl'

interface IconCircleGlowProps {
  icon: string
  color?: GlowColor
  size?: IconSize
  glow?: boolean
  pulse?: boolean
  className?: string
  style?: React.CSSProperties
}

export const IconCircleGlow: React.FC<IconCircleGlowProps> = ({
  icon,
  color = 'primary',
  size = 'md',
  glow = true,
  pulse = false,
  className = '',
  style,
}) => {
  const getColor = (): { bg: string; glow: string; icon: string } => {
    switch (color) {
      case 'primary':
        return {
          bg: `${colors.primary.DEFAULT}20`,
          glow: colors.primary.glow,
          icon: colors.primary.light,
        }
      case 'accent':
        return {
          bg: `${colors.accent.DEFAULT}20`,
          glow: colors.accent.glow,
          icon: colors.accent.light,
        }
      case 'success':
        return {
          bg: `${colors.status.success}20`,
          glow: `rgba(34, 197, 94, 0.5)`,
          icon: colors.status.success,
        }
      case 'warning':
        return {
          bg: `${colors.status.warning}20`,
          glow: `rgba(234, 179, 8, 0.5)`,
          icon: colors.status.warning,
        }
      case 'error':
        return {
          bg: `${colors.status.error}20`,
          glow: `rgba(239, 68, 68, 0.5)`,
          icon: colors.status.error,
        }
      case 'info':
        return {
          bg: `${colors.status.info}20`,
          glow: `rgba(59, 130, 246, 0.5)`,
          icon: colors.status.info,
        }
    }
  }

  const getSize = (): { container: string; icon: string } => {
    switch (size) {
      case 'sm':
        return { container: '32px', icon: '16px' }
      case 'md':
        return { container: '48px', icon: '24px' }
      case 'lg':
        return { container: '64px', icon: '32px' }
      case 'xl':
        return { container: '80px', icon: '40px' }
    }
  }

  const colorConfig = getColor()
  const sizeConfig = getSize()

  const containerStyles: React.CSSProperties = {
    width: sizeConfig.container,
    height: sizeConfig.container,
    borderRadius: radius.full,
    background: colorConfig.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: glow ? `0 0 20px ${colorConfig.glow}` : 'none',
    animation: pulse ? 'pulse 2s ease-in-out infinite' : 'none',
    ...style,
  }

  const iconStyles: React.CSSProperties = {
    fontSize: sizeConfig.icon,
    color: colorConfig.icon,
  }

  return (
    <>
      {pulse && (
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
        `}</style>
      )}
      <div className={className} style={containerStyles}>
        <span className="material-symbols-outlined" style={iconStyles}>
          {icon}
        </span>
      </div>
    </>
  )
}

export default IconCircleGlow
