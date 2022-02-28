import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  center: { 
    alignItems: 'center',

  }, 
  image:{
    top: '20%',
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  text:{
    marginTop: '30%',
    fontWeight: 'bold',
    botton: '20%'
  }
})

function SpHeader(props) {
  return (
     <View style={styles.center}>
         <View style={styles.image}>            
         </View>

         <Text style={styles.text}>
             {props.first_name} {props.last_name}
         </Text>

     </View>
  );
}


export default SpHeader;