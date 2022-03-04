import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, Pressable, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

// get Header and Draft components
import SpHeader from '../components/header'
import SpDraft from '../components/draft'

// import local storage module
import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
  center: {
    backgroundColor: 'rgba(39, 154, 241, 0.98)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  scroll: {
    paddingBottom: '2%',
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
    width: '50%',
    height: 30,
    top: '2%'
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
  },
  button2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function Drafts ({ route }) {
  // default values for the auth object, the drafts and the user details
  const [auth, setAuth] = useState([])
  const [drafts, setDrafts] = useState([])
  const [det, setDet] = useState([])

  // used to refresh the page
  const [ref, setRef] = useState(true)

  const navigation = useNavigation()

  // used to unsubscribe from useEffect
  const abortController = new AbortController()

  // get image uri from MainPage instead of refetching
  const img = route.params.img

  // get auth object from local storage
  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await AsyncStorage.getItem('userAuth')
        const auth = JSON.parse(data)
        setAuth(auth)

        const data2 = await AsyncStorage.getItem('drafts')
        const draftss = JSON.parse(data2)

        // if there are no drafts, set the object to empty
        if (data2 != null) {
          setDrafts(draftss)
        } else {
          setDrafts([])
        }
      } catch (err) {
        console.log(err)
      }
    }

    getAuth()

    return function cleanup () {
      abortController.abort()
    }
  }, [ref])

  // fetch user details
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
  }, [auth])

  // get drafts from local storage each time the page reloads
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const data2 = await AsyncStorage.getItem('drafts')
      const draftss = JSON.parse(data2)

      // if there are no drafts, set the object to empty
      if (data2 != null) {
        setDrafts(draftss)
      } else {
        setDrafts([])
      }
    })

    return () => {
      unsubscribe()
      abortController.abort()
    }
  }, [navigation, det, ref])

  // show the no drafts screen if there are no drafts
  if (drafts.length <= 0) {
    return (

      <View style={styles.center}>
        <SpHeader
          first_name={det.first_name}
          last_name={det.last_name}
          img={img}
        />

        <View style={styles.top}>

          <Pressable style={[styles.button2, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.pressText, { color: '#e86868', justifyContent: 'center' }]}>Home</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => {
              if (ref === true) {
                setRef(false)
              } else {
                setRef(true)
              }
            }}
          >
            <Text style={[styles.pressText, { color: '#e86868' }]}>Refresh</Text>
          </Pressable>

        </View>

        <View style={styles.posts}>

          <Text> You have no drafts </Text>

        </View>

      </View>

    )
  };

  return (

    <View style={styles.center}>
      <SpHeader
        first_name={det.first_name}
        last_name={det.last_name}
      />

      <View style={styles.top}>

        <Pressable style={[styles.button2, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.pressText, { color: '#e86868', justifyContent: 'center' }]}>Home</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { marginLeft: 3, paddingLeft: 3 }]} onPress={() => {
            if (ref === true) {
              setRef(false)
            } else {
              setRef(true)
            }
          }}
        >
          <Text style={[styles.pressText, { color: '#e86868' }]}>Refresh</Text>
        </Pressable>
      </View>

      <View style={styles.posts}>

        <ScrollView contentContainerStyle={styles.scroll}>
          {drafts.map((draft) => (
            <SpDraft
            // iterate through drafts object and display the details of each
              key={draft.user_id}
              id={draft.user_id}
              token={auth.token}
              text={draft.text}
            />
          ))}
        </ScrollView>

      </View>

    </View>

  )
}

export default Drafts
