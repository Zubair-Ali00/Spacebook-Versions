import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import ViewFriends from '../Pages/ViewFriends';
import AddFriends from '../Pages/AddFriends';
import Requests from '../Pages/Requests';

const Tab = createBottomTabNavigator();

function MyPageStack () {
  return (
    //creates tab navigator for the View Friends Screen
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          
          //changes the tab icon depending on the route name
          if (route.name === 'HomeView') {
            iconName = focused
              ? 'compass-sharp'
              : 'compass-outline'
          } else if (route.name === 'AddFriends') {
            iconName = focused ? 'add-circle-sharp' : 'add-circle-outline'
          } else if (route.name == 'Requests') {
            iconName = focused ? 'file-tray' : 'file-tray-outline'
          }
                    
          return <Ionicons name={iconName} size={size} color={color} />
        },

        //change tab colour if active or inactive
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray'

      })}
    >
      <Tab.Screen
        name='HomeView'
        options={{
          title: 'Search',
          headerStyle: {
            backgroundColor: '#237EC3'
          }
        }}
        component={ViewFriends}
      />
      <Tab.Screen
        name='AddFriends'
        options={{
          headerStyle: { backgroundColor: '#237EC3' }
        }}
        component={AddFriends}
      />
      <Tab.Screen
        name='Requests'
        options={{
          headerStyle: { backgroundColor: '#237EC3' }
        }}
        component={Requests}
      />
    </Tab.Navigator>
  )
}

export default MyPageStack
