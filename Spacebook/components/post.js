import React, { useEffect, useState } from 'react'
import { Text, View, Pressable, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
  post: {
    width: '100%',
    backgroundColor: '#C0E2FB',
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
    top: 20,
    marginBottom: 20,
    elevation: 20,
    shadowColor: '#52006A'
  },
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
  post2: {
    alignSelf: 'baseline',
    marginLeft: 20,
    flexDirection: 'column',
    marginBottom: 15,
    marginTop: 15
  },
  post3: {
    flexDirection: 'row',
    width: '100%'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#A6C3D9'

  }
})

// add new like to a post
function like (author, post, token) {
  const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + author + '/post/' + post + '/like', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
    .then((response) => response.text())
    .then((text) => {
      console.log(text)
    })
    .catch(function (res) {
      console.log(res)
    })
}

// remove one like from a post
function dislike (author, post, token) {
  const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + author + '/post/' + post + '/like', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
    .then((response) => response.text())
    .then((text) => {
    })
    .catch(function (res) {
      console.log(res)
    })
}

// delete post if the user is also the author
function delete_post (user, post, token) {
  const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + user + '/post/' + post, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': token
    }
  })
    .then((response) => response.text())
    .then((text) => {
    })
    .catch(function (res) {
      console.log(res)
    })
}

function spPost (props) {
  const navigation = useNavigation()

  // unsubscribe form useEffect, file reader for raw to base 64 conversion
  const abortController = new AbortController()
  const fileReaderInstance = new FileReader()

  // default loading image
  const [img, setImg] = useState('https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg')

  useEffect(() => {
    const loadImage = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + props.author + '/photo', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': props.token
        }
      })
        .then((response) => response.blob())
        .then((text) => {
          // convert raw profile photo data to base 64
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

  // check if the posts is from the users page, if it is, only display delete , edit go to page buttons
  if (props.user === false) {
    // check  who the author of the post is, if its the user, display delete and edit buttons
    // if the post is not the user's, display like and dislike buttons
    if (props.author === props.user_id) {
      var _like = false
    } else {
      var _like = true
    }

    if (_like === true) {
      return (

        <View style={styles.post}>
          <View style={styles.post1}>

            <Image source={img} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.text}>
                {props.first_name} {props.last_name} {props.author}
              </Text>

              <Text>
                {props.time}
              </Text>

            </View>

          </View>

          <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '100%',
            paddingTop: 10
          }}
          />

          <View style={styles.post2}>

            <Text style={styles.text}>
              "{props.text}"
            </Text>

            <Text>
              Likes : {props.likes}
            </Text>

          </View>

          <View style={styles.post3}>

            <Pressable
              style={[styles.button, { borderBottomStartRadius: 20 }]} onPress={() => {
                like(props.friend, props.post, props.token)
              }}
            >
              <Text>Like</Text>
            </Pressable>

            <Pressable style={[styles.button, { borderBottomRightRadius: 20 }]} onPress={() => dislike(props.friend, props.post, props.token)}>
              <Text>Dislike</Text>
            </Pressable>

          </View>
        </View>
      )
    } else {
      return (

        <View style={styles.post}>
          <View style={styles.post1}>

            <Image source={img} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.text}>
                {props.first_name} {props.last_name} {props.author}
              </Text>

              <Text>
                {props.time}
              </Text>

            </View>

          </View>

          <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '100%',
            paddingTop: 10
          }}
          />

          <View style={styles.post2}>

            <Text style={styles.text}>
              "{props.text}"
            </Text>

            <Text>
              Likes : {props.likes}
            </Text>

          </View>

          <View style={styles.post3}>

            <Pressable
              style={[styles.button, { borderBottomEndRadius: 0, borderBottomStartRadius: 20 }]} onPress={() => navigation.navigate('GetPost', {
                post: props.post,
                user: props.friend,
                token: props.token
              })}
            >
              <Text>Edit</Text>
            </Pressable>

            <Pressable style={[styles.button, { borderBottomEndRadius: 20, borderBottomStartRadius: 0 }]} onPress={() => delete_post(props.friend, props.post, props.token)}>
              <Text>Delete</Text>
            </Pressable>

          </View>
        </View>
      )
    }
  } else {
    if (props.author === props.user_id) {
      return (

        <View style={styles.post}>
          <View style={styles.post1}>

            <Image source={img} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.text}>
                {props.first_name} {props.last_name} {props.author}
              </Text>

              <Text>
                {props.time}
              </Text>

            </View>

          </View>

          <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '100%',
            paddingTop: 10
          }}
          />

          <View style={styles.post2}>

            <Text style={styles.text}>
              "{props.text}"
            </Text>

            <Text>
              Likes : {props.likes}
            </Text>

          </View>

          <View style={styles.post3}>

            <Pressable
              style={[styles.button, { borderBottomEndRadius: 0, borderBottomStartRadius: 20 }]} onPress={() => navigation.navigate('GetPost', {
                post: props.post,
                user: props.user_id,
                token: props.token
              })}
            >
              <Text>Edit</Text>
            </Pressable>
            <Pressable style={[styles.button, { borderBottomEndRadius: 20, borderBottomStartRadius: 0 }]} onPress={() => delete_post(props.author, props.post, props.token)}>
              <Text>Delete</Text>
            </Pressable>

          </View>
        </View>
      )
    } else {
      return (

        <View style={styles.post}>
          <View style={styles.post1}>

            <Image source={img} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.text}>
                {props.first_name} {props.last_name} {props.author}
              </Text>

              <Text>
                {props.time}
              </Text>

            </View>

          </View>

          <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            width: '100%',
            paddingTop: 10
          }}
          />

          <View style={styles.post2}>

            <Text style={styles.text}>
              "{props.text}"
            </Text>

            <Text>
              Likes : {props.likes}
            </Text>

          </View>

          <View style={styles.post3}>

            <Pressable style={[styles.button, { borderBottomStartRadius: 20 }]} onPress={() => navigation.navigate('FriendPage', { id: props.author })}>
              <Text>Go to Page</Text>
            </Pressable>

            <Pressable style={[styles.button, { borderBottomEndRadius: 20, borderBottomStartRadius: 0 }]} onPress={() => delete_post(props.author, props.post, props.token)}>
              <Text>Delete</Text>
            </Pressable>

          </View>
        </View>
      )
    }
  }
}

export default spPost
