import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Pressable, Image } from 'react-native'

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
    width: 300,
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
    backgroundColor: '#9df1e6',
    borderTopStartRadius: 20,
    borderBottomLeftRadius: 20,
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 10
  },
  button2: {
    backgroundColor: '#F1B59D',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 10
  }
})

const SpFriendrq = (props) => {
  const accept = (id) => {
    const xhttp = fetch('http://localhost:3333/api/1.0.0/friendrequests/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': props.token
      }
    })
      .then((response) => response.json())
      .then((text) => {
      })
      .catch(function (res) {
        // console.log(res)
      })
  }

  const delete_rq = (id) => {
    const xhttp = fetch('http://localhost:3333/api/1.0.0/friendrequests/' + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': props.token
      }
    })
      .then((response) => response.text())
      .then((text) => {
        // console.log(text)
      })
      .catch(function (res) {
        // console.log(res)
      })
  }

  const fileReaderInstance = new FileReader()
  const abortController = new AbortController()

  const [img, setImg] = useState('https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg')

  useEffect(() => {
    const loadImage = async () => {
      // console.log(auth)
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + props.id + '/photo', {
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

    return function cleanup () {
      abortController.abort()
    }
  }, [])

  return (
  // add function to get total posts from props.username
    <View style={[styles.post]} key={props.user_id}>
      <Image source={img} style={styles.image} />
      <View style={styles.text}>
        <Text style={styles.text2}> {props.first_name} {props.last_name}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => accept(props.id)}>
        <Text style={[styles.pressText, { color: 'black' }]}>Accept</Text>
      </Pressable>

      <Pressable style={styles.button2} onPress={() => delete_rq(props.id)}>
        <Text style={[styles.pressText, { color: 'black' }]}>Decline</Text>
      </Pressable>

    </View>
  )
}

export default SpFriendrq
