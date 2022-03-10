import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, Pressable, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

// user header and posts component
import SpHeader from '../components/header'
import SpPost from '../components/post'

// local storage
import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
  center: {
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  scroll: {
    paddingBottom: 2,
    width: '100%'
  },
  scroll1: {
    width: '70%',
    height: '100%'
  },
  top: {
    flexDirection: 'row',
    backgroundColor: '#C3E6FF',
    borderRadius: 20,
    width: '80%',
    height: 40,
    top: 5
  },
  top2: {
    flexDirection: 'row',
    top: 5,
    backgroundColor: '#c3e1ff',
    borderRadius: 20,
    width: '50%',
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
    height: '100%',
    top: 20,
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingBottom: '30%'
  },
  message: {
    backgroundColor: 'white',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '5%',
    borderRadius: 20
  }
})

function MyPage ({ route }) {
  // object to store all the users posts
  const [posts, setPosts] = useState([])

  // determined if the page has fully loaded
  const [loading, setLoading] = useState(true)
  const [loadingT, setLoadingT] = useState(true)

  // used to refresh the page manually
  const r = true
  const [ref, setRef] = useState(r)

  // object to hold authentication details fo the user and their actual user info
  const [auth, setAuth] = useState([])
  const [det, setDet] = useState([])

  // to move between pages
  const navigation = useNavigation()

  // unsubscribe from useEffect
  const abortController = new AbortController()

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener('focus', async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + auth.id + '/post', {
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
      unsubscribe
      abortController.abort()
    }

    // if navigation changes, the data is refetched
  }, [navigation, det])

  // get user authentication details from local storage
  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const auth = JSON.parse(data)

        // set user credentials
        setAuth(auth)

        // checks if the promise is resolved
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

  // fetches user details form the server, after authentication details have been received
  useEffect(() => {
    const details = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + auth.id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          setDet(text)
        })
        .catch(function (res) {
          console.log(res)
        })
    }

    details()

    return function cleanup () {
      abortController.abort()
    }
  }, [loadingT])

  // fetch all the users posts after user details have fully loaded
  useEffect(() => {
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + auth.id + '/post', {
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

  // file reader instance is used to convert image data received into base64
  const fileReaderInstance = new FileReader()

  // default loading image
  const [img, setImg] = useState('https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg')

  // fetch the users Image

  useEffect(() => {
    const loadImage = async () => {
      // console.log(auth)
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
          // this converts the raw data received into base64
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

  // displays the loading screen if all data hasnt loaded yet
  if (loading) {
    return (
      <View>
        <Text>
          Loading..
        </Text>
        <Pressable
          style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => {
            const auth = {
              id: 0,
              token: 0
            }

            const save = async () => {
              try {
                await AsyncStorage.setItem('userAuth', JSON.stringify(auth))
              } catch (err) {
                console.log(err)
              }
            }

            save()
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            })
          }}
        >
          <Text style={[styles.pressText, { color: '#e86868' }]}>Logout</Text>
        </Pressable>
      </View>
    )
  };

  // returns to Login screen if auth object is lost
  if (auth.token == 0) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    })
  }

  return (
    <View style={styles.center}>
      <SpHeader
        first_name={det.first_name}
        last_name={det.last_name}
        img={img}
      />

      <View style={styles.top}>

        <Pressable style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.navigate('ViewFriends')}>
          <Text style={[styles.pressText, { color: '#e86868' }]}>Friends</Text>
        </Pressable>

        <Pressable style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.navigate('Drafts', { img: img })}>
          <Text style={[styles.pressText, { color: '#689be8' }]}>Drafts</Text>
        </Pressable>

        <Pressable
          style={styles.button} onPress={() => navigation.navigate('GetPost', {
            user: auth.id,
            action: 'add',
            post: 0,
            token: auth.token
          })}
        >
          <Text style={[styles.pressText, { color: '#689be8' }]}>Add Post</Text>
        </Pressable>

        <Pressable style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.navigate('CameraPage')}>
          <Text style={[styles.pressText, { color: '#e86868' }]}>Profile</Text>
        </Pressable>

      </View>

      <View style={styles.posts}>

        <View style={styles.top2}>

          <Pressable
            style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => {
              // refreshes the page by changing a value 'ref'
              if (ref == true) {
                setRef(false)
              } else {
                setRef(true)
              }
            }}
          >
            <Text style={[styles.pressText, { color: '#e86868' }]}>Refresh</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => {
              // reset auth object in local storage
              const auth = {
                id: 0,
                token: 0
              }
              const save = async () => {
                try {
                  await AsyncStorage.setItem('userAuth', JSON.stringify(auth))
                } catch (err) {
                  console.log(err)
                }
              }

              save()

              // goes back to Login screen and refreshes the whole Navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
              })
            }}
          >
            <Text style={[styles.pressText, { color: '#e86868' }]}>Logout</Text>
          </Pressable>

        </View>

        <View style={styles.scroll1}>
          <ScrollView contentContainerStyle={styles.scroll}>

            {posts.map((post) => (
            // iterates through the posts object to display all the users posts
              <SpPost
                key={post.post_id}
                post={post.post_id}
                user_id={auth.id}
                user
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
  )
}

export default MyPage
