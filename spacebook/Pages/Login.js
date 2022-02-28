import React, { useEffect, useState } from 'react';
import { TextInput,Text, View, Button, StatusBar, StyleSheet, DrawerLayoutAndroidBase, Pressable } from 'react-native';

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



export default function Login ({navigation}){

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [text, setText] = useState("");

  const [auth, setAuth] = useState([]);


  useEffect (() =>
  {
    const getAuth = async() =>{
      try{
        let data = await AsyncStorage.getItem("userAuth");
        var auth = JSON.parse(data)
        //console.log(JSON.parse(auth))
        //console.log(auth.id)

        setAuth(auth);

        //console.log(auth.id)

        if(auth.id > 1){
          navigation.reset({
            index: 0,
            routes: [{name: 'MyPage'}]
          });
        }
      }catch(err) {
        console.log(err)
      }
    }

    getAuth();

  });
  
  const go = async () => {

    var data = {};

    const xhttp = await fetch('http://localhost:3333/api/1.0.0/login', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({        
                  email: email,
                  password: password
                })
              })
              .then((response) => response.json())
              .then((text) => {     
                
                const auth = {
                  id: text.id,
                  token: text.token
                }
                
                const save = async() => {
                  try{
                    await AsyncStorage.setItem("userAuth", JSON.stringify(auth));                     
                  }catch(err){
                    console.log(err)
                  }
                }     
                
                save();

                navigation.reset({
                  index: 0,
                  routes: [{name: 'MyPage'}]
                });
                })
              .catch(function (res){
                setText("TRY AGAIN")
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
              onChangeText={(text) => setEmail(text)}
              //value={number}
              placeholder="   email"
              keyboardType='email-address'
          />

          <TextInput style={styles.input}
              //style={styles.input}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder="   password"
              keyboardType="default"
          />


          <Pressable style={styles.button} onPress={go}>
            <Text style={styles.pressText}>Login</Text>
          </Pressable>


          <Pressable style={styles.button} onPress={() => navigation.push('Signup')}>
            <Text style={styles.pressText}>Signup</Text>
          </Pressable>

          <Text style={{color:'red', alignSelf:'center', marginTop: 20}}>
            {text}
          </Text>

      </View>

        <StatusBar style="auto" />

    </View>
  );
}
