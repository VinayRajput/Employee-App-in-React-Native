import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import {Card} from 'react-native-paper';

const  CardItem = ({props}) => {
  const {item, navigation} = props;
  const {name, position, picture} = item;
  return (<Card style={Styles.mycard}
    onPress={() => { navigation.navigate("Profile",{item}); }}
    >
    <View style={Styles.cardView}>
      <Image
        style={Styles.image}
        source={{ uri: picture }}
      />
      <View>
        <Text style={Styles.text}>{name}</Text>
        <Text style={Styles.text}>{position}</Text>
      </View>
    </View>
  </Card>)
}

const Styles = StyleSheet.create({
  mycard: {
    margin: 5,
    flexDirection: "row",
    padding: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },

  cardView: {
    flexDirection: "row",
    padding: 6,
  },

  image: {
    height: 65,
    width: 65,
    borderRadius: 25,
  },

  text: {
    fontSize: 20,
    marginLeft: 10
  }
})

export default CardItem