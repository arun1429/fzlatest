import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RenderHTML from 'react-native-render-html';
import { Viewport } from '@skele/components';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Banner from '../../components/AdMob/Banner';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import withSequentialRendering from '../../components/withSequentialRendering';
import colors from '../../constants/colors';
import styles from './styles';

const SequentialBanner = withSequentialRendering(Banner);

export default function NewsDetail(props) {
  const {item: newsDetail} = props.navigation.state.params;
  const {
    image,
    title,
    'dc:creator': creator,
    pubDate,
    'content:encoded': content,
  } = newsDetail;

  const [imageSize, setImageSize] = useState({width: null, heigth: null});

  const source = {
    html: content,
  };

  useEffect(() => {
    Image.getSize(image, (width, height) => {
      // calculate image width and height
      const screenWidth = Dimensions.get('window').width;
      const scaleFactor = width / screenWidth;
      const imageHeight = height / scaleFactor;
      setImageSize({width: screenWidth, height: imageHeight});
    });
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroudColor}}>
      <HeaderWithTittle name={'News'} navigation={props.navigation} />
      <Viewport.Tracker>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
        <View style={{flex: 1}}>
          {/* <FastImage
            style={styles.thumbnailImage}
            source={{
              uri: image,
            }}
            resizeMode={FastImage.resizeMode.cover}
          /> */}
          {/* <Image
            source={{uri: image}}
            style={{width: '100%', height: '40%'}}
            resizeMode="contain"
          /> */}
          <Image
            style={{width: imageSize.width, height: imageSize.height}}
            source={{uri: image}}
          />
          <View style={styles.newsText}>
            <Text style={styles.newsTitle}>{title}</Text>
            <Text style={styles.newsMeta}>
              {creator ?? ''} &middot;{' '}
              {pubDate
                ? // "Fri, 16 Dec 2022 13:50:14 GMT"
                  moment(pubDate, 'ddd, D MMM YYYY HH:mm:ss').fromNow() //.format('ddd, D MMM YYYY')
                : null}
            </Text>
            <SequentialBanner />
            <View style={{marginTop: 10}}>
              <RenderHTML
                source={source}
                enableCSSInlineProcessing={false}
                baseStyle={{color: colors.white}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      </Viewport.Tracker>
    </SafeAreaView>
  );
}
