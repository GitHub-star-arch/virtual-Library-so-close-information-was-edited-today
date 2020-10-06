import React from 'react';
import {Text, View, StyleSheet, KeyboardAvoidingView, ToastAndroid, Image} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from '../config.js';
import * as firebase from 'firebase';
export default class Login extends React.Component {
    
    initiateBookIssue=async()=>{
        console.log("hibye")
        db.collection("Transaction").add({
        'studentID':this.state.scannedStudentID,
        'bookID':this.state.scannedBookID,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactiontype':"Issued",
        });
        db.collection("Books").doc(this.state.scannedBookID).update({
        Avalibility:false,
        })
        db.collection("Student").doc(this.state.scannedStudentID).update({
        NumberOfBooksIssued:firebase.firestore.FieldValue.increment(1),
        })
        this.setState({
            scannedBookID:'',
            scannedStudentID:'',
        })
    }
    initiateBookReturn=async()=>{
        db.collection("Transaction").add({
        'studentID':this.state.scannedStudentID,
        'bookID':this.state.scannedBookID,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactiontype':"Returned",
        });
        db.collection("Books").doc(this.state.scannedBookID).update({
        Avalibility:true,
        })
        db.collection("Student").doc(this.state.scannedStudentID).update({
        NumberOfBooksIssued:firebase.firestore.FieldValue.increment(-1),
        })
        this.setState({
            scannedBookID:'',
            scannedStudentID:'',
        })
    }
    handleTransaction=async()=>{
        var transactiontype = await this.checkBookEligibility();
        if(!transactiontype){
            alert("Your book is not available")
            this.setState({scannedBookID:'', scannedStudentID:''})
        } else if (transactiontype==="issue") {
            var isStudentEligible = await this.checkStudentEligibilityForBookIssue();
            if (isStudentEligible) {
                alert("Book Issued To You")
                this.initiateBookIssue();
            } else if (!isStudentEligible) {
                var isStudentEligible = await this.checkBookEligibilityForReturn();
                if (isStudentEligible) {
                    alert("Book Has Been Returned");
                    this.initiateBookReturn();
                }
            }
        }
        // console.log("byehi")
        // var transactionMessage=null;
        // db.collection("Books").doc(this.state.scannedBookID).get().then((doc)=>{
        // var book = doc.data()
        // if (book.Avalibility) {
        //     this.initiateBookIssue();
        //     transactionMessage="bookIssued"
        //     alert(transactionMessage)
        //     ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
        // } else {
        //     this.initiateBookReturn();
        //     transactionMessage="bookReturned"
        //     alert(transactionMessage)
        //     ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
        // }
        // this.setState({transactionMessage:transactionMessage})
        // });
    }
    checkBookEligibility=async()=>{
        var bookref = await db.collection("Books").where("bookID","==",this.state.scannedBookID()).get();
        var transactiontype = '';
        if (bookref.docs.length==0) {
            transactiontype=false;
        } else {
            bookref.docs.map(doc=>{var book=doc.data()});
            if(book.Avalibility){
                transactiontype="issue"
            } else {
                transactiontype="return"
            }
        }
        return  transactiontype;
    }
    checkStudentEligibilityForBookIssue=async()=>{
        var studentref=await db.collection("Student").where("studentID","==",this.state.scannedStudentID).get();
        var isStudentEligible='';
        if (studentref.docs.length==0) {
            isStudentEligible=false;
            alert("You don't exist deal with it")
            this.setState({
                scannedStudentID:'',
                scannedBookID:'',
            })
        } else {
            studentref.docs.map(doc=>{
                var student=doc.data();
                if (student.NumberOfBooksIssued<2) {
                    isStudentEligible=true;
                } else {
                    isStudentEligible=false;
                    alert("How about return some books before you take more. Do not hog!")
                    this.setState({
                        scannedStudentID:'',
                        scannedBookID:'',
                    })
                }
            })
        }
    }
    checkStudentEligibilityForBookReturn=async()=>{
        const transactionref=await db.collection("Transaction").where("bookID","==",this.state.scannedStudentID).limit(1).get();
        var isStudentEligible="";
        transactionref.docs.map(doc=>{
            var lastBookTransaction=doc.data();
            if (lastBookTransaction.studentID===this.state.scannedStudentID) {
                isStudentEligible=true
            } else {
                isStudentEligible=false
                alert("The books not yours so don't cheat!");
                this.setState({
                    scannedStudentID:'',
                    scannedBookID:'',
                })
            }
        })
    }
    getCameraPermissions=async()=>{
        const {status}=await Permissions.askAsync(Permissions.camera);
        this.setState({hasCameraPermissions:status==="granted"});
    }
    handleBarCodeScan=async({type,Data})=>{
        const {buttonState}=this.state
        if (buttonState==="bookID") {
            this.setState({
                scanned: true,
                scannedBookID: Data,
                buttonState: 'normal',
            })
        }
        if (buttonState==="studentID") {
            this.setState({
                scanned: true,
                scannedStudentID: Data,
                buttonState: 'normal',
            })
        }
    }
    constructor(){
        super();
        this.state={
            scanned: false,
            scannedData: '',
            hasCameraPermissions: null,
            buttonState: 'normal',
            scannedBookID:'',
            scannedStudentID:'',
            transactionMessage:'',
        }
    }

