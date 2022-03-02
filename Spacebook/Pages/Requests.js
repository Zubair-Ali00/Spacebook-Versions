import React, { useEffect, useState } from 'react'
import { Text, TextInput, View, StyleSheet, ScrollView, Pressable } from 'react-native'

import { useRoute } from '@react-navigation/native'

import SpFriendrq from '../components/friendrq'

import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    height: '100%'
  },
  scroll: {
    paddingBottom: 2,
    width: '100%'
  },
  scroll1: {
    width: '100%',
    height: '100%',
    marginTop: 20,
    alignItems: 'center'
  },
  users: {
    top: 50
  },
  searchbar: {
    elevation: 20,
    shadowColor: '#52006A',
    borderRadius: 20,
    flexDirection: 'row',
    width: 200,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: '10%',
    height: '7%'
  },
  input: {
    flex: 5,
    paddingLeft: 20
  },
  button: {
    flex: 3,
    backgroundColor: '#F1D0C5',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20
  },
  top: {
    flexDirection: 'row',
    backgroundColor: '#F1D0C5',
    borderRadius: 20,
    width: '30%',
    height: '5%',
    justifyContent: 'center',
    top: '5%'
  },
  button2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const ViewFriends = ({ navigation }) => {
  const [requests, setRequests] = useState([])

  const abortController = new AbortController()

  const route = useRoute()

  const [loadingT, setLoadingT] = useState(true)
  const [auth, setAuth] = useState([])
  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const auth = JSON.parse(data)
        // console.log(JSON.parse(auth))
        // console.log(auth.id)

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

  useEffect(() => {
    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/friendrequests/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          setRequests(text)
          // console.log(requests)
        })
        .catch(function (res) {
          // console.log(res)
        })
    }

    page()

    return function cleanup () {
      abortController.abort()
    }
  }, [requests, loadingT, route])

  return (

    <View style={styles.center}>

      <View style={styles.top}>

        <Pressable style={[styles.button2, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.navigate('MyPage')}>
          <Text style={[styles.pressText, { color: '#e86868', justifyContent: 'center' }]}>Home</Text>
        </Pressable>

      </View>

      <View style={styles.scroll1}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {requests.map((rq) => (
            <SpFriendrq
              style={[styles.users]} key={rq.user_id}
              first_name={rq.first_name}
              last_name={rq.last_name}
              email={rq.email}
              id={rq.user_id}
              token={auth.token}
            />
          ))}
        </ScrollView>

      </View>

    </View>
  )
}

export default ViewFriends
