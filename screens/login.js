import React from 'react';
import {Text, View, StyleSheet, KeyboardAvoidingView, ToastAndroid, Image, TextInput, Button} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default class Login extends React.Component {
    constructor(){
        super();
        this.state={
            Title:'',
            Author:'',
            Story:'',
        }
    }
    render(){
        return(
            <View style={stylez.Searchsty}>
                <h1>Story Hub</h1>
                    <Text>Story Title</Text>
                <TextInput value={this.state.Title} onChangeText={(text)=>this.setState({Title:text})}/>
                    <Text>Author</Text>
                <TextInput value={this.state.Author} onChangeText={(text)=>this.setState({Author:text})}/>
                    <Text>Story</Text>
                <TextInput value={this.state.Story} onChangeText={(text)=>this.setState({Story:text})}/>
                <TouchableOpacity style={{backgroundColor:'blue'}}>
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const stylez = StyleSheet.create({
    Searchsty:{
        justifyContent:'center',
        backgroundColor:'green',
        alignText:'center',
        Textsize:'10',
        fontWeight:'5',
        Textcolor:'Red',
    }
})