import React, { useState, useCallback, useRef, useEffect } from "react";
import { Pressable, View, Alert, Dimensions, SafeAreaView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";

import styles from './styles';

const Live = (props) =>  {
  const [playing, setPlaying] = useState(false);
  const navigation = useNavigation();
  let { route } = props;
  let { params } = route;

  useEffect(() => {
    setPlaying(true);
  }, []);


  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#000'}}>
        <View style={styles.menu}>
            <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton, styles.backButtonPosition]}
            >
            <Image
                style={styles.iconlybrokenarrowLeft}
                contentFit="cover"
                source={require('../../components/images/left.png')}
            />
            </Pressable>
        </View>
        <YoutubePlayer
            height={300}
            width={Dimensions.get('window').width}
            play={playing}
            style={{ alignSelf: 'stretch', height: '100%' }}
            videoId={params.videoId}
            onChangeState={onStateChange}
        />
    </SafeAreaView>
  );
}


export default Live;