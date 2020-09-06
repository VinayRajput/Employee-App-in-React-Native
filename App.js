import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants'
import Home from './screens/Home';
import CreateEmployee from './screens/createEmployee';
import Profile from './screens/profile';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import reducers from './reducers/reducers';

const store = createStore(reducers)

const Stack = createStackNavigator();
const headerOptions = {
  title: "My Sweet Home",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "steelblue"
  }
}
export default function App () {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Stack.Navigator>
            <Stack.Screen name="Home"
              component={Home}
              options={headerOptions} />
            <Stack.Screen name="Profile"
              component={Profile}
              options={{ ...headerOptions, title: "Profile" }}
            />
            <Stack.Screen name="Create" component={CreateEmployee}
              options={{ ...headerOptions, title: "Create Employee" }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  )
}

/* export default () => {
  return (
        <App />
  )
} */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: Constants.statusBarHeight,
    padding: 0
    /* alignItems: 'center',
    flexDirection:"column",
    justifyContent: 'center', */
  },
});
