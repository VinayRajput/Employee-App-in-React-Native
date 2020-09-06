import React from 'react';
import { StyleSheet, Text, Image, View, Linking, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Title, Card, Button, IconButton } from 'react-native-paper';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Configs from '../configs/configs';

const theme = {
  colors: {
    primary: "blue"
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  avtarImg: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
    marginTop: "-20%",
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
  },
  center: {
    width: "100%",
    justifyContent: "center",
  },
  justify: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  centerContent: {
    alignItems: "center"
  },
  profileTitle: {
    fontSize: 30,
    padding: 10
  },
  text: {
    fontSize: 25,
    padding: 5
  },
  smallText: {
    fontSize: 18,
    margin: 2,
    marginHorizontal: 10
  },
  mycard: {
    margin: 3,
    borderWidth: 0,
    padding: 5
  },
  p10: {
    padding: 10
  },
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    paddingVertical: 10,
    height: 60,
  },
  button: {
    fontSize: 25,
    padding: 0,
    paddingHorizontal: 20
  }

})
const Profile = ({ route, navigation: { navigate } }) => {
  const { _id, name, email, salary, phone, picture, position } = route.params.item;

  const uri = `${Configs.NGROKPATH}/deleteEmployee`;
  const deleteEmployee = () => {
    console.log(`delete employee called ${_id}`)
    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "id": _id
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        Alert.alert(
          'Message',
          `${data.msg} with name: ${name}`,
          [
            { text: 'OK', onPress: () => navigate("Home") }
          ],
          { cancelable: false }
        )
        
      })

  }

  const openDial = () => {
    if (Platform.OS === "android") {
      Linking.openURL(`tel:${phone}`)
    } else {
      Linking.openURL(`telprompt:${phone}`)
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#006699", "#0099ff"]}
        height="20%"
      />
      <View style={
        styles.row,
        styles.centerContent
      }>
        <Image
          source={{ uri: picture }}
          style={styles.avtarImg}
          width="100"
          height="100"
        />
      </View>
      <View style={styles.centerContent}>
        <Title style={styles.profileTitle}>
          {name}
        </Title>
        <Text style={styles.text}>
          {position}
        </Text>
      </View>
      <Card style={styles.mycard}
        onPress={() => Linking.openURL(`mailto:${email}`)}
      >
        <View style={styles.p10, styles.row}
        >
          <MaterialIcons
            name="email"
            size={32}
            color="blue"
          >
          </MaterialIcons>
          <Text style={styles.smallText}>
            {email}
          </Text>
        </View>
      </Card>
      <Card style={styles.mycard}
        onPress={() => openDial()}
      >
        <View style={styles.p10, styles.row}
        >
          <Feather
            name="phone"
            size={32}
            color="blue"
          >
          </Feather>
          <Text style={styles.smallText}>
            {phone}
          </Text>
        </View>
      </Card>
      <Card style={styles.mycard}>
        <View style={styles.p10, styles.row}
        >
          <MaterialIcons
            name="attach-money"
            size={32}
            color="blue"
          >
          </MaterialIcons>
          <Text style={styles.smallText}>
            {salary}
          </Text>
        </View>
      </Card>
      <View style={styles.buttonsView}>
        <Button icon="account-edit" mode="contained"
          size={60}
          theme={theme}
          style={styles.button}
          onPress={() => navigate("Create", { _id, name, email, salary, phone, picture, position, update:true })}>
          Edit
      </Button>
        <Button icon="account-remove" mode="contained"
          size={60}
          theme={theme}
          style={styles.button}
          onPress={() => deleteEmployee()}>
          Delete
  </Button>
      </View>
    </View>
  )
}

export default Profile