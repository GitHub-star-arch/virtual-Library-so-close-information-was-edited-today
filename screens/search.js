import React from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import { FlatList } from 'react-native';
export default class Search extends React.Component {

    componentDidMount=async()=>{
        const quiery = await db.collection("Transaction").limit(10).get();
        quiery.docs.map((doc)=>{this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastTransactionDoc:doc.data()})})
    }

    constructor (props) {
        super(props);
        this.state={
            allTransactions:[],
            search:'',
            lastTransactionDoc:'',
        }
    }

    fetchMoreTransactions=async()=>{
        var text=this.state.search.toUpperCase()
        var enteredText=text.split("")
        if (enteredText[0].toUpperCase()==='B') {
            const quiery=await db.collection("Transaction").where("bookID","==",text).startAfter(this.state.lastTransactionDoc).limit(10).get();
        }
    }

    render(){
        return(
            <View>
                <TextInput placeholder="bookID or studentID" onChangeText={(text)=>{this.setState({search:text})}}></TextInput>
                <FlatList>
                    data={this.state.allTransactions}
                    renderItems={({item})=>(
                        <View style={{borderBottomWidth:3}}>
                            <Text>{"bookID: "+item.bookID}</Text>
                            <Text>{"studentID: "+item.studentID}</Text>
                            <Text>{"transactionType: "+item.transactionType}</Text>
                            <Text>{"date: "+item.date.toDate()}</Text>
                        </View>
                    )}
                    keyExtractor={(item,index)=>index.toString()}
                    onEndReached={this.fetchMoreTransactions}
                    onEndReachedThreshold={0.5}
                </FlatList>
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
/* <Text style={stylez.Searchsty}>
Search
</Text> */