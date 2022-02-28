import React, { useEffect, useState } from 'react';
import { Text, View,Pressable, ScrollView, StyleSheet } from 'react-native';

import {useRoute} from '@react-navigation/native';

import SpHeader from '../components/header';
import SpPost from '../components/post';

import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  center: {
    backgroundColor: 'rgba(39, 154, 241, 0.98)',    
    flexDirection: 'column',
    alignItems: 'center',
    //justifyContent: 'space-between'
  },
  scroll:{
    paddingBottom: "100%",
    paddingLeft: 30,
    paddingRight: 30,
    width: '100%'
  },
  top:{
    flexDirection: 'row',
    top: '13%',
    backgroundColor: '#C3E6FF',
    borderRadius: 20,
    width: '40%', 
    height: '5%',
  },
  button:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  posts:{
    backgroundColor: 'white',
    width: '100%',
    top: '8%',
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius : 20,
    paddingBottom: 60
  }
})




function FriendPage({navigation}) {
  //const [info, setInfo] = useState({});
  const [posts,setPosts] = useState([]);

  const route = useRoute();
  const abortController = new AbortController();

  var id = route.params.id;
  var token = route.params.token;

  const [loadingT, setLoadingT] = useState(true);
  const[ref, setRef] = useState(true);

  const [auth, setAuth] = useState([]);

  const [det, setDet] = useState([]);

  
  
  useEffect (() =>
  {
    const getAuth = async() =>{
      try{
        let data = await AsyncStorage.getItem("userAuth");
        var auth = JSON.parse(data)
        //console.log(JSON.parse(auth))
        //console.log(auth.id)

        setAuth(auth);

        if(Number.isInteger(auth.id)){
          setLoadingT(false);
        }
      }catch(err) {
        console.log(err)
      }
    }

    getAuth();

    return function cleanup(){
      abortController.abort()
    }
  });

  //console.log(id)
  //token = route.params.token;
  useEffect(() => {
    
    const details = async () => {          
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/'+id, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'X-Authorization': token,
                    }
                  })
                  .then((response) => response.json())
                  .then((text) => {          
                    setDet(text)
                  })
                  .catch(function (res){
                    console.log(res)
                  });
  }

  details();

  return function cleanup(){
    abortController.abort()
  }
  },[loadingT]);

  useEffect(() => {
    const abortController = new AbortController()
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/'+id+'/post', {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'X-Authorization': token,
                    }
                  })
                  .then((response) => response.json())
                  .then((text) => {
                    setPosts(text);                    
                      //console.log(posts)
                  })
                  .catch(function (res){
                    console.log(res)
                  });
      
    }

    page();

    return function cleanup() {
      abortController.abort()
    }
  }, [det , ref]);


  
  return (  
  
    <View style={styles.center}>
          <SpHeader
          first_name={det.first_name}
          last_name={det.last_name}
        />

        <View style={styles.top}>
          
          <Pressable style={styles.button} onPress={() => navigation.navigate('GetPost', {                            
                                user: id,
                                action: "add",
                                post: 0,
                                token: auth.token
                            })}>
            <Text style={[styles.pressText, {color: '#689be8'}]}>Add Post</Text>
          </Pressable>

          <Pressable style={[styles.button, {marginLeft: 3, paddingLeft: 3} ]}  onPress={() => {
            if (ref == true){
              setRef(false)
            }else{
              setRef(true)
            }
          }}>
                <Text style={[styles.pressText, {color: '#e86868'}]}>Refresh</Text>
          </Pressable>

        </View>

        <View style={styles.posts}>

        <ScrollView contentContainerStyle={styles.scroll}>
            {posts.map((post) => (          
                <SpPost 
                key={post.post_id}
                post={post.post_id}
                first_name={post.author.first_name}
                last_name={post.author.last_name}
                time={post.timestamp}
                text={post.text}
                likes={post.numLikes}
                author={post.author.user_id}                  
                user={false}     
                friend={id}  
                user_id={auth.id}   
                token={auth.token}        
                />
            ))}      
        </ScrollView>

        </View>

            



      </View>

  );
}

export default FriendPage;