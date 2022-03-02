import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Pressable, Alert, Image } from 'react-native'

const styles = StyleSheet.create({

  image: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 40,
    alignSelf: 'flex-start'
  },
  text: {
    fontWeight: 'bold',
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text2: {
    fontWeight: 'bold'
  },
  post: {
    width: '100%',
    backgroundColor: '#C0E2FB',
    padding: 5,
    borderRadius: 20,
    top: 20,
    marginBottom: 20,
    elevation: 20,
    shadowColor: '#52006A',
    flexDirection: 'row'
  },
  button: {
    backgroundColor: '#F1B59D',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 10
  }
})

function request_user (id, token) {
  const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + id + '/friends', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
    .then((response) => response.text())
    .then((text) => {
      if (text !== 'OK') {
        Alert.alert(
          'Request',
          text, [{ text: 'OK' }]
        )
      }
    })
    .catch(function (res) {
      console.log(res)
    })
}

const SpRequest = (props) => {
  const fileReaderInstance = new FileReader()
  const [img, setImg] = useState('https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg')

  useEffect(() => {
    const loadImage = async () => {
      // console.log(auth)
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + props.user_id + '/photo', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': props.token
        }
      })
        .then((response) => response.blob())
        .then((text) => {
          // console.log(text)
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
  }, [])

  return (
  // add function to get total posts from props.username
    <View style={[styles.post]} key={props.user_id}>
      <Image source={img} style={styles.image} />
      <View style={styles.text}>
        <Text style={styles.text2}>{props.user_givenname} {props.user_familyname}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => request_user(props.user_id, props.token)}>
        <Text style={[styles.pressText, { color: '#e86868' }]}>Request</Text>
      </Pressable>

    </View>
  )
}

export default SpRequest
