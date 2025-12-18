import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { AuthProvider } from './src/contexts/AuthContext';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor="#050505" />
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#050505',
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ title: 'Painel' }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
});