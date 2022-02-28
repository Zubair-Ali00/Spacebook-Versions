import React, { useEffect, useState } from 'react';
import { Text, View,ScrollView,Pressable, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import SpHeader from '../components/header'
import SpPost from '../components/post'

import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  center: {
    backgroundColor: 'rgba(39, 154, 241, 0.98)',    
    flexDirection: 'column',
    alignItems: 'center',
    //justifyContent: 'space-between'
  },
  scroll:{
    paddingBottom: "2%",
    width: '100%',
  },
  scroll1:{
    width: '70%',
    height: '100%'
  },
  top:{
    flexDirection: 'row',
    backgroundColor: '#C3E6FF',
    borderRadius: 20,
    width: '50%', 
    height: 30,
    top: '2%'
  },
  top2:{
    flexDirection: 'row',
    top: 5,
    backgroundColor: '#c3e1ff',
    borderRadius: 20,
    width: '50%', 
    height: 30,
  },
  button:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  posts:{
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    top: 20,
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius : 20,
    paddingBottom: '30%'
  },
  message:{
    backgroundColor: 'white',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '5%',
    borderRadius: 20
  }
})

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}


function MyPage({route}) {
  //const [info, setInfo] = useState({});
  const [posts,setPosts] = useState([]);  
  
  const [loading, setLoading] = useState(true);
  const [loadingT, setLoadingT] = useState(true);

  var r = true;
  const[ref, setRef] = useState(r);

  const [auth, setAuth] = useState([]);
  const [det, setDet] = useState([]);


  

  const navigation = useNavigation();

  //const route = useRoute();
  const abortController = new AbortController();  
  
  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener('focus', async() => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/'+auth.id+'/post', {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'X-Authorization': auth.token,
                    }
                  })
                  .then((response) => response.json())
                  .then((text) => {          
                      setPosts(text);                                                              
                  })
                  .catch(function (res){
                    console.log(res)
                  });
    });

    return () => {
      // Clear setInterval in case of screen unmount
      //clearTimeout(interval);
      // Unsubscribe for the focus Listener
      unsubscribe;
      abortController.abort()
    };
  }, [navigation,det]);
  
  
  //var id = route.params.text.id;
  //var token = route.params.text.token;

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
  },[]);
  
  useEffect(() => {
    
    const details = async () => {          
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/'+auth.id, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'X-Authorization': auth.token,
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
    
    const page = async () => {          
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/'+auth.id+'/post', {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'X-Authorization': auth.token,
                    }
                  })
                  .then((response) => response.json())
                  .then((text) => {          
                      setPosts(text);                                        
                      setLoading(false);
                  })
                  .catch(function (res){
                    console.log(res)
                  });
  }

  page();

  return function cleanup(){
    abortController.abort()
  }
}, [det, ref]);
  
  if(loading){
    return (
      <View>
        <Text>
          Loading..
        </Text>
      </View>
    );
  };

  if (auth.token == 0){
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}]
    })
  }

  return (    
    <View style={styles.center}>
        <SpHeader
          first_name={det.first_name}
          last_name={det.last_name}
        />
      

      <View style={styles.top}>

        <Pressable style={[styles.button, {marginLeft: 3, paddingLeft: 3} ]}  onPress={() => navigation.navigate('ViewFriends')}>
              <Text style={[styles.pressText, {color: '#e86868'}]}>View Friends</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => navigation.navigate('GetPost', {                            
                              user: auth.id,
                              action: "add",
                              post: 0,
                              token: auth.token
                          })}>
          <Text style={[styles.pressText, {color: '#689be8'}]}>Add Post</Text>
        </Pressable>
    
      </View>

      

      <View style={styles.posts}>

        <View style={styles.top2}>

          <Pressable style={[styles.button, {marginLeft: 3, paddingLeft: 3} ]}  onPress={() => {
            if (ref == true){
              setRef(false)
            }else{
              setRef(true)
            }
          }}>
                <Text style={[styles.pressText, {color: '#e86868'}]}>Refresh</Text>
          </Pressable>

          <Pressable style={[styles.button, {marginLeft: 3, paddingLeft: 3} ]}  onPress={() =>  {
            const auth = {
              id: 0,
              token: 0
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
              routes: [{name: 'Login'}]
            })
            }}>
                <Text style={[styles.pressText, {color: '#e86868'}]}>Logout</Text>
          </Pressable>

        </View>

        <View style={styles.scroll1}>
          <ScrollView contentContainerStyle={styles.scroll}>

            {posts.map((post) => (
            <SpPost
            key={post.post_id}
            post={post.post_id}
            user_id={auth.id}
            user={true}
            first_name={post.author.first_name}
            last_name={post.author.last_name}
            time={post.timestamp}
            text={post.text}
            likes={post.numLikes}
            author={post.author.user_id}
            token={auth.token}
            />
            ))}


            
            </ScrollView>
        </View>

      </View>
        
      


    </View>    
  );
}

export default MyPage;