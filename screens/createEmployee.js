import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Modal, Image, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Title, IconButton } from 'react-native-paper';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Configs from '../configs/configs'

const CreateEmployee = ({ navigation: { navigate }, route }) => {
  //console.log("route.params: ",route.params)
  const update = !!route.params
  const get = (key) => {
    return (!!route.params) ? route.params[key] : ""
  }

  const [name, setName] = useState(get('name'));
  const [phone, setPhone] = useState(get('phone'));
  const [email, setEmail] = useState(get('email'));
  const [salary, setSalary] = useState(get('salary'));
  const [picture, setPicture] = useState(get('picture'));
  const [position, setPosition] = useState(get('position'));
  const [avoidKeyboard, setAvoidKeyboard] = useState(false);
  const [id, setId] = useState(get('_id'))
  const [modal, setModal] = useState(false);
  const theme = {
    colors: {
      primary: "blue",
    }
  }
  const uploadFile = (image) => {
    const formData = new FormData()
    formData.append("file", image);
    formData.append("upload_preset", "employee-test-app");
    formData.append("cloud_name", "vinkrins");
    fetch("https://api.cloudinary.com/v1_1/vinkrins/image/upload", {
      method: "POST",
      body: formData
    }).then(res => res.json())
      .then(data => {
        //console.log(data);
        Alert.alert("Update", "Photo uploaded successfully.", [{
          text: "OK",
          onPress: () => {

          }
        }])
        setPicture(data.url);
        setModal(false);
      })
      .catch(e => {
        Alert.alert(`Error`, `Something went wrong ${e}`, [{
          text: "OK"
        }])
      })
  }

  const submitData = () => {
    const employeeData = {
      name,
      email,
      phone,
      picture,
      salary,
      position,
    };
    const uri = `${Configs.NGROKPATH}/${!!update ? 'updateEmployee' : 'createEmployee'} `;
    //console.log(uri);

    if (!!update)
      employeeData.id = id;

    //console.log(employeeData);

    fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData) //JSON.stringify
    })
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        Alert.alert(`Employee `, `${data.name} profile ${!!update ? 'updated' : 'created'} successfully.`, [
          {
            text: 'OK',
            onPress: () => {
              navigate("Home");
            }
          }
        ])
      })
      .catch(e => {
        Alert.alert(`Something went wrong ${e}`)
      })
  }

  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
      })
      if (!data.cancelled) {
        let filename = data.uri.split(".");
        let file = { uri: data.uri, type: `text/${filename[1]}`, name: filename[0] }
        uploadFile(file)
      }
    } else {
      Alert.alert("Permission Required", "You need to give us permission to click a picture from your mobile camera", [
        {
          text: "OK",
          onPress: () => {
            navigate.goBack();
          }
        }
      ])
    }
  }

  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      const data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
      })
      if (!data.cancelled) {
        let filename = data.uri.split(".");
        let file = { uri: data.uri, type: `text/${filename[1]}`, name: filename[0] }
        uploadFile(file)
      }
    } else {
      Alert.alert("Permission Required", "You need to give us permission to click a picture from your mobile camera", [
        {
          text: "OK",
          onPress: () => {
            navigate.goBack();
          }
        }
      ])
    }
  }

  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    inputStyle: {
      marginVertical: 5
    },
    container: {
      flex: 1,
      margin: 0,
      backgroundColor: "transparent"
    },
    scrollView: {
      marginHorizontal: 10,
    },
    text: {
      fontSize: 42,
    },
    buttonView: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 5
    },
    modalView: {
      position: "absolute",
      bottom: "25%",
      width: "96%",
      padding: 10,
      height: "50%",
      paddingVertical: 20,
      backgroundColor: "#cccccc95",
      borderWidth: 5,
      borderColor: "#fff",
      margin: "2%",
      borderRadius: 10,
      justifyContent: "space-around",
    },
    greyBtn: {
      backgroundColor: "#fafafa",
      width: "50%",
      marginHorizontal: "25%",
      marginTop: 20
    },
    closeBtn: {
      fontSize: 20,
      borderColor: "white",
      backgroundColor: "white",
    },
    addPhotoBtn: {
      flexDirection: "column",
      alignItems: "center",
      padding: 5,
      borderRadius: 100,
      height: 150,
      width: 150,
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: "#e1e1e1",
      borderColor: "#444",
    },
    avtarImg: {
      width: 150,
      height: 150,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: "white",
      marginBottom: 10
    },
    bigButton: { padding: 10, paddingHorizontal: 20, marginBottom: 50 }
  })

  return (
    <View style={styles.root}>

      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <KeyboardAvoidingView enabled={avoidKeyboard}>
            <View style={styles.buttonView}>
              {
                picture == "" ?
                  <Button
                    mode="outlined"
                    icon={picture == "" ? "plus" : "check"}
                    onPress={() => setModal(true)}
                    theme={{
                      colors: {
                        primary: "black"
                      }
                    }}

                    style={styles.addPhotoBtn}
                  >{picture == "" ? "Add Photo" : "Added"} </Button>
                  :
                  <Image
                    source={{ uri: picture }}
                    style={styles.addPhotoBtn}
                  />
              }
            </View>
            <TextInput
              label="Name"
              value={name}
              mode="outlined"
              theme={theme}
              style={styles.inputStyle}
              onChangeText={val => setName(val)}
              returnKeyType="next"
            />
            <TextInput
              label="Phone"
              value={phone}
              mode="outlined"
              theme={theme}
              keyboardType="number-pad"
              style={styles.inputStyle}
              onChangeText={val => setPhone(val)}
              returnKeyType="next"
            />
            <TextInput
              label="Email"
              value={email}
              mode="outlined"
              theme={theme}
              style={styles.inputStyle}
              onChangeText={val => setEmail(val)}
            />
            <TextInput
              label="Position"
              value={position}
              mode="outlined"
              theme={theme}
              style={styles.inputStyle}
              onChangeText={val => setPosition(val)}
            />
            <TextInput
              label="Salary"
              value={salary}
              mode="outlined"
              theme={theme}
              keyboardType="number-pad"
              style={styles.inputStyle}
              onChangeText={val => setSalary(val)}
            />
            <View
              style={styles.buttonView}
            >
              <Button
                mode="contained"
                icon="content-save"
                onPress={() => { submitData() }}
                theme={theme}
                style={styles.bigButton}
              >

                <Title style={{ color: "#fff" }}>Save</Title></Button>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.buttonView}>
            <Button
              icon="camera"
              mode="contained"
              onPress={() => pickFromCamera()}
              theme={theme}
              style={styles.bigButton}
            >
              Camera
        </Button>
            <Button
              icon="image-area"
              mode="contained"
              onPress={() => pickFromGallery()}
              theme={theme}
              style={styles.bigButton}
            >
              Image
        </Button>
          </View>
          <View
            style={styles.buttonView}>
            <Button
              icon="close"
              mode="outlined"
              theme={{
                colors: {
                  primary: "black"
                }
              }}
              onPress={() => setModal(false)}
              style={styles.closeBtn}
            >
              Cancel
        </Button>
          </View>
        </View>
      </Modal>
    </View>

  )
}

export default CreateEmployee;