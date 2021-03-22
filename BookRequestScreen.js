import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books';

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      isBookRequestActive: false,
      userDocId: ""
    }
  }

  getRequestStatus =async()=>{
    
     await db.collection("users").where("email_id", "==", this.state.userId).onSnapshot(
      snapshot =>{
        snapshot.forEach(doc =>{
          this.setState({
            isBookRequestActive: doc.data().activeRequest,
            userDocId: doc.id
          })
        })
      }
    )

    if(this.state.isBookRequestActive === true){
      await db.collection('requested_books').where('user_id', "==", this.state.userId).onSnapshot(
        snapshot =>{
          snapshot.forEach(doc=>{

            //console.log(doc.data());
            if(doc.data().is_active === true){
              this.setState({
                bookName: doc.data().book_name,
                reasonToRequest: doc.data().reason_to_request
              })
            }
          })
        }
      )
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addRequest = async(bookName,reasonToRequest)=>{

    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()

    await db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "is_active": true
    })

    await db.collection("users").doc(this.state.userDocId).update({
      "activeRequest": true
    })

    this.setState({
      bookName : bookName,
      reasonToRequest : reasonToRequest,
      isBookRequestActive: true
  })    

    return Alert.alert("Book Requested Successfully")
  }

  componentDidMount (){
    // this.getRequestStatus();

     var books = BookSearch.searchBook("HarryPotter", "AIzaSyADe8oYlFU6nyyPe_sCR6xxvb9_tdcdIAg");

     console.log(books);
  }


  render(){
    

    if(this.state.isBookRequestActive === true)
    {
      return(
        <View style={{flex:1}}>
          <MyHeader title="Active Book Request" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <Text>
                Book Name: {this.state.bookName}
              </Text>
              <Text>
                Reason for Request: {this.state.reasonToRequest}
              </Text>
            </KeyboardAvoidingView>
        </View>
      )
    }else{
      return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
    }

    
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
