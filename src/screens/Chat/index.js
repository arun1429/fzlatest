import React, { Component, useLayoutEffect } from 'react'
import {
    SafeAreaView, TextInput, StyleSheet, View, TouchableOpacity, Text
} from 'react-native'
import Orientation from 'react-native-orientation';
import { GiftedChat } from 'react-native-gifted-chat'
// import { Dialogflow_V2 } from 'react-native-dialogflow'
import { dialogflow } from '../../../chatServer'
import { EventRegister } from 'react-native-event-listeners'

//style
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import colors from '../../constants/colors';

const localImage = require("../../../assets/img/fzlogo.jpg")
const FZ = {
    _id: 2,
    name: 'Dharam',
    avatar: localImage
}

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [
                // { _id: 2, text: '', createdAt: '', user: '' },
                // { _id: 1, text: "Welcome to Freizeit Media", createdAt: new Date(), user: FZ },
            ],
            id: 1,
            name: ''
        }

    }
    // "Welcome to Freizeit Media. we'll get back to you soon !" new Date() FZ
    componentDidMount() {
        console.log("msg", this.state.messages)
        EventRegister.emit('videoPaused', {
            isClosed: "false"
        })
        Orientation.lockToPortrait();
        // Dialogflow_V2.setConfiguration(
        //     dialogflow.client_email,
        //     dialogflow.private_key,
        //     Dialogflow_V2.LANG_ENGLISH_GB,
        //     dialogflow.project_id
        // )
    }

    onSend(messages = []) {
        this.setState((previosState) => ({
            messages: GiftedChat.append(previosState.messages, messages)
        }))

        let message = messages[0].text;
        console.log("msg", this.state.messages.length)
        if (this.state.messages.length == 0) {
            this.defaultResponse()
        } else {
            // Dialogflow_V2.requestQuery(
            //     message,
            //     (result) => this.handleGoogleResponse(result),
            //     (error) => console.log("Error", error)
            // )
        }
    }

    onQuickReply(reply) {
        console.log("Handle quickReply", reply)

        this.setState((previosState) => ({
            reply: GiftedChat.append(previosState.reply, reply)
        }))

        let message = reply[0].value;

        console.log("reply msg", this.state.messages)

        // Dialogflow_V2.requestQuery(
        //     message,
        //     (result) => this.handleGoogleResponse(result),
        //     (error) => console.log("Error", error)
        // )
    }

    handleGoogleResponse(result) {
        console.log("Handle Response", JSON.stringify(result))
        let text = result.queryResult.fulfillmentMessages[0].text.text[0];
        this.sendResponseFZ(text);
    }

    defaultResponse() {
        let msg = {
            _id: 2,
            text: "Welcome to Freizeit Media. we'll get back to you soon !",
            createdAt: new Date(),
            user: FZ
        }
        this.setState((previosState) => ({
            messages: GiftedChat.append(previosState.messages, [msg])
        }))
    }

    sendResponseFZ(text) {
        let msg = {
            _id: this.state.messages.length + 1,
            text,
            createdAt: new Date(),
            user: FZ
        }

        this.setState((previosState) => ({
            messages: GiftedChat.append(previosState.messages, [msg])
        }))

        console.log("msg", this.state.messages)

    }




    render() {

        return (
            <SafeAreaView style={styles.container}>
                 <HeaderWithTittle name={"Support"} navigation={this.props.navigation} />
                <GiftedChat
                    messages={this.state.messages}
                    ref={input => { this.focusTextInput = input }}
                    onSend={(message) => this.onSend(message)}
                    onQuickReply={(reply) => this.onQuickReply(reply)}
                    user={{
                        _id: 1
                    }}
                />
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroudColor,
    },
   
})

export default Chat;
