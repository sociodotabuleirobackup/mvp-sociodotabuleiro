import React from 'react'
import { Screen, AppHeader, Card, Button, Badge, Chip, IconCircleGlow } from '../components/ui'
import { colors, radius, spacing } from '../theme'

export const UIPlayground: React.FC = () => {
  const sectionStyle: React.CSSProperties = {
    marginBottom: spacing.xl,
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottom: `1px solid ${colors.border.DEFAULT}`,
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  }

  return (
    <div style={{ background: colors.background.DEFAULT, minHeight: '100vh' }}>
      <AppHeader 
        title="UI Playground" 
        subtitle="Componentes Base"
        showBack 
      />
      
      <Screen padded>
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>IconCircleGlow</h2>
          <div style={rowStyle}>
            <IconCircleGlow icon="auto_awesome" color="primary" size="sm" />
            <IconCircleGlow icon="star" color="primary" size="md" />
            <IconCircleGlow icon="diamond" color="primary" size="lg" />
            <IconCircleGlow icon="workspace_premium" color="primary" size="xl" />
          </div>
          <div style={rowStyle}>
            <IconCircleGlow icon="bolt" color="accent" />
            <IconCircleGlow icon="check_circle" color="success" />
            <IconCircleGlow icon="warning" color="warning" />
            <IconCircleGlow icon="error" color="error" />
            <IconCircleGlow icon="info" color="info" />
          </div>
          <div style={rowStyle}>
            <IconCircleGlow icon="favorite" color="primary" pulse />
            <IconCircleGlow icon="notifications" color="accent" glow={false} />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Buttons</h2>
          <div style={rowStyle}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div style={rowStyle}>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
          <div style={rowStyle}>
            <Button variant="primary" icon="add">Com Ícone</Button>
            <Button variant="secondary" icon="arrow_forward" iconPosition="right">Próximo</Button>
            <Button variant="outline" icon="download">Download</Button>
          </div>
          <div style={rowStyle}>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <Button variant="primary" fullWidth style={{ marginTop: spacing.sm }}>
            Full Width Button
          </Button>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Badges / Chips</h2>
          <div style={rowStyle}>
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          <div style={rowStyle}>
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
          </div>
          <div style={rowStyle}>
            <Badge variant="primary" icon="verified">Verificado</Badge>
            <Badge variant="success" icon="check">Completo</Badge>
            <Badge variant="accent" icon="star">Premium</Badge>
          </div>
          <div style={rowStyle}>
            <Chip variant="primary" removable onRemove={() => alert('Remove!')}>
              Removível
            </Chip>
            <Chip variant="accent" removable>RPG</Chip>
            <Chip variant="info" removable>Board Game</Chip>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Cards</h2>
          
          <Card variant="glass" style={{ marginBottom: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <IconCircleGlow icon="auto_awesome" color="primary" />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>Glass Card</h3>
                <p style={{ margin: 0, fontSize: '14px', color: colors.gray[400] }}>
                  Fundo translúcido com blur
                </p>
              </div>
            </div>
          </Card>

          <Card variant="solid" style={{ marginBottom: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <IconCircleGlow icon="dashboard" color="accent" />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>Solid Card</h3>
                <p style={{ margin: 0, fontSize: '14px', color: colors.gray[400] }}>
                  Fundo sólido elevado
                </p>
              </div>
            </div>
          </Card>

          <Card variant="outline" style={{ marginBottom: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <IconCircleGlow icon="border_all" color="info" />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>Outline Card</h3>
                <p style={{ margin: 0, fontSize: '14px', color: colors.gray[400] }}>
                  Apenas borda, sem fundo
                </p>
              </div>
            </div>
          </Card>

          <Card variant="glow" style={{ marginBottom: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <IconCircleGlow icon="star" color="primary" pulse />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>Glow Card</h3>
                <p style={{ margin: 0, fontSize: '14px', color: colors.gray[400] }}>
                  Destaque com brilho roxo
                </p>
              </div>
            </div>
          </Card>

          <Card 
            variant="glass" 
            onClick={() => alert('Card clicado!')}
            style={{ marginBottom: spacing.md }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <IconCircleGlow icon="touch_app" color="success" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>Clickable Card</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: colors.gray[400] }}>
                    Clique para interagir
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined" style={{ color: colors.gray[500] }}>
                chevron_right
              </span>
            </div>
          </Card>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Composição Exemplo</h2>
          
          <Card variant="glass">
            <div style={{ display: 'flex', gap: spacing.md }}>
              <IconCircleGlow icon="castle" color="primary" size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'white' }}>
                    A Masmorra do Dragão
                  </h3>
                  <Badge variant="success" size="sm" icon="verified">Ativo</Badge>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: colors.gray[400], marginBottom: spacing.sm }}>
                  Mesa de D&D 5e para iniciantes
                </p>
                <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.md }}>
                  <Chip variant="primary" size="sm">RPG</Chip>
                  <Chip variant="accent" size="sm">D&D 5e</Chip>
                  <Chip size="sm">4-6 jogadores</Chip>
                </div>
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  <Button variant="primary" size="sm" icon="calendar_month">
                    Reservar
                  </Button>
                  <Button variant="outline" size="sm" icon="info">
                    Detalhes
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Cores do Tema</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: spacing.sm }}>
            {[
              { name: 'Primary', color: colors.primary.DEFAULT },
              { name: 'Primary Light', color: colors.primary.light },
              { name: 'Primary Dark', color: colors.primary.dark },
              { name: 'Accent', color: colors.accent.DEFAULT },
              { name: 'Accent Light', color: colors.accent.light },
              { name: 'Success', color: colors.status.success },
              { name: 'Warning', color: colors.status.warning },
              { name: 'Error', color: colors.status.error },
              { name: 'Info', color: colors.status.info },
            ].map(({ name, color }) => (
              <div key={name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '48px',
                  background: color,
                  borderRadius: radius.md,
                  marginBottom: spacing.xs,
                }} />
                <span style={{ fontSize: '10px', color: colors.gray[400] }}>{name}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: spacing.xl }} />
      </Screen>
    </div>
  )
}

export default UIPlayground
