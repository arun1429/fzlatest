import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native'
import { Icon } from 'native-base';
import { removeHtmlTags } from '../../lib';
//components
import EpisodesTab from './Tabs/';
import { ScrollView } from 'react-native';



export default class Episodes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            activeSeason: '1',
            active:0
        };
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    toggleSeason = (item) => {
        this.setState({ activeSeason: item.id, isModalVisible: false });
    }

    renderSeasons = (item) => {
        return (
            <TouchableOpacity key={item.id.toString()} style={styles.item} onPress={() => this.toggleSeason(item)} >
                <Text style={[styles.seasonText, styles.activeText]}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    convertMinsToTime = (mins) => {
        let hours = Math.floor(mins / 60);
        let minutes = mins % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours > 0 ? `${hours} hr ${minutes} min.` : `${minutes} min.`;
    }

    playAd = (path, details, id) => {
        this.props.playAd(path, details, id);
    }

    renderEpisodes(data) {
        const { details } = this.props;
        //console.log("data id ", details.id);
        const { activeSeason } = this.state;
        return data.map(item => {
            // if(activeSeason == item.season){
            return (
                <View style={{flex:1}}> 
                <EpisodesTab navigation={this.props.navigation} item={item} series_id={details.id} type={details.type} playAd={this.playAd} />
                </View>
            )
            // } 
        });
    }

    render() {
        const { details } = this.props;
        return (
            <View style={styles.container}>
                {/* <View style={{flex:1,flexDirection:'row',backgroundColor:'#1716164d'}}>
                    <Text style={styles.headerText}>
                        Episodes
                    </Text>
                </View> */}
             
                    {
                        details.seasons.map((item, ind) => {
                            return (
                                <View key={ind} style={{flex:1}}>
                                    <TouchableOpacity onPress={()=>this.setState({active: ind})} style={{ flexDirection: 'row', }}>
                                        <Text style={styles.buttonText}>
                                            Season {ind + 1}
                                        </Text>
                                    </TouchableOpacity>
                                   
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.renderEpisodes}>
                                        {this.renderEpisodes(item)}
                                    </ScrollView> 
                                </View>
                            )
                        })
                    }
              
                {/* <View style={{ flex: 1, margin: '2%' }}>
                    <TouchableWithoutFeedback >
                        <View style={styles.buttonWithIcon}>
                            {/* onPress={this.toggleModal} */}
                            {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={styles.buttonText}>{'Season ' + this.state.activeSeason}</Text>
                                <Icon 
                                    style={styles.iconDown}
                                    name="ios-arrow-down"
                                    color="white"
                                    size={10}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback> */} 
                    {/* <View style={styles.renderEpisodes}>
                        {this.renderEpisodes(details)}
                    </View> */}
                    {/* <Modal isVisible={this.state.isModalVisible} backdropColor={'#191a1f'} hideModalContentWhileAnimating={true} backdropOpacity={0.92}>
                        <View style={{ flex: 1, flexDirection: 'column' }} >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <FlatList
                                    data={[{ id: 1, name: 'Season 1', episodes: '10' }, { id: 2, name: 'Season 2', episodes: '10' }, { id: 3, name: 'Season 3', episodes: '10' }]}
                                    renderItem={({ item }) => this.renderSeasons(item)}
                                    keyExtractor={item => item.id.toString()}
                                    contentContainerStyle={{ flex: 1, justifyContent: 'center', }}
                                />
                            </View>
                            <View style={{ flex: 0.2, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TouchableOpacity onPress={this.toggleModal}>
                                    <Icon type="AntDesign" name='close' style={{ fontSize: 50, color: 'white', marginLeft: 10 }} />

                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal> */}
                {/* </View> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        textAlign: 'justify',
        fontSize: 20,
        fontWeight: '800',
        flexWrap: 'wrap',
        margin: '2%'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'white',
        marginTop:15,
        marginLeft:10
    },
    seasonText: {
        color: '#999',
        fontSize: 20,
        padding: 15
    },

    renderEpisodes: {
        marginTop: 10,
        flex:1,
        marginLeft:5,
        flexDirection:'row'
    },
    image: {
        width: 130,
        height: 90,
        resizeMode: 'contain',
        marginRight: 10
    },
    buttonPlay: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    episodeName: {
        flex: 1,
        justifyContent: 'center'
    },
    videoEpisode: {
        flex: 1,
        flexDirection: 'row'
    },
    text: {
        fontSize: 12,
        color: '#9999',
        fontWeight: '600'
    },
    activeText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600'
    },
    summary: {
        fontSize: 14,
        fontWeight: '300',
        color: '#fff',
        marginVertical: 10
    },
    item: {
        padding: 2,
        marginVertical: 5,
        marginHorizontal: 16,
    }
})
