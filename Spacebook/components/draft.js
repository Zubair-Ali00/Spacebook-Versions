import React, { useState, useEffect } from 'react'
import { Text, View, Pressable, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
  post: {
    width: 280,
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

function SpDraft (props) {
  const navigation = useNavigation()
  const [det, setDet] = useState([])
  const [auth, setAuth] = useState([])

  const abortController = new AbortController()

  const delete_draft = async () => {
    try {
      const data = await AsyncStorage.getItem('drafts')
      let arr = JSON.parse(data)
      arr = arr.filter(draft => draft.text !== props.text)
      await AsyncStorage.setItem('drafts', JSON.stringify(arr))
    } catch (err) {
      console.log(err)
    }
  }

  const add_post = () => {
    const xhttp = fetch('http://localhost:3333/api/1.0.0/user/' + props.id + '/post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': auth.token
      },
      body: JSON.stringify({
        text: props.text
      })
    })
      .then((response) => response.text())
      .then((text) => {
        delete_draft()
      })
      .catch(function (res) {
        console.log(res)
      })
  }

  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const auth = JSON.parse(data)
        setAuth(auth)
      } catch (err) {
        console.log(err)
      }
    }

    getAuth()

    return function cleanup () {
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    const details = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/user/' + props.id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': props.token
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
  }, [])

  return (
  // add function to get total posts from props.username

    <View style={styles.post}>
      <View style={styles.post1}>

        <View style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.text}>
            {det.first_name} {det.last_name}
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

      </View>

      <View style={styles.post3}>

        <Pressable
          style={[styles.button, { borderBottomEndRadius: 0, borderBottomStartRadius: 20 }]} onPress={() => navigation.navigate('GetPost', {
            first_name: det.first_name,
            last_name: det.last_name,
            post: props.text,
            token: props.token,
            action: 'draft'
          })}
        >
          <Text>Edit</Text>
        </Pressable>
        <Pressable style={[styles.button, { borderBottomEndRadius: 0, borderBottomStartRadius: 0 }]} onPress={() => add_post()}>
          <Text>Post</Text>
        </Pressable>

        <Pressable style={[styles.button, { borderBottomEndRadius: 20, borderBottomStartRadius: 0 }]} onPress={() => delete_draft()}>
          <Text>Delete</Text>
        </Pressable>

      </View>
    </View>
  )
}
export default SpDraft
