// import the Modules and classes
import React, { useState } from 'react'
import { TextInput, Text, View, StatusBar, Alert, StyleSheet, Pressable } from 'react-native'
// instantiate the CSS object
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
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
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

function Signup ({ navigation }) {
  // user input form values
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword, setCpassword] = useState('')

  // text to display when error occurs
  const [text, setText] = useState('')

  const validateEmail = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    if (reg.test(email) === false) {
      setText('Email is Not Correct')
    } else {
      go()
    }
  }

  const check = () => {
    if (password !== cpassword) {
      setText('PASSWORDS DO NOT MATCH')
    } else if (password.length < 8) {
      setText('PASSWORDS NOT LONG ENOUGH')
    } else {
      validateEmail(email)
    }
  }

  const go = async () => {
    const data = {}

    // add new user to database
    const xhttp = await fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: fname,
        last_name: lname,
        email: email,
        password: password
      })
    })
      .then((response) => response.text())
      .then((text) => {
        if (text === 'Bad Request - database error. Check the log. Possibly duplicate entry?') {
          setText('User Already exists')
        } else {
          Alert.alert(
            'Signup',
            'User created successfully!', [{ text: 'OK' }]
          )
          navigation.push('Login')
        }
      })
      .catch(function (res) {
        console.log(res)
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
          onChangeText={(text) => setFname(text)}
          placeholder='   first name'
          keyboardType='email-address'
        />

        <TextInput
          style={styles.input}
          onChangeText={(text) => setLname(text)}
          placeholder='   last name'
          keyboardType='default'
        />

        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          placeholder='   email'
          keyboardType='default'
        />

        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          placeholder='   password'
          keyboardType='default'
        />

        <TextInput
          style={styles.input}
          onChangeText={(text) => setCpassword(text)}
          secureTextEntry
          placeholder='   confirm password'
          keyboardType='default'
        />

        <Pressable style={styles.button} onPress={() => check()}>
          <Text style={styles.pressText}>Signup</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.pressText}>Login</Text>
        </Pressable>

        <Text style={{ color: 'red', alignSelf: 'center', marginTop: 20 }}>
          {text}
        </Text>

      </View>

      <StatusBar style='auto' />

    </View>
  )
}

export default Signup
