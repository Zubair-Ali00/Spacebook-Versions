// importing the necessary modules
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, Pressable } from 'react-native'

// route used to get params and refresh page
import { useRoute } from '@react-navigation/native'

// get friend request component
import SpFriendrq from '../components/friendrq'

// used for local storage
import AsyncStorage from '@react-native-async-storage/async-storage'
// b instantiating the CSS object

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
  // an array for all the requests
  const [requests, setRequests] = useState([])

  // cancels subscriptions to useEffect
  const abortController = new AbortController()

  const route = useRoute()

  // determine whether all the page content is fully loaded
  const [loadingT, setLoadingT] = useState(true)

  // holds the user credentials
  const [auth, setAuth] = useState([])

  // get user credentials from local storage
  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const auth = JSON.parse(data)

        // set authentication details
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

  // fetch all the requests for the current user

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
        })
        .catch(function (res) {
        })
    }

    page()

    return function cleanup () {
      abortController.abort()
    }

  // data is refreshed if requests object changes, if loading isnt done or if the page refreshes
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
