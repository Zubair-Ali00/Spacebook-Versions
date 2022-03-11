import React, { useEffect, useState } from 'react'
import { Text, TextInput, View, StyleSheet, Pressable } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { getCurrentTimestamp } from 'react-native/Libraries/Utilities/createPerformanceLogger'

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
    // boxSizing: 'border-box',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: '10%',
    alignSelf: 'center'
  },
  input: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginBottom: '10%',
    paddingLeft: 30
  }
})

function EditPost (props) {
  const navigation = useNavigation()

  // container for previous post details
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

  // new text input
  const [text, setText] = useState('')

  const route = useRoute()

  // get user and post details from params
  const id = route.params.user
  const postt = route.params.post

  useEffect(() => {
    const abortController = new AbortController()
    // get previous post details
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post/' + postt, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': props.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          setPost(text)
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

  // upload new post text and timestamp
  const update_post = () => {
    const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post/' + postt, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': props.token
      },
      body: JSON.stringify({
        post_id: post,
        text: text,
        timestamp: getCurrentTimestamp(),
        author: {
          user_id: post.author.user_id,
          first_name: post.author.first_name,
          last_name: post.author.last_name,
          email: post.author.email
        },
        numLikes: post.numLikes
      })
    })
      .then((response) => response.text())
      .then((text) => {
        // go back to main page or friends pages
        navigation.goBack()
      })
      .catch(function (res) {
        console.log(res)
      })
  }

  return (
    <View>

      <View style={styles.post}>
        <View style={styles.post1}>

          <View style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.text}>
              {props.first_name} {props.last_name}
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
            Previous text:
          </Text>
          <Text>
            {props.text}
          </Text>

        </View>

        <View style={styles.post3}>

          <TextInput
            style={styles.input}
            onChangeText={(text) => setText(text)}
                        // value={text}
            placeholder='Enter New Text'
            keyboardType='default'
          />

        </View>
      </View>

      <View>

        <Pressable style={styles.button} onPress={() => update_post()}>
          <Text style={styles.pressText}>Update</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.pressText}>Cancel</Text>
        </Pressable>

      </View>
    </View>
  )
};

export default EditPost
