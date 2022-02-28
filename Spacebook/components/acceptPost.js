import React from 'react';
import { Text, View, StyleSheet } from 'react-native';



const styles = StyleSheet.create({
  center: {
    alignItems: 'center'
  }
})


const spAcceptPost = (props) => {
    return (
        //make background red instead
        //different onclick function
        //add function to get total posts from props.username

        <View>
            <View>

                <View>

                

                </View>

                <View>
                    <Text>
                        {props.first} {props.second}
                    </Text>

                    <Text>
                        {props.totalPosts}
                    </Text>
                    
                </View>

            </View>
            
            <View>

                <Text>
                    {props.text}
                </Text>
                
            </View>
        </View>
    );
}


export default spAcceptPost;