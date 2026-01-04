import React, {useState, useEffect} from 'react';
import {Image, View, TouchableOpacity, Dimensions, Linking} from 'react-native';
//Libraries
import { Viewport } from '@skele/components';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import analytics from '@react-native-firebase/analytics';
//Redux
import {connect} from 'react-redux';
import { setDisplayedAds, setCurrentIndex, setLastAdLoggedTime } from '../../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//Styles
import styles from './styles';
//Constants
import colors from '../../../constants/colors';

const ViewportAwareImage = Viewport.Aware(Image);

const Banner = (props) => {
  const [isLoading, setIsLoading]       = useState(true);
  const [allBannerAds, setAllBannerAds] = useState([]);
  const [index, setIndex] = useState(0);
  let lastLoggedTime = {};
  let { displayedAds, currentIndex, setDisplayedAds, setCurrentIndex, isBannerVisible, lastAdLoggedTime, bannerAds, setLastAdLoggedTime  } = props;


  // useEffect(() => {
  //   if(isBannerVisible){
  //     // console.log('Banner is visible :: ', allBannerAds[index]);
  //     // console.log(allBannerAds[index].upload_file);
  //   }
  // }, [isBannerVisible]);

  useEffect(() => {
    if(bannerAds.length > 0){
      setAllBannerAds(bannerAds);
    }
    setIsLoading(false);
  }, [bannerAds]);


  useEffect(() => {
    if (allBannerAds.length > 1) {
      if (currentIndex > allBannerAds.length - 1) {
        // Reset currentIndex and displayedAds to their initial states
        setCurrentIndex(1);
        setIndex(0)
        setDisplayedAds([]);
      } else if(!displayedAds.includes(currentIndex)) { 
        setIndex(currentIndex);
        setCurrentIndex(currentIndex + 1);
      }
    }
  }, [allBannerAds]);

  // const getBannerAds = () => {
  //   HttpRequest.getBannerAds(props.token)
  //     .then(res => {
  //       const result = res.data;
  //       if (res.status == 200 && result.error == false) {
  //         console.log('All Banner Ads data  : ', result.data);
  //         setAllBannerAds(result.data || []);
  //       } else {
  //         console.log('All Banner Ads API Error : ', result);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //       console.log('All Banner Ads API Catch Exception: ', err);
  //     });
  //   // setTimeout(() => {
  //   //   setAllBannerAds([
  //   //     {
  //   //       "_id": "66166571791dfd5a2c5ea11e",
  //   //       "upload_file": "https://www.webfx.com/wp-content/uploads/2021/10/banner-ad-example-online.png",
  //   //       "upload_cta_link": "https://freizeitmedia.com/",
  //   //       "order": null
  //   //     },
  //   //     {
  //   //       "_id": "66166571791dfd5a2c5ea12e",
  //   //       "upload_file": "https://neilpatel.com/wp-content/uploads/2021/02/vrbo-successful-banner-advertising-example.png",
  //   //       "upload_cta_link": "https://freizeitmedia.com/",
  //   //       "order": null
  //   //     },
  //   //     {
  //   //       "_id": "66166571791dfd5a2c5ea13e",
  //   //       "upload_file": "https://brandastic.com/wp-content/uploads/2021/12/banner-ads-examples-aws.jpg",
  //   //       "upload_cta_link": "https://freizeitmedia.com/",
  //   //       "order": null
  //   //     },
  //   //     {
  //   //       "_id": "66166571791dfd5a2c5ea14e",
  //   //       "upload_file": "https://www.webfx.com/wp-content/uploads/2021/10/example-of-banner-ad-with-value.png",
  //   //       "upload_cta_link": "https://freizeitmedia.com/",
  //   //       "order": null
  //   //     },
  //   //     {
  //   //       "_id": "66166571791dfd5a2c5ea15e",
  //   //       "upload_file": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHos-vuMHvj4SG55rCFoCRgfdEo4wS0y3G3fVNicF-nvdhBv5dbynEiqWsFLyNCtSUGw&usqp=CAU",
  //   //       "upload_cta_link": "https://freizeitmedia.com/",
  //   //       "order": null
  //   //     },
  //   //     {
  //   //       "_id": "66166571791dfd5a2c5ea16e",
  //   //       "upload_file": "https://lineardesign.com/wp-content/uploads/2019/12/Google-Ads-Display-Ads-MailChimp-Example-1-1.jpg",
  //   //       "upload_cta_link": "https://freizeitmedia.com/",
  //   //       "order": null
  //   //     }
  //   //   ]);
  //   //   setIsLoading(false);
  //   // }, 2000); 
  // }

  const logImpression = () => {
    const currentTime = Date.now();
    const cooldownPeriod = 5 * 60 * 1000; // 1 minutes in milliseconds
  
    if (lastAdLoggedTime.banner_ad_impression != undefined) {
      if (
        lastAdLoggedTime.banner_ad_impression &&
        currentTime - (lastAdLoggedTime.banner_ad_impression || 0) < cooldownPeriod
      ) {
          // Skip logging because the event was logged recently
          // console.log("Not logging EVENT :: banner_ad_impression :: ");
          return;
      }
    }
   
    analytics().logEvent('banner_ad_impression', {
      ad_id: allBannerAds[index]._id
    });

    // console.log("Logging EVENT :: banner_ad_impression");
  }

  const holdLogImpression = () => {
    const currentTime = Date.now();
    setLastAdLoggedTime({banner_ad_impression: currentTime});
  }

  const handleAdBannerCta = () => {
    Linking.openURL(allBannerAds[index].upload_cta_link);
  }
  
  return (
      <View style={styles.bannerAds}>
        {isLoading ? 
        <SkeletonPlaceholder backgroundColor={colors.inactiveGrey} >
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginHorizontal={10}>
            <SkeletonPlaceholder.Item width={Dimensions.get('window').width - 20} height={60} borderRadius={2} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
        :
        (allBannerAds.length > 0 ?
        <TouchableOpacity activeOpacity={0.8} style={{width: '100%', height: 50}} onPress={handleAdBannerCta}>
          <ViewportAwareImage
            style={{width: '100%', height: '100%', resizeMode: 'cover'}} 
            source={{ uri: allBannerAds[index].upload_file+"" }}
            onViewportEnter={logImpression}
            onViewportLeave={holdLogImpression}
          />
        </TouchableOpacity>
        :  <Image style={{width: '100%', resizeMode: 'contain'}} source={require('../../../../assets/img/banner_placeholder.jpg')} />
        )}
      </View>
  );
}

const mapStateToProps = state => {
  return {
    displayedAds: state.displayedAds,
    currentIndex: state.currentIndex,
    lastAdLoggedTime: state.lastAdLoggedTime,
    bannerAds: state.bannerAds
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({setDisplayedAds, setCurrentIndex, setLastAdLoggedTime}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
