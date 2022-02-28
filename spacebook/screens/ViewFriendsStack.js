import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
 
import { Ionicons } from '@expo/vector-icons'; 
import { View } from 'react-native';


import ViewFriends from '../Pages/ViewFriends';
import AddFriends from '../Pages/AddFriends';
import Requests from '../Pages/Requests';



const Tab = createBottomTabNavigator();

function MyPageStack(){
    return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeView') {
                iconName = focused
                  ? 'compass-sharp'
                  : 'compass-outline';
              } else if (route.name === 'AddFriends') {
                iconName = focused ? 'add-circle-sharp' : 'add-circle-outline';
              } else if (route.name == 'Requests'){
                iconName = focused ? 'file-tray' : 'file-tray-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',

          })}>
          <Tab.Screen name="HomeView" 
            options={{
            title:"Search",                    
            headerStyle:{
              backgroundColor: '#237EC3'
            }}}
          component={ViewFriends} />
          <Tab.Screen name="AddFriends" 
          options={{
            headerStyle:{
              backgroundColor: '#237EC3'}}} 
            component={AddFriends} />
          <Tab.Screen name="Requests"
          options={{
          headerStyle:{
            backgroundColor: '#237EC3'}}} 
          component={Requests} />
        </Tab.Navigator>      
    );
  }


export default MyPageStack;