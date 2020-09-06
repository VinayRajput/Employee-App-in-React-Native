import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert } from 'react-native';
import { Card, FAB, ActivityIndicator, Title } from 'react-native-paper';
import Constants from 'expo-constants'
import CardItem from '../component/cardItem';
import data from '../tempData/employees.json'
import { render } from 'react-dom';
import Configs from '../configs/configs'
import { useSelector, useDispatch } from 'react-redux';

const Home = ({ navigation }) => {
  const { data:employeeData, loadingState:loading } = useSelector(state => {
    return state
  })

  const dispatch = useDispatch();
  const uri = `${Configs.NGROKPATH}/getEmployees`;
  const fetchEmployeesList = () => {
    dispatch({ type: "SET_LOADING", payload: true })
    fetch(uri, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        console.log("Employees List Refreshed")
        dispatch({ type: "UPDATE", payload: data })
        dispatch({ type: "SET_LOADING", payload: false })
      })
      .catch(e => {
        Alert.alert(`Something went wrong ${e}`)
      })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEmployeesList();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {
        loading ?
          <ActivityIndicator size="large" color="steelblue" style={{ flex: 1 }} />
          :

          employeeData.length > 0
            ?
            <FlatList
              data={employeeData}
              renderItem={({ item }) => {
                const props = {
                  item: item,
                  navigation: navigation
                }

                return <CardItem props={props} />
              }}
              keyExtractor={item => `${item._id}`}
              onRefresh={() => { fetchEmployeesList() }}
              refreshing={loading}
            />
            :
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Title> No Records Found
               </Title>
              <Text>Add an Employee</Text>
            </View>
      }
      <FAB
        style={styles.fab}
        small={false}
        icon="plus"
        theme={{ colors: { accent: "lightblue" } }}
        onPress={() => { console.log('Create Pressed'); navigation.navigate("Create"); }}
      />

    </View>
  )

  withData = (componentName, data) => {
    componentName = (props) => {
      render(<div>
        {data.name}
      </div>)
    }
    return <componentName props={data} />
  }
}
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default Home
