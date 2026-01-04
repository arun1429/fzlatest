import {XMLParser} from 'fast-xml-parser';
import moment from 'moment/moment';
import React, {Component} from 'react';
import {FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Viewport } from '@skele/components';
import Banner from '../../components/AdMob/Banner';
import withSequentialRendering from '../../components/withSequentialRendering';
import HomeHeader from '../../components/Header/HomeHeader';
import colors from '../../constants/colors';
import styles from './styles';

const SequentialBanner = withSequentialRendering(Banner);

export default class NewsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xml_Item: '',
      newsData: [],
      activeCategory: 'national',
      isLoading: false,
      newsCategory: ['national', 'top-news', 'entertainment', 'editorial', 'different', 'science', 'world', 'sports', 'business', 'covid-19', 'life-style', 'cg-dpr', 'local-chhattisgarh', 'local', 'religion', 'others', 'video', 'breaking-news', 'featured', 'local-andhra-pradesh', 'local-uttar-pradesh', 'local-gujarat', 'technology', 'local-madhya-pradesh', 'local-maharashtra', 'local-rajasthan', 'epaper', 'politics', 'today-epaper', 'today-epaper-page5', 'delhi-ncr', 'local-arunachal-pradesh', 'local-assam', 'local-andra-pradesh', 'local-tripura', 'local-nagaland', 'local-manipur', 'local-mizoram', 'local-meghalaya', 'local-goa', 'local-bihar', 'local-haryana', 'local-odisha', 'local-karnataka', 'local-kerala', 'local-himachal-pradesh', 'local-uttarakhand', 'local-jharkhand', 'local-tamil-nadu', 'local-telangana', 'local-punjab', 'local-west-bengal', 'local-sikkim', 'local-jammu-and-kashmir', 'madhya-pradesh'],
    };
  }

  componentDidMount = () => {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });

    this.fetchNewsData();
  };

  getXMLResponse = async category => {
    const host = 'https://jantaserishta.com/category/';
    return fetch(host + category + '/feeds.xml')
      .then(response => response.text())
      .then(textResponse => {
        const parser = new XMLParser();
        const xmlDataShow = parser.parse(textResponse);
        const news = xmlDataShow.rss.channel.item;
        return news;
      })
      .catch(error => {
        console.log(error);
      });
  };

  fetchNewsData = async () => {
    this.setState({isLoading: true});
    const {activeCategory} = this.state;
    const response = await this.getXMLResponse(activeCategory);
    this.setState({newsData: response, isLoading: false});
  };

  renderNewsCategories = ({item}) => {
    const isCategoryActive = this.state.activeCategory === item;
    return (
      <TouchableOpacity style={styles.categoryTitleWrapper} onPress={() => !isCategoryActive && this.setState({activeCategory: item}, this.fetchNewsData)}>
        <Text style={isCategoryActive ? [styles.categoryTitle, styles.activeCategory] : [styles.categoryTitle]}>{item.replace('local-', '')}</Text>
        {isCategoryActive && <View style={styles.floatingDot} />}
      </TouchableOpacity>
    );
  };

  openDetailPage = item => {
    this.props.navigation.push('NewsDetail', {item});
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToBottom;
  };

  renderNewsItem = ({item, index}) => {
    const {image, title, pubDate, 'dc:creator': creator} = item;

    return (
      <>
        <TouchableOpacity
          // activeOpacity={0.9}
          onPress={() => this.openDetailPage(item)}>
          <View style={styles.news}>
            <FastImage
              style={styles.thumbnailImage}
              source={{
                uri: image,
              }}
              resizeMode={FastImage.resizeMode.cover}
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
            </View>
          </View>
        </TouchableOpacity>
        {index % 2 === 0 ? <SequentialBanner /> : null}
      </>
    );
  };

  render() {
    const {newsData, isLoading} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroudColor}}>
        <StatusBar backgroundColor={colors.backgroudColor} />
        <HomeHeader {...this.props} />
        <View style={{position: 'relative'}}>
          <FlatList
            onScroll={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent)) {
                // enableSomeButton();
                console.log('END REACHED!!!');
              }
            }}
            contentContainerStyle={{paddingLeft: 10}}
            horizontal
            data={this.state.newsCategory}
            renderItem={this.renderNewsCategories}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.categoryContainer}>
          {isLoading ? (
            <ScrollView style={{flex: 1}}>
              {new Array(10).fill(1).map((_, index) => (
                <SkeletonPlaceholder key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 20,
                    }}>
                    <View style={{width: 120, height: 130, borderRadius: 20}} />
                    <View style={styles.newsText}>
                      <View style={{height: 20, borderRadius: 4}} />
                      <View
                        style={{
                          marginTop: 6,
                          width: 80,
                          height: 20,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                  </View>
                </SkeletonPlaceholder>
              ))}
            </ScrollView>
          ) : (
            newsData?.length > 0 && <Viewport.Tracker><FlatList data={newsData} renderItem={this.renderNewsItem} keyExtractor={item => item.image} showsVerticalScrollIndicator={false} /></Viewport.Tracker>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
