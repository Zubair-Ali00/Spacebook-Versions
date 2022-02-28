import React from 'react';
import { TextInput, View, Button, StatusBar, StyleSheet } from 'react-native';

import HomeStack from './screens/HomeStack';


const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  }
})


function App (){
  return (
    <HomeStack />
  );
}

export default App;