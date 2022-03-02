import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Pressable, Image } from 'react-native'

import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
  post1: {
    flexDirection: 'row',
    alignSelf: 'baseline',
    marginLeft: 10
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 40,
    alignSelf: 'flex-start'
  },
  info: {
    marginLeft: 10
  },
  text: {
    fontWeight: 'bold'
  },
  button: {
    width: 260,
    backgroundColor: '#C0E2FB',
    padding: 5,
    borderRadius: 20,
    top: 20,
    marginBottom: 20,
    elevation: 20,
    shadowColor: '#52006A'
  }
})

const SpFriend = (props) => {
  const [posts, SetPosts] = useState([])

  const navigation = useNavigation()
  const abortController = new AbortController()

  let total = 0

  useEffect(() => {
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + props.user + '/post', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': props.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          SetPosts(text)
          setAuthed = true
        })
        .catch(function (res) {
          console.log(res)
        })
    }

    page()

    return function cleanup () {
      abortController.abort()
    }
  }, [])

  posts.map(() => {
    total = total + 1
  })

  const fileReaderInstance = new FileReader()
  const [img, setImg] = useState('https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg')
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      // console.log(auth)
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + props.user + '/photo', {
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
  }, [authed])

  return (
  // add function to get total posts from props.username
    <Pressable style={[styles.button, { borderBottomStartRadius: 20 }]} onPress={() => navigation.navigate('FriendPage', { id: props.user, token: props.token })}>
      <View style={styles.post1}>

        <Image source={img} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.text}>
            {props.first_name} {props.last_name}
          </Text>

          <Text>
            Posts: {total}
          </Text>
        </View>

      </View>
    </Pressable>
  )
}

export default SpFriend
