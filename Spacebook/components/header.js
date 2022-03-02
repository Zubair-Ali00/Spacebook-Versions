import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

const styles = StyleSheet.create({
  center: {
    alignItems: 'center'

  },
  image: {
    resizeMode: 'cover',
    alignItems: 'center',
    top: '20%',
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40
  },
  text: {
    marginTop: '30%',
    fontWeight: 'bold',
    bottom: '20%'
  }
})

function SpHeader (props) {
  return (
    <View style={styles.center}>
      <Image source={props.img} style={styles.image} />

      <Text style={styles.text}>
        {props.first_name} {props.last_name}
      </Text>

    </View>
  )
}

export default SpHeader
