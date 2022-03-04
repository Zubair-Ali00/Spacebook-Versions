import React, { useEffect, useState } from 'react'
import { Text, TextInput, View, StyleSheet, Pressable, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { getCurrentTimestamp } from 'react-native/Libraries/Utilities/createPerformanceLogger'

import AsyncStorage from '@react-native-async-storage/async-storage'

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
    flexDirection: 'row'
  },
  button: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8DCACE',
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

function AddNewPost (id, token, textt) {
  const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': token
    },
    body: JSON.stringify({
      text: textt
    })
  })
    .then((response) => response.text())
    .then((text) => {
    })
    .catch(function (res) {
      console.log(res)
    })
}

function AddPost (props) {
  const navigation = useNavigation()
  const abortController = new AbortController()

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
  const [text, setText] = useState('')

  const route = useRoute()

  const id = route.params.user
  const postt = route.params.post

  useEffect(() => {
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

  const AddNewDraft = async (id, textt) => {
    const NewDraft = {
      user_id: id,
      text: textt
    }

    try {
      const data = await AsyncStorage.getItem('drafts')

      if (data != null) {
        const arr = JSON.parse(data)
        arr.push(NewDraft)
        await AsyncStorage.setItem('drafts', JSON.stringify(arr))
      } else {
        const arr = [NewDraft]
        await AsyncStorage.setItem('drafts', JSON.stringify(arr))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fileReaderInstance = new FileReader()
  const [img, setImg] = useState('https://www.searchinfluence.com/wp-content/uploads/2015/10/buffering-youtube.jpg')

  useEffect(() => {
    const loadImage = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': props.token
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

    return function cleanup () {
      abortController.abort()
    }
  }, [])

  return (
    <View>

      <View style={styles.post}>
        <View style={styles.post1}>

          <Image source={img} style={styles.image} />

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
            Add New Post
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

        <Pressable
          style={styles.button} onPress={() => {
            AddNewPost(props.user, props.token, text)
            navigation.goBack()
          }}
        >
          <Text style={styles.pressText}>Add</Text>
        </Pressable>

        <Pressable
          style={styles.button} onPress={() => {
            AddNewDraft(props.user, text)
            navigation.goBack()
          }}
        >
          <Text style={styles.pressText}>Save</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.pressText}>Cancel</Text>
        </Pressable>

      </View>
    </View>
  )
};

export default AddPost
