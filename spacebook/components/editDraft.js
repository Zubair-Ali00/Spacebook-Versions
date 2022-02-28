import React, { useEffect, useState } from 'react';
import { Text, TextInput, View,Button, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';


const styles = StyleSheet.create({
  post:{
      width: '90%',
      backgroundColor: '#C0E2FB',
      alignItems: 'center',
      padding: 5,
      borderRadius: 20,
      top: 20,
      marginBottom: 20,
      elevation: 20,
      shadowColor: '#52006A',
  },
  post1:{
      flexDirection: 'row',
      alignSelf: "baseline", 
      marginLeft: 10, 
  },
  image:{
      width: 40,
      height: 40,
      backgroundColor: 'white',
      borderRadius: 40,
      alignSelf: 'flex-start'
  },
  info:{
      marginLeft: 10,    
  },
  text: {
      fontWeight: 'bold',
  },
  post2:{
      alignSelf: 'baseline',
      marginLeft: 20,
      flexDirection: 'column',
      marginBottom: 15,
      marginTop: 15,
  },
  post3:{
      flexDirection: 'row',        
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
  input:{
    shadowOffset: {width: -2, height: 4},
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    backgroundColor: "white",
    width: '100%',
    height: '100%', 
    alignItems: 'center',
    marginBottom: '10%',
    paddingLeft: 30
  },
})




function EditDraft(props) {

    const navigation = useNavigation();
    const [newtext, setNewtext] = useState("");

    var text = props.text;

    var first_name = props.first_name;
    var last_name = props.last_name;


    const update_draft = async() => {
    
        try{    
            let data = await AsyncStorage.getItem("drafts");
            const arr = JSON.parse(data)
            console.log(arr)
            const index = arr.map(object => object.text).indexOf(text);
            arr[index].text = newtext;
            console.log(arr)
            await AsyncStorage.setItem("drafts", JSON.stringify(arr));
            
            navigation.goBack()
                
          //var auth = JSON.parse(data)
                              
        }catch(err){
          console.log(err)
        }
    }  
    
  
    return (
      <View>

          <View style={styles.post}>
                <View style={styles.post1}>

                    <View style={styles.image}>            
                    </View>

                    <View style={styles.info}>
                        <Text style={styles.text}>
                          {first_name} {last_name}
                        </Text>
                                                
                    </View>

                </View>
                
                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    width: '100%',
                    paddingTop: 10,
                }}/>
                
                <View style={styles.post2}>
                
                    <Text style={styles.text}>
                        Previous text: 
                    </Text>                    
                    <Text>
                        {text}
                    </Text>

                
                
                </View>                    

                <View style={styles.post3}>

                <TextInput
                        style={styles.input}
                        onChangeText={(textt) => setNewtext(textt)}
                        //value={text}
                        placeholder="Enter New Text"
                        keyboardType='default'
                    />
    
                    </View>
                </View>
         
          
          <View>

          <Pressable style={styles.button} onPress={() => update_draft() }>
            <Text style={styles.pressText}>Update</Text>
          </Pressable>

          <Pressable style={styles.button}  onPress={() => navigation.goBack()}>
            <Text style={styles.pressText}>Cancel</Text>
          </Pressable>

          </View>
      </View> 
    )};

export default EditDraft;