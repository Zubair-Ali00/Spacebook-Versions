import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'

import { useRoute } from '@react-navigation/native'

import { getCurrentTimestamp } from 'react-native/Libraries/Utilities/createPerformanceLogger'
import EditPost from '../components/editPost'
import AddPost from '../components/addPost'
import EditDraft from '../components/editDraft'

const styles = StyleSheet.create({
  post: {
    width: '90%',
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
    flexDirection: 'row'
  },
  button: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8DCACE',
    paddingHorizontal: '10%',
    alignSelf: 'center'
  },
  postUpdate: {
    margin: 10
  }
})

function GetPost ({ navigation }) {
  // default post info
  const [post, setPost] = useState({
    post_id: '',
    text: '',
    timestamp: getCurrentTimestamp(),
    author: {
      user_id: '',
      first_name: '',
      last_name: '',
      email: ''
    },
    numLikes: 0
  })

  // get params values
  const route = useRoute()

  // get post properties
  const id = route.params.user
  const postt = route.params.post
  const token = route.params.token

  // unsubscribes from useEffect
  const abortController = new AbortController()

  useEffect(() => {
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post/' + postt, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          setPost(text)
          // console.log(text)
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

  // if the navigation comes from the draft button
  if (route.params.action === 'draft') {
    return (
      <View style={styles.postUpdate}>
        <EditDraft
          first_name={route.params.first_name}
          last_name={route.params.last_name}
          text={route.params.post}
          token={route.params.token}

        />
      </View>
    )
  }

  // if the navigation comes from the edit post button
  if (route.params.action !== 'add') {
    return (
      <View style={styles.postUpdate}>
        <EditPost
          first_name={post.author.first_name}
          last_name={post.author.last_name}
          text={post.text}
          token={token}
        />
      </View>
    )
  //  if the navigation comes from the add post button
  } else {
    return (
      <View style={styles.postUpdate}>
        <AddPost
          first_name='My'
          last_name='Post'
          user={route.params.user}
          token={token}
        />
      </View>
    )
  }
}

export default GetPost
