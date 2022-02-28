import React, { useEffect, useState } from 'react';
import { TextInput,Text, View, Button, StatusBar, Alert, StyleSheet, DrawerLayoutAndroidBase, Pressable } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  center: {
    backgroundColor: 'rgba(39, 154, 241, 0.98)',    
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    //justifyContent: 'space-between'
  },
  text:{
    position: "relative",
    top: '20%',
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 48,
    lineHeight: 60,
    color: 'black',
    paddingBottom: 100
  },
  button:{
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8DCACE',
    //boxSizing: 'border-box',
    shadowOffset: {width: -50, height: 40},
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: '10%',
    paddingHorizontal: '10%', 
    alignSelf: 'center'
  },
  pressText:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    alignSelf: 'center'
  },
  input:{
    shadowOffset: {width: -2, height: 4},
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    backgroundColor: "white",
    width: 200, 
    marginTop: 20, 
    alignItems: 'center'
  },
  form:{
    marginTop: '10%'
  }
})



function Signup ({navigation}){
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [cpassword,setCpassword] = useState("");

  const [text, setText] = useState("");

  const check = () => {
    if (password!= cpassword){
      setText("PASSWORDS DO NOT MATCH")
    }
    else if(password.length < 8){
      setText("PASSWORDS NOT LONG ENOUGH")
    }
    else{
      go()
    }
  }
  
  const go = async () => {

    var data = {};

    const xhttp = await fetch('http://localhost:3333/api/1.0.0/user', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({    
                  first_name: fname,
                  last_name: lname,    
                  email: email,
                  password: password,                
                })
              })
              .then((response) => response.text())
              .then((text) => {    
                  Alert.alert(
                    "Signup",
                    "User created successfully!",[{ text: "OK"}]
                  );
                  navigation.push('Login');              
                })
              .catch(function (res){
                console.log(res)
              })

  };



  return (
    <View style={styles.center}>



        <Text style={styles.text}>
          SPACEBOOK
        </Text>

        <View style={styles.form} >

          <TextInput style={styles.input}
              //style={styles.input}
              onChangeText={(text) => setFname(text)}
              //value={number}
              placeholder="   first name"
              keyboardType='email-address'
          />        

          <TextInput style={styles.input}
              //style={styles.input}
              onChangeText={(text) => setLname(text)}  
              placeholder="   last name"
              keyboardType="default"
          />

          <TextInput style={styles.input}
              //style={styles.input}
              onChangeText={(text) => setEmail(text)}              
              placeholder="   email"
              keyboardType="default"
          />

          <TextInput style={styles.input}
              //style={styles.input}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder="   password"
              keyboardType="default"
          />

          <TextInput style={styles.input}
              //style={styles.input}
              onChangeText={(text) => setCpassword(text)}  
              secureTextEntry={true}            
              placeholder="   confirm password"
              keyboardType="default"
          />

          

          <Pressable style={styles.button} onPress={go}>
            <Text style={styles.pressText}>Signup</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.pressText}>Login</Text>
          </Pressable>

          <Text style={{color:'red', alignSelf:'center', marginTop: 20}}>
            {text}
          </Text>

      </View>

        <StatusBar style="auto" />

    </View>
  );
}

export default Signup;