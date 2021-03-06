import React from 'react'
import { StyleSheet } from 'react-native'

// navigation containers
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// import pages from Pages folder
import MyPage from '../Pages/MyPage'
import Signup from '../Pages/Signup'
import Login from '../Pages/Login'
import GetPost from '../Pages/GetPost'
import Drafts from '../Pages/DraftsPage'
import CameraPage from '../Pages/Camera'
import FriendPage from '../Pages/FriendPage'

// import view friends tab stack
import ViewFriendsStack from './ViewFriendsStack'

const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  }
})

const Stack = createNativeStackNavigator()

function HomeStack () {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{
            headerStyle: {
              backgroundColor: '#237EC3'
            }
          }}
        />
        <Stack.Screen
          name='Signup' component={Signup}
          options={{
            headerStyle: {
              backgroundColor: '#237EC3'
            }
          }}
        />

        <Stack.Screen
          name='MyPage' component={MyPage}
          options={{
            title: 'My Page',
            headerStyle: {
              backgroundColor: '#237EC3'
            }
          }}
        />
        <Stack.Screen
          name='FriendPage' options={{
            title: 'Friend Page',
            headerStyle: {
              backgroundColor: '#237EC3'
            }
          }} component={FriendPage}
        />

        <Stack.Screen
          name='GetPost' options={{
            title: 'Post',
            headerStyle: {
              backgroundColor: '#237EC3'
            }
          }} component={GetPost}
        />

        <Stack.Screen name='ViewFriends' options={{ title: 'Search Friends', headerShown: false }} component={ViewFriendsStack} />
        <Stack.Screen name='Drafts' options={{ title: 'All Drafts', headerShown: false }} component={Drafts} />
        <Stack.Screen name='CameraPage' options={{ title: 'TakePhoto', headerShown: false }} component={CameraPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default HomeStack
