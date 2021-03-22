import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import { Avatar, Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import {BookSearch} from 'react-native-google-books';

import firebase from 'firebase';

export default class CustomSideBarMenu extends Component{
  constructor(){
    super();

    this.state = {
      avatar: "",
      userId: firebase.auth().currentUser.email,
      uri: "#"
    }
  }



  componentDidMount(){
    this.fetchImage(this.state.userId);

    // var books = BookSearch.searchBook("Harry Potter", "AIzaSyADe8oYlFU6nyyPe_sCR6xxvb9_tdcdIAg");

    // console.log(books);
  }

  fetchImage = async(userId)=>{
    var storageRef = firebase.storage().ref().child("profileImage/" + userId);

    storageRef.getDownloadURL().then((uri)=>{
      this.setState({
        uri: uri
      })
    }).catch((error)=>{
      this.setState({
        uri: '#'
      })
    })
  }

  uploadImage =async(userId, uri)=>{
    var response = await fetch(uri);
    var blob = await response.blob();
    var reference = firebase.storage().ref().child("profileImage/" + userId);

    return reference.put(blob).then((response)=>{
      console.log("Image uploaded");

      this.fetchImage(userId);
    })
  }

  pickImage=async()=>{
    const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if(cancelled != true){
      this.uploadImage(this.state.userId, uri)
    }
  }

  render(){
    return(
      <View style={{flex:1}}>
        <View
        style={{alignItems: 'center',justifyContent: 'center', backgroundColor: 'red', flex: 0.5}}>
        <Avatar
          rounded
          size= 'medium'
          style={styles.avatarStyle}
          showEditButton
          onPress={
            ()=>{
              this.pickImage();
            }
          }
          source={{
          uri:
            this.state.uri,
          }}
/>

        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  },
  avatarStyle: {
    width: '30%',
    height: '10%',
    borderRadius: 40,
    flex: 0.7
  }
})
