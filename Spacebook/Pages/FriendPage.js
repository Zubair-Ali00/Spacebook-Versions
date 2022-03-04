import React, { useEffect, useState } from 'react'
import { Text, View, Pressable, ScrollView, StyleSheet } from 'react-native'

import { useRoute } from '@react-navigation/native'

import SpHeader from '../components/header'
import SpPost from '../components/post'

import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
  center: {
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  scroll: {
    paddingBottom: '2%',
    paddingLeft: 30,
    paddingRight: 30,
    width: '100%'
  },
  top: {
    flexDirection: 'row',
    top: 10,
    backgroundColor: '#C3E6FF',
    borderRadius: 20,
    width: '40%',
    height: 30
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  posts: {
    backgroundColor: 'white',
    width: '100%',
    top: 20,
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingBottom: 60
  }
})

function FriendPage ({ navigation }) {
  // user to get param values and unsubscribe from useEffect
  const route = useRoute()
  const abortController = new AbortController()

  // get id of friend
  const id = route.params.id

  // values used to refresh the page
  const [loadingT, setLoadingT] = useState(true)
  const [ref, setRef] = useState(true)
  const [loading, setLoading] = useState(true)

  const [auth, setAuth] = useState([])
  const [det, setDet] = useState([])
  const [posts, setPosts] = useState([])

  // get auth info from local storage
  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const auth = JSON.parse(data)

        setAuth(auth)

        if (Number.isInteger(auth.id)) {
          setLoadingT(false)
        }
      } catch (err) {
        console.log(err)
      }
    }

    getAuth()

    return function cleanup () {
      abortController.abort()
    }
  }, [])

  // get friend's details
  useEffect(() => {
    const details = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          if (loading) {
            setDet(text)
          } else {
            console.log('fetched')
          }
        })
        .catch(function (res) {
          console.log(res)
        })
    }

    details()

    return function cleanup () {
      abortController.abort()
    }
  }, [det, loadingT])

  // get all the posts under the friend user profile
  useEffect(() => {
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          setPosts(text)
          setLoading(false)
          // console.log("fetching")
        })
        .catch(function (res) {
          console.log(res)
        })
    }

    page()

    return function cleanup () {
      abortController.abort()
    }
  }, [det, ref])

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener('focus', async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          setPosts(text)
        })
        .catch(function (res) {
          console.log(res)
        })
    })

    return () => {
      // only refetch posts when the page reloads or refreshes
      unsubscribe()
      abortController.abort()
    }
  }, [navigation, det])

  // used to convers raw image data from server to base64
  const fileReaderInstance = new FileReader()
  // default loading image
  const [img, setImg] = useState('https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg')

  // fetch image from server, convert is to base64 and store the value in img variable
  useEffect(() => {
    const loadImage = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.blob())
        .then((text) => {
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
  }, [det, navigation, ref])

  // if page is still loading, display loading screen
  if (loading) {
    return (
      <View>
        <Text>
          Loading..
        </Text>
      </View>
    )
  };

  return (

    <View style={styles.center}>
      <SpHeader
        first_name={det.first_name}
        last_name={det.last_name}
        img={img}
      />

      <View style={styles.top}>

        <Pressable
          style={styles.button} onPress={() => navigation.navigate('GetPost', {
            user: id,
            action: 'add',
            post: 0,
            token: auth.token
          })}
        >
          <Text style={[styles.pressText, { color: '#689be8' }]}>Add Post</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => {
            if (ref === true) {
              setRef(false)
            } else {
              setRef(true)
            }
          }}
        >
          <Text style={[styles.pressText, { color: '#e86868' }]}>Refresh</Text>
        </Pressable>

      </View>

      <View style={styles.posts}>

        <ScrollView contentContainerStyle={styles.scroll}>
          {posts.map((post) => (
            <SpPost
            // iterate thorugh posts and display each
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

  )
}

export default FriendPage
