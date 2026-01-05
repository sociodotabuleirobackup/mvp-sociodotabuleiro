import React from 'react'
import { spacing } from '../../theme'

interface ScreenProps {
  children: React.ReactNode
  centered?: boolean
  padded?: boolean
  className?: string
  style?: React.CSSProperties
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  centered = false,
  padded = true,
  className = '',
  style,
}) => {
  const baseStyles: React.CSSProperties = {
    minHeight: '100%',
    width: '100%',
    maxWidth: '768px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: padded ? spacing.md : 0,
    display: centered ? 'flex' : 'block',
    flexDirection: centered ? 'column' : undefined,
    alignItems: centered ? 'center' : undefined,
    justifyContent: centered ? 'center' : undefined,
    ...style,
  }

  return (
    <div className={className} style={baseStyles}>
      {children}
    </div>
  )
}

export default Screen
