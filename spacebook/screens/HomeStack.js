import React from 'react';
import { TextInput, View, Button, StatusBar, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import MyPageStack from './MyPageStack';

import MyPage from '../Pages/MyPage';
import Signup from '../Pages/Signup';
import Login from '../Pages/Login';
import GetPost from '../Pages/GetPost';

import FriendPage from '../Pages/FriendPage';
import ViewFriendsStack from './ViewFriendsStack';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  }
})

const Stack = createNativeStackNavigator();

function HomeStack(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
          name="Login" 
          component={Login}   
          options={{
            headerStyle:{
              backgroundColor: '#237EC3'
            },            
          }}
          />
          <Stack.Screen name="Signup" component={Signup} 
           options={{
            headerStyle:{
              backgroundColor: '#237EC3'
            },
          }}/>

          <Stack.Screen name="MyPage" options={{ title:"My Page" }} component={MyPage}  
           options={{
            headerStyle:{
              backgroundColor: '#237EC3'
            }
          }}/>
          <Stack.Screen name="FriendPage"  options={{ title:"Friend Page", headerStyle:{
              backgroundColor: '#237EC3'
            } }}component={FriendPage} />

          <Stack.Screen name="GetPost" options={{ title:"Post", headerStyle:{
              backgroundColor: '#237EC3'
            } }} component={GetPost}/>
          
          <Stack.Screen name="ViewFriends" options={{ title:"Search Friends", headerShown: false }} component={ViewFriendsStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }


export default HomeStack;