import React, { useEffect, useState } from 'react';
import { Text, TextInput, View,Button, StyleSheet, Pressable } from 'react-native';

import {useRoute} from '@react-navigation/native'

import SpHeader from '../components/header'
import SpPost from '../components/post'
import { getCurrentTimestamp } from 'react-native/Libraries/Utilities/createPerformanceLogger';
import { clickProps } from 'react-native-web/dist/cjs/modules/forwardedProps';
import EditPost from '../components/editPost';
import AddPost from '../components/addPost';

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
    paddingHorizontal: '10%',
    paddingHorizontal: '10%', 
    alignSelf: 'center'
  },
  postUpdate:{
    margin: 10
  }
})




function GetPost({navigation}) {
  //const [info, setInfo] = useState({});

  const [post,setPost] = useState({
    post_id: "",
    text: "",
    timestamp: getCurrentTimestamp(),
    author: {
        user_id: "",
        first_name: "",
        last_name: "",
        email: ""
    },
    numLikes: 0
  });
  const [text, setText] = useState("");


  const route = useRoute();

  //console.log("Params are" + route.params)
  var id = route.params.user;

  var postt = route.params.post;

  var token = route.params.token;
  //console.log(post)
  //token = route.params.token;

  //console.log("user is" + id + "post id" + postt)
  useEffect(() => {
    const abortController = new AbortController();
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post/'+postt, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'X-Authorization': token,
                    }
                  })
                  .then((response) => response.json())
                  .then((text) => {                    
                      setPost(text);                
                      //console.log(post)
                  })
                  .catch(function (res){
                    console.log(res)
                  });
      
    }

    page();

    

    return function cleanup(){
      abortController.abort()
    }
  }, [route]);



  

  if (route.params.action != "add"){
    return (
        <EditPost
          first_name={post.author.first_name}
          last_name={post.author.last_name}
          text={post.text}
          token={token}
        />
    );
  }else{
    return (
      <View style={styles.postUpdate}>
      <AddPost 
        first_name="My"
        last_name="Post"
        user={route.params.user}
        token={token}
      />    
      </View>  
    );
  }
}

export default GetPost;