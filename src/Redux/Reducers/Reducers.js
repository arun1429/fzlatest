import * as type from '../Actions/ActionType';
import initialState from './initialState';

export default UserData = (state = initialState.userData, action) => {

    switch (action.type) {
        case type.LOGIN_TOKEN:
            return {
                ...state,
                token: action.token
        };

        case type.USER_INFO:
            return {
                ...state,
                info: action.info
            };

        case type.SLIDER:
            return {
                ...state,
                slider: action.slider
            };

        case type.RECENTLY_WATCHED:
            return {
                ...state,
                recentlywatched: action.recentlywatched
            };

        case type.MOVIES_LATEST:
            return {
                ...state,
                latestmovies: action.latestmovies
            };

        case type.SERIES_LATEST:
            return {
                ...state,
                latestseries: action.latestseries
            };

        case type.DOCUMENTARIES:
            return {
                ...state,
                documentary: action.documentary
            };
        
        case type.COMING_SOON:
            return {
                ...state,
                comingsoon: action.comingsoon
            };
            
        case type.TRENDING_NOW:
            return {
                ...state,
                trendingnow: action.trendingnow
            };

        case type.EVENT_LATEST:
            return {
                ...state,
                latestevents: action.latestevents
            };
        
        case type.BANNER_ADS:
            return {
                ...state,
                bannerAds: action.banner_ads
            };

        case type.VIDEO_ADS:
            return {
                ...state,
                videoAds: action.video_ads
            };

        case type.VLOGS:
            return {
                ...state,
                vlogs: action.vlogs
            };

        case type.MOVIES_INFO:
            return {
                ...state,
                movies: action.movies
            };

        case type.SERIES_INFO:
            return {
                ...state,
                series: action.series
            };
            
        case type.NOTIFICATION:
            return {
                ...state,
                notification: action.notification
            };
        
        case type.WISHLIST:
            return {
                ...state,
                wishlist: [action.wishlist]
            };

        case type.WISHLIST:
            return {
                ...state,
                wishlist: [action.wishlist]
            };
        case type.WIFI_INFO:
            return {
                ...state,
                wifi: action.wifi
            };

        case type.EXCLUSIVE_ALL:
            return {
                ...state,
                Exclusive: action.Exclusive
            };
    
        case type.BUNDLEID:
            return {
                ...state,
                bundleId: action.bundleId
            };

        case type.DISPLAYED_ADS:
            return {
                ...state,
                displayedAds: action.displayedAds
            };

        case type.CURRENT_INDEX:
            return {
                ...state,
                currentIndex: action.currentIndex
            };
        
        case type.VIDEO_ADS_DISPLAYED:
            return {
                ...state,
                displayedVideoAds: action.displayedVideoAds
            };

        case type.CURRENT_VIDEO_INDEX:
            return {
                ...state,
                currentVideoAdIndex: action.currentVideoAdIndex
            };

        case type.LAST_AD_LOGGED_TIME:
            return {
                ...state,
                lastAdLoggedTime: action.lastAdLoggedTime
            };
        default:
            return state;
    }

}

