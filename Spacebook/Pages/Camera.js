import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Pressable, Image } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera } from 'expo-camera'

const styles = StyleSheet.create({
  container: {
    height: '80%',
    width: '100%',
    marginTop: 50,
    borderRadius: 10
  },
  camera: {
    height: '70%',
    width: '100%'
  },
  center: {
    alignItems: 'center',
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    height: '100%'
  },
  button: {
    backgroundColor: 'white',
    borderColor: 'black',
    width: 70,
    height: 70,
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  },
  button1: {
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
  top: {
    flexDirection: 'row',
    backgroundColor: '#F1D0C5',
    borderRadius: 20,
    width: '30%',
    height: '5%',
    justifyContent: 'center',
    top: '5%'
  },
  button2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirm: {
    flexDirection: 'row'
  }
})

// change image if the user presses confirm
function changeImage (id, token, image) {
  const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
    method: 'POST',
    headers: {
      'X-Authorization': token
    },
    body: image
  })
    .then((response) => response.text())
    .then((text) => {
      console.log(text)
    })
    .catch(function (res) {
      console.log(res)
    })
}

function CameraPage ({ navigation }) {
  // used to unsubscribe form useEffect
  const abortController = new AbortController()

  // used to convert raw image received from server to base64
  const fileReaderInstance = new FileReader()

  // set auth details
  const [auth, setAuth] = useState([])
  const [authed, setAuthed] = useState(false)

  // get auth info from local storage
  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const auth = JSON.parse(data)
        setAuth(auth)
        setAuthed(true)
      } catch (err) {
        console.log(err)
      }
    }

    getAuth()

    return function cleanup () {
      abortController.abort()
    }
  }, [])

  // set camera properties
  const [hasPermission, setHasPermission] = useState(false)
  const [type, setType] = useState(Camera.Constants.Type.front)
  setType(Camera.Constants.Type.front)
  const [camera, setCamera] = useState()

  // set the default camera image if there is none
  const [photo, setPhoto] = useState({
    height: 4224,
    uri: 'https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg',
    width: 192
  })

  // set the default image property
  const [img, setImg] = useState(photo.uri)

  // request camera access
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status)
    })()
  }, [])

  // converrt base64 to blob for uploading to server
  const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || ''
    sliceSize = sliceSize || 512

    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: contentType })
    return blob
  }

  // function that takes a picture and updated the camera image
  const snapp = async () => {
    const photoo = await camera.takePictureAsync()
    setImg(photoo.uri)

    // convert photo data to blob for upload
    const block = photoo.uri.split(';')
    const contentType = block[0].split(':')[1]
    const data = block[1].split(',')[1]
    const blo = b64toBlob(data, contentType)
    setPhoto(blo)
  }

  // fetch the previous user's photo
  useEffect(() => {
    const loadImage = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + auth.id + '/photo', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.blob())
        .then((text) => {
          //converts image to base64
          console.log(text)
          fileReaderInstance.readAsDataURL(text)
          fileReaderInstance.onload = () => {
            const base64data = fileReaderInstance.result
            setImg(base64data)
          }
        })
        .catch(function (res) {
          console.log(res)
        })
    }

    loadImage()
  }, [authed])

  // show no access text if the user has not granted access
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  if (hasPermission) {
    return (
      <View style={styles.center}>

        <View style={styles.top}>

          <Pressable style={[styles.button2, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.navigate('MyPage')}>
            <Text style={[styles.pressText, { color: '#e86868', justifyContent: 'center' }]}>Cancel</Text>
          </Pressable>

        </View>

        <View style={styles.container}>
          <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)} />

          <Pressable style={styles.button} onPress={() => snapp()}>
            <Text />
          </Pressable>

          <View style={styles.confirm}>
            <Image
              style={{ width: 100, height: 100, marginTop: 20, marginLeft: 50, borderRadius: 50 }}
              source={{
                uri: img
              }}
            />

            <Pressable
              style={styles.button1} onPress={() => {
                changeImage(auth.id, auth.token, photo)
                navigation.navigate('MyPage')
              }}
            >
              <Text style={[styles.pressText, { color: '#e86868', justifyContent: 'center' }]}>Confirm</Text>
            </Pressable>

          </View>
        </View>

      </View>
    )
  }
}

export default CameraPage
