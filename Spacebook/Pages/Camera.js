import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import {useRoute} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';


const styles = StyleSheet.create({
  container:{
    height: '80%',
    width: '100%',
    marginTop: 50,
    borderRadius: 10
  },
  camera:{
    height: '70%',
    width: '100%'
  },
  center: {
    alignItems: 'center',
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    height: '100%' 
  },
  button:{
    backgroundColor: 'white',
    borderColor: 'black', 
    width: 70, 
    height: 70,
    marginTop: 20,
    alignSelf: 'center', 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  button1:{
    backgroundColor: '#F1D0C5',
    borderColor: 'black', 
    width: 80, 
    height: 40,
    alignSelf: 'center', 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 20
  },
  top:{
    flexDirection: 'row',
    backgroundColor: '#F1D0C5',
    borderRadius: 20,
    width: '30%',
    height: '5%',
    justifyContent: 'center',
    top: '5%'
  },
  button2:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirm:{
    flexDirection: 'row'
  }
})


function changeImage(id, token, image){
  const xhttp = fetch('http://localhost:3333/api/1.0.0/user/'+id+'/photo', {
    method: 'POST',
    headers: {
      'X-Authorization': token,
    },
    body: image
  })
  .then((response) => response.text())
  .then((text) => {          
    console.log(text)                
  })
  .catch(function (res){
    console.log(res)
  });
}


function CameraPage({navigation}) {
  //route.params user id

  const abortController = new AbortController();
  const fileReaderInstance = new FileReader();
  const [auth, setAuth] = useState([]);
  const [authed, setAuthed] = useState(false);
  useEffect (() =>
  {
    const getAuth = async() =>{
      try{
        let data = await AsyncStorage.getItem("userAuth");
        var auth = JSON.parse(data)
        //console.log(JSON.parse(auth))
        //console.log(auth)
        setAuth(auth);
        setAuthed(true);
      }catch(err) {
        console.log(err)
      }
    }

    getAuth();

    return function cleanup(){
      abortController.abort()
    }
  },[]);

  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [camera, setCamera] = useState();

  const [photo, setPhoto] = useState({
    height: 4224,
    uri: 'https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg',
    width: 192,
  });

  const [img, setImg] = useState(photo.uri);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status);
    })();
  }, []);

  const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


  const snapp = async () => {
    let photoo = await camera.takePictureAsync();
    //console.log(photoo)
    //console.log(photoo);
    //setPhoto(photoo);
    setImg(photoo.uri);

    var block = photoo.uri.split(";");
    var contentType = block[0].split(":")[1]
    var data = block[1].split(",")[1]
    var blo = b64toBlob(data,contentType);
    setPhoto(blo)
  };


  useEffect(() => {
    const loadImage = async () => {
      //console.log(auth)
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/'+auth.id+'/photo', {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'X-Authorization': auth.token,
                    }
                  })
                  .then((response) => response.blob())
                  .then((text) => {
                    console.log(text)
                    fileReaderInstance.readAsDataURL(text); 
                    fileReaderInstance.onload = () => {
                        var base64data = fileReaderInstance.result;                                        
                        setImg(base64data);
                    }
                    

                  })
                  .catch(function (res){
                    console.log(res)
                  });
    }

    loadImage();
  },[authed]);

  if (hasPermission == false) {
    return <Text>No access to camera</Text>;
  }
  
  if (hasPermission) {
    return (
      <View style={styles.center}>


        <View style={styles.top}>

        <Pressable style={[styles.button2, {marginLeft: 3, paddingLeft: 3} ]}  onPress={() => navigation.navigate('MyPage')}>
              <Text style={[styles.pressText, {color: '#e86868', justifyContent: 'center'}]}>Cancel</Text>
        </Pressable>

        </View>


        <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}/>
  
        <Pressable style={styles.button} onPress={() => snapp()}>
              <Text></Text>
        </Pressable>
  
        <View style={styles.confirm}>
          <Image
            style={{ width: 100, height: 100, marginTop: 20 , marginLeft: 50, borderRadius: 50}}
            source={{
              uri: img,
            }}
          />

          <Pressable style={styles.button1} onPress={() => {
            changeImage(auth.id, auth.token, photo)
            navigation.navigate('MyPage')
            }}>
          <Text style={[styles.pressText, {color: '#e86868', justifyContent: 'center'}]}>Confirm</Text>
          </Pressable>

        </View>
      </View>
        


    </View>
    );
  }

  
}


export default CameraPage;