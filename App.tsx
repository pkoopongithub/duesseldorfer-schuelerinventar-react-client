import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionManager } from './services/SessionManager';
import { LoginScreen } from './screens/LoginScreen';
import { MainScreen } from './screens/MainScreen';
import { ProfileDetailScreen } from './screens/ProfileDetailScreen';
import { ProfileEditScreen } from './screens/ProfileEditScreen';
import { GroupManagerScreen } from './screens/GroupManagerScreen';
import { TimeSeriesScreen } from './screens/TimeSeriesScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const session = await AsyncStorage.getItem('session');
    if (userId && session) {
      SessionManager.getInstance().setSession(userId, session);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return null; // Splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="GroupManager" component={GroupManagerScreen} />
            <Stack.Screen name="TimeSeries" component={TimeSeriesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}