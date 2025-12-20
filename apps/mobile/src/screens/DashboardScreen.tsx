import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '@socio-do-tabuleiro/shared';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
}) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Sócio do Tabuleiro</Text>
      </View>
      <Text style={styles.welcome}>Bem-vindo, {user.name}!</Text>
      <Text style={styles.role}>
        {user.role === UserRole.MASTER && 'Mestre de RPG'}
        {user.role === UserRole.PLAYER && 'Jogador'}
        {user.role === UserRole.VENUE && 'Lojista'}
      </Text>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Funcionalidades em breve:</Text>
        <Text style={styles.feature}>• Criar e gerenciar sessões</Text>
        <Text style={styles.feature}>• Marketplace de assets</Text>
        <Text style={styles.feature}>• Chat com outros usuários</Text>
        <Text style={styles.feature}>• Sistema de pagamentos</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout();
          navigation.navigate('Welcome');
        }}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#6b26d9',
    marginBottom: 30,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  feature: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
