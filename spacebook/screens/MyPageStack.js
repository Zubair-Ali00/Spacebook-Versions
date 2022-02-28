import React from 'react';
import { TextInput, View, Button, StatusBar, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import MyPage from '../Pages/MyPage';
import FriendPage from '../Pages/FriendPage';
import ViewFriendsStack from './ViewFriendsStack';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  }
})

const Stack = createNativeStackNavigator();

function MyPageStack(){
    return (
      <NavigationContainer >
        <Stack.Navigator>
          <Stack.Screen name="MyPage" component={MyPage} />
          <Stack.Screen name="FriendPage" component={FriendPage} />
          <Stack.Screen name="ViewFriends" component={ViewFriendsStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }


export default MyPageStack;