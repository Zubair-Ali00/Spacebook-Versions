import React, { useEffect, useState } from 'react'
import { Text, TextInput, View, StyleSheet, Pressable, ScrollView } from 'react-native'

import SpFriend from '../components/Friends'

import { useRoute } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    height: '100%'
  },
  friends: {
    paddingBottom: 2,
    width: '100%'
  },
  scroll: {
    width: '70%',
    height: '100%'
  },
  searchbar: {
    elevation: 20,
    shadowColor: '#52006A',
    borderRadius: 20,
    flexDirection: 'row',
    width: '70%',
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

function ViewFriends ({ navigation }) {
  const [search, setSearch] = useState([])
  const [term, setTerm] = useState('')

  const [st, setSt] = useState('')

  const route = useRoute()

  const abortController = new AbortController()

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
    if (term.length <= 0) {
      term === ''
    }

    const page = async () => {
      const xhttp = await fetch('http://localhost:3333/api/1.0.0/search?q=' + term + '&search_in=friends', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': auth.token
        }
      })
        .then((response) => response.json())
        .then((text) => {
          setSearch(text)
        })
        .catch(function (res) {
          // console.log(res)
        })
    }

    page()

    return function cleanup () {
      abortController.abort()
    }
  }, [term, loadingT, route])

  return (

    <View style={styles.center}>

      <View style={styles.top}>

        <Pressable style={[styles.button2, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.pressText, { color: '#e86868', justifyContent: 'center' }]}>Home</Text>
        </Pressable>

      </View>

      <View style={styles.searchbar}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setSt(text)}
              // value={number}
          placeholder='name..'
          keyboardType='default'
        />

        <Pressable style={styles.button} onPress={() => setTerm(st)}>
          <Text style={styles.pressText}>Search</Text>
        </Pressable>

      </View>

      <View style={styles.scroll}>
        <ScrollView contentContainerStyle={styles.friends}>
          {search.map((user) => (
            <SpFriend
              key={user.user_id}
              user={user.user_id}
              first_name={user.user_familyname}
              last_name={user.user_givenname}
              token={auth.token}
            />
          ))}
        </ScrollView>
      </View>

    </View>
  )
}

export default ViewFriends
