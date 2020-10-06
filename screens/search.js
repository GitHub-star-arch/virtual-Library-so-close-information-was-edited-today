import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Login} from React.Component;
export default class Search extends React.Component {

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
            <View>
                <Text style={stylez.Searchsty}>
                  {Title}
                  {Author}
                  {Story}
                </Text>
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