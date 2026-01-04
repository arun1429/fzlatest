import React, {useEffect, useRef} from 'react';
import Video, {TextTrackType} from 'react-native-video';
import Subtitles from 'react-native-subtitles';
import {View} from 'native-base';
import RNBootSplash from 'react-native-bootsplash';

const App = () => {
  const VideoRef = useRef(null);
  useEffect(() => {
    RNBootSplash.hide();

    // return () => {
    //   second;
    // };
  }, []);

  const onBuffer = () => {
    console.log('buffering');
  };

  const onLoad = e => {
    console.log('On Load Data', e);
  };

  return (
    <View>
      <Video
        source={{
          uri: 'https://d1pa5vk3to5urj.cloudfront.net/movie/1613479031bois_locker_room_short_film/360p-movie/1613479031bois_locker_room_short_film.mp4',
        }} // Can be a URL or a local file.
        ref={VideoRef} // Store reference
        onLoad={onLoad}
        onBuffer={onBuffer} // Callback when remote video is buffering
        onError={e => console.log(e)} // Callback when video cannot be loaded
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
        selectedTextTrack={{
          type: 'title',
          value: 'English CC',
        }}
        subtitle={true}
        textTracks={[
          {
            title: 'English CC',
            language: 'en',
            type: TextTrackType.VTT, // "text/vtt"
            uri: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt',
          },
          {
            title: 'Spanish Subtitles',
            language: 'es',
            type: TextTrackType.SRT, // "application/x-subrip"
            uri: 'https://durian.blender.org/wp-content/content/subtitles/sintel_es.srt',
          },
        ]}
      />
    </View>
  );
};

export default App;