    render(){
        const hasCameraPermissions=this.state.hasCameraPermissions;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState; 
        if (buttonState==="clicked" && hasCameraPermissions){
            return(
                <BarCodeScanner
                    onBarCodeScanned={scanned?undefined:this.handleBarCodeScan}
                />
            )
        } else if(buttonState==="normal"){
            return(
                <KeyboardAvoidingView style={{alignItems:"center"}} behavior="padding" enabled>
                    <View>
                    <Image source={require("../pictures/booklogo.jpg")} style={{width:200, height:200}}></Image><Text>Super Awesome Virtual Library</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                    <TextInput 
                    style={{width:200,height:40,borderWidth:1.5,borderRightWidth:0}} 
                    placeholder="bookID" 
                    value={this.state.scannedBookID} 
                    onChangeText={text=>this.setState({scannedBookID:text})}>
                    </TextInput>
                    <TouchableOpacity style={{width:100,height:40,borderWidth:1.5,borderLeftWidth:0, backgroundColor:'#45cea2'}} onPress={()=>{this.getCameraPermissions("bookID")}}>
                    <Text style={{alignItems:'center',justifyContent:'center',flex:1}}>Scan ID</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row"}}>
                    <TextInput 
                    style={{width:200,height:40,borderWidth:1.5,borderRightWidth:0}} 
                    placeholder="studentID" 
                    value={this.state.scannedStudentID}
                    onChangeText={text=>this.setState({scannedStudentID:text})}>
                    </TextInput>
                    <TouchableOpacity style={{width:100,height:40,borderWidth:1.5,borderLeftWidth:0, backgroundColor:'#45cea2'}} onPress={()=>{this.getCameraPermissions("studentID")}}>
                    <Text style={{alignItems:'center',justifyContent:'center',flex:1}}>Scan ID</Text>
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={stylez.Substy}>
                       <Text style={stylez.Testy} onPress={ async ()=>{var transactionMessage = await this.handleTransaction()}}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )
        }
    }
}
const stylez = StyleSheet.create({
    Logsty:{
        justifyContent:'center',
        backgroundColor:'green',
        alignText:'center',
        Textsize:10,
        fontWeight:5,
        Textcolor:'Red',
        width:100,
        margin:50,
    },
    Substy:{
        alignItems:"center",
        borderColor:"black",
        height:50,
        width:100,
        borderWidth:5,
        backgroundColor:"red",
    },
    Testy:{
        textColor:"blue",
    }
})  