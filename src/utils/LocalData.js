/*
    Used To Store Data Locally On Application
*/ 
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
    setAlreadyLaunched(data) {
        return AsyncStorage.setItem('alreadyLaunched', data);
    },
    getAlreadyLaunched() {
        return AsyncStorage.getItem('alreadyLaunched');
    },
    setUserInfo(data) {
        return AsyncStorage.setItem('userInfo', JSON.stringify(data));
    },
    getUserInfo() {
        return AsyncStorage.getItem('userInfo');
    },
    setLoginToken(data){
        return AsyncStorage.setItem('loginToken', data);
    },
    getLoginToken() {
        return AsyncStorage.getItem('loginToken');
    },
    setNotification(data){
        return AsyncStorage.setItem('notification', JSON.stringify(data));
    },
    getNotification() {
        return AsyncStorage.getItem('notification');
    },
   async setDownloads(data){
        return await AsyncStorage.setItem('downloads', JSON.stringify(data));
    },
  async  getDownloads() {
        return await AsyncStorage.getItem('downloads');
    },
    setSlider(data) {
        return AsyncStorage.setItem('slider', JSON.stringify(data));
    },
    getSlider(){
        return AsyncStorage.getItem('slider');
    },
    setRecentlyWatched(data) {
        return AsyncStorage.setItem('recentlyWatched', JSON.stringify(data));
    },
    getRecentlyWatched(){
        return AsyncStorage.getItem('recentlyWatched');
    },
    setExclusive(data) {
        return AsyncStorage.setItem('exclusive', JSON.stringify(data));
    },
    getExculusive(){
        return AsyncStorage.getItem('exclusive');
    },
    setExclusiveWithToken(data) {
        return AsyncStorage.setItem('exclusiveNew', JSON.stringify(data));
    },
    getExculusiveWithToken(){
        return AsyncStorage.getItem('exclusiveNew');
    },
    setGames(data) {
        return AsyncStorage.setItem('games', JSON.stringify(data));
    },
    getGames(){
        return AsyncStorage.getItem('games');
    },
    setEntertainmentes(data) {
        return AsyncStorage.setItem('entertainment', JSON.stringify(data));
    },
    getEntertainmentes(){
        return AsyncStorage.getItem('entertainment');
    },
    setMovies(data) {
        return AsyncStorage.setItem('movies', JSON.stringify(data));
    },
    getMovies(){
        return AsyncStorage.getItem('movies');
    },
    setSeries(data) {
        return AsyncStorage.setItem('series', JSON.stringify(data));
    },
    getSeries(){
        return AsyncStorage.getItem('series');
    },
    setDocumentaries(data) {
        return AsyncStorage.setItem('documentaries', JSON.stringify(data));
    },
    getDocumentaries(){
        return AsyncStorage.getItem('documentaries');
    },
    setComingSoon(data) {
        return AsyncStorage.setItem('comingSoon', JSON.stringify(data));
    },
    getComingSoon(){
        return AsyncStorage.getItem('comingSoon');
    },
    setTrendingNow(data) {
        return AsyncStorage.setItem('trendingNow', JSON.stringify(data));
    },
    getTrendingNow(){
        return AsyncStorage.getItem('trendingNow');
    },
    setLiveEvent(data) {
        return AsyncStorage.setItem('liveEvent', JSON.stringify(data));
    },
    getLiveEvent(){
        return AsyncStorage.getItem('liveEvent');
    },
    setBannerAds(data) {
        return AsyncStorage.setItem('bannerAds', JSON.stringify(data));
    },
    getBannerAds(){
        return AsyncStorage.getItem('bannerAds');
    },
    setVideoAds(data) {
        return AsyncStorage.setItem('videoAds', JSON.stringify(data));
    },
    getVideoAds(){
        return AsyncStorage.getItem('videoAds');
    },
    setVlogs(data) {
        return AsyncStorage.setItem('vlogs', JSON.stringify(data));
    },
    getVlogs(){
        return AsyncStorage.getItem('vlogs');
    },
}