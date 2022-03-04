import React, { useEffect, useState } from 'react'
import { Text, TextInput, View, StyleSheet, Pressable, ScrollView } from 'react-native'

// this is the component to display a users friends, and send friend requets
import SpFriend from '../components/Friends'

// import route to use params when the user navigates to this page
import { useRoute } from '@react-navigation/native'

// import async storage to get user auth
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
  // search and term change the results of the page
  const [search, setSearch] = useState([])
  const [term, setTerm] = useState('')

  // search text is the text input from the searchbar
  const [st, setSt] = useState('')

  // used to refresh the page when it is reloaded
  const route = useRoute()

  // cancels subscriptions to use Effect
  const abortController = new AbortController()

  // checks if page is still loading
  const [loadingT, setLoadingT] = useState(true)

  // sets the user auth object
  const [auth, setAuth] = useState([])

  // function to get user credentials
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

  // ensures that the query term is empty if the serch text is 0
  useEffect(() => {
    if (term.length <= 0) {
      setTerm('')
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
          // set Search object to reponse.json
          setSearch(text)
        })
        .catch(function (res) {
          console.log(res)
        })
    }

    page()

    return function cleanup () {
      abortController.abort()
    }
    // research friends if term changes, if loading is not finished and if the page refreshes
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
