import React, { useEffect, useState } from 'react'
import { TextInput, Text, View, StatusBar, StyleSheet, Pressable } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
  center: {
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  text: {
    position: 'relative',
    top: '20%',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 48,
    lineHeight: 60,
    color: 'black',
    paddingBottom: 100
  },
  button: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8DCACE',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: '10%',
    alignSelf: 'center'
  },
  pressText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    alignSelf: 'center'
  },
  input: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    backgroundColor: 'white',
    width: 200,
    marginTop: 20,
    alignItems: 'center'
  },
  form: {
    marginTop: '10%'
  }
})

export default function Login ({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // error text at bottom of the page
  const [text, setText] = useState('')

  const [auth, setAuth] = useState([])

  // redirects to main page is the user is already logged in
  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const CheckAuth = JSON.parse(data)
        setAuth(CheckAuth)

        if (auth.id > 1) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MyPage' }]
          })
        }
      } catch (err) {
        console.log(err)
      }
    }

    getAuth()
  }, [])

  // posts request to login, if there is an error , the error text displayed is changed
  const go = async () => {
    const xhttp = await fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then((response) => response.json())
      .then((text) => {
        // after successful login, the authentication object is created in local storage and the app navigates to Mainpage
        const auth = {
          id: text.id,
          token: text.token
        }

        const save = async () => {
          try {
            await AsyncStorage.setItem('userAuth', JSON.stringify(auth))
          } catch (err) {
            console.log(err)
          }
        }

        save()

        navigation.reset({
          index: 0,
          routes: [{ name: 'MyPage' }]
        })
      })
      .catch(function (res) {
        setText(res)
      })
  }

  return (
    <View style={styles.center}>

      <Text style={styles.text}>
        SPACEBOOK
      </Text>

      <View style={styles.form}>

        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          placeholder='   email'
          keyboardType='email-address'
        />

        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          placeholder='   password'
          keyboardType='default'
        />

        <Pressable style={styles.button} onPress={go}>
          <Text style={styles.pressText}>Login</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.push('Signup')}>
          <Text style={styles.pressText}>Signup</Text>
        </Pressable>

        <Text style={{ color: 'red', alignSelf: 'center', marginTop: 20 }}>
          {text}
        </Text>

      </View>

      <StatusBar style='auto' />

    </View>
  )
}
