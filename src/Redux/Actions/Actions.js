

import {
    LOGIN_TOKEN,
    USER_INFO,
    MOVIES_INFO,
    SERIES_INFO,
    SLIDER,
    RECENTLY_WATCHED,
    MOVIES_LATEST,
    SERIES_LATEST,
    DOCUMENTARIES,
    COMING_SOON,
    TRENDING_NOW,
    EVENT_LATEST,
    BANNER_ADS,
    VIDEO_ADS,
    VLOGS,
    NOTIFICATION,
    WISHLIST,
    WIFI_INFO,
    GAME_ALL,
    EXCLUSIVE_ALL,
    BUNDLEID,
    DISPLAYED_ADS,
    CURRENT_INDEX,
    VIDEO_ADS_DISPLAYED,
    CURRENT_VIDEO_INDEX,
    LAST_AD_LOGGED_TIME,
} from './ActionType';


export const storeBundleId = (data) => {
    // console.log("show login token", data);
    return {
        type: BUNDLEID,
        bundleId: data
    }
}

export const loginToken = (data) => {
    // console.log("show login token", data);
    return {
        type: LOGIN_TOKEN,
        token: data
    }
}
export const userInfo = (data) => {
    // console.log("show user info", data);
    return {
        type: USER_INFO,
        info: data
    }
}
export const slider = (data) => {
    return {
        type: SLIDER,
        slider: data
    }
}
export const recentlyWatched = (data) => {
    return {
        type: RECENTLY_WATCHED,
        recentlywatched: data
    }
}
export const latestMovies = (data) => {
    return {
        type: MOVIES_LATEST,
        latestmovies: data
    }
}
export const latestGame = (data) => {
    return {
        type: GAME_ALL,
        latestGame: data
    }
}

export const Exclusive = (data) => {
    return {
        type: EXCLUSIVE_ALL,
        Exclusive: data
    }
}

export const latestSeries = (data) => {
    return {
        type: SERIES_LATEST,
        latestseries: data
    }
}
export const documentaries = (data) => {
    return {
        type: DOCUMENTARIES,
        documentary: data
    }
}
export const comingSoon = (data) => {
    return {
        type: COMING_SOON,
        comingsoon: data
    }
}
export const trendingNow = (data) => {
    return {
        type: TRENDING_NOW,
        trendingnow: data
    }
}
export const latestEvents = (data) => {
    return {
        type: EVENT_LATEST,
        latestevents: data
    }
}
export const bannerAds = (data) => {
    return {
        type: BANNER_ADS,
        banner_ads: data
    }
}
export const videoAds = (data) => {
    return {
        type: VIDEO_ADS,
        video_ads: data
    }
}
export const vlogs = (data) => {
    return {
        type: VLOGS,
        vlogs: data
    }
}
export const allMovies = (data) => {
    // console.log("All Movies Info", data);
    return {
        type: MOVIES_INFO,
        movies: data
    }
}
export const allSeries = (data) => {
    // console.log("All Series Info", data);
    return {
        type: SERIES_INFO,
        series: data
    }
}
export const notification = (data) => {
    // console.log("show notiifcation", data);
    return {
        type: NOTIFICATION,
        notification: data
    }
}
export const allWishlist = (data) => {
    return {
        type: WISHLIST,
        wishlist: data
    }
}
export const wifiInfo = (data) => {
    // console.log("show wifi info", data);
    return {
        type: WIFI_INFO,
        wifi: data
    }
}

export const setDisplayedAds = (data) => {
    return {
        type: DISPLAYED_ADS,
        displayedAds: data
    }
}

export const setCurrentIndex = (data) => {
    return {
        type: CURRENT_INDEX,
        currentIndex: data
    }
}

export const setVideoDisplayedAds = (data) => {
    return {
        type: VIDEO_ADS_DISPLAYED,
        displayedVideoAds: data
    }
}

export const setVideoCurrentIndex = (data) => {
    return {
        type: CURRENT_VIDEO_INDEX,
        currentVideoAdIndex: data
    }
}

export const setLastAdLoggedTime = (data) => {
    return {
        type: LAST_AD_LOGGED_TIME,
        lastAdLoggedTime: data
    }
}