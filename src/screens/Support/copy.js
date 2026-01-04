import React, { Component } from 'react'
import { View, SafeAreaView, TouchableOpacity, Text, FlatList, TextInput, StyleSheet ,ScrollView} from 'react-native';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import colors from '../../constants/colors';
import { EventRegister } from 'react-native-event-listeners'
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Support extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount = () => {
        EventRegister.emit('videoPaused', {
            isClosed: "false"
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <HeaderWithTittle name={"Support"} navigation={this.props.navigation} />
               
               <ScrollView>

               </ScrollView>
                <View style={styles.textViewStyle}>
                    <TextInput
                        placeholder='Type message here...'
                        placeholderTextColor={colors.black}
                        keyboardAppearance={'dark'}
                        enablesReturnKeyAutomatically={true}
                        ref={input => { this.Textinput = input }}
                        style={styles.input} />
                    <TouchableOpacity>
                        <Icon name="send" size={25} color={colors.backgroudColor} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroudColor,
    },
    textViewStyle: {
        position: 'absolute',
       
        flexDirection: 'row',
        backgroundColor: colors.white,
        width: '100%',
        alignItems: 'center'
    },
    input: {
        padding: 10,
        backgroundColor: colors.white,
        width: '90%',
        paddingLeft: 15,
    }
})