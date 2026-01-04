import axios from 'axios';

const liveUrl = 'https://fz.freizeitmedia.com/api';
// const liveUrl = 'https://e3a4-14-140-115-125.ngrok-free.app/api';

export default {
  // User Install Count
  usersInstall(formData) {
    // console.log("LOGIN", formData);
    return axios.post(`${liveUrl}/users`, formData);
  },
  // Place Order API
  placeOrder(formData) {
    console.log('place Order', formData);
    return axios.post(`${liveUrl}/orderplace`, formData);
  },

  // Create order on
  createOrderRazarpay(formData) {
    console.log('create  Order data', formData);
    return axios.post(`${liveUrl}/ordergernaterazorpay`, formData);
  },

  // Get Prder Status
  getOrderStatus(formData, USER_TOKEN) {
    console.log('update  Order status ', formData);
    return axios.post(`${liveUrl}/orderstatusgetnew`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  // App Maintenance Check
  checkMaintenance() {
    return axios.post(`${liveUrl}/checkMaintenance`);
  },
  // App version Check
  appVersionCheck(formData) {
    // console.log("App Version", formData);
    return axios.post(`${liveUrl}/appVersionCheck`, formData);
  },
  // Registration of New User
  signUp(formData) {
    // console.log("SIGN UP", formData);
    return axios.post(`${liveUrl}/register`, formData);
  },
  // Login Existing User
  login(formData) {
    // console.log("LOGIN", formData);
    return axios.post(`${liveUrl}/login`, formData);
  },
  // Social Login
  loginSocial(formData) {
    console.log(' SOCIAL LOGIN', formData);
    return axios.post(`${liveUrl}/loginsocial2`, formData);
  },
  // Logout Existing User
  logout(USER_TOKEN) {
    // console.log("LOGOUT", USER_TOKEN);
    return axios.get(`${liveUrl}/user/logout`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  // Forget Password
  forgotPassword(formData) {
    // console.log("FORGOT PASSWORD", formData);
    return axios.post(`${liveUrl}/forget-password`, formData);
  },

  viewCount(formData) {
    // console.log("FORGOT PASSWORD", formData);
    return axios.post(`${liveUrl}/Viewse`, formData);
  },

  /*------------------------------------ Home Screen --------------------------------------*/
  // Get Plans
  getPlans(USER_TOKEN) {
    console.log('Token', USER_TOKEN);
    return axios.get(`${liveUrl}/plans/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  // Get Order History
  getOrderHistory(USER_TOKEN) {
    // console.log('Token', USER_TOKEN);
    return axios.get(`${liveUrl}/user/userallorderdata`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  // Get Movies languages
  getMoviesLanguages(USER_TOKEN) {
    // console.log('Token', USER_TOKEN);
    return axios.get(`${liveUrl}/movie/getmovieslangues`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  // Get Movies by languages
  getMoviesByLanguages(USER_TOKEN, LANGUAGE) {
    // console.log('Token', USER_TOKEN, LANGUAGE);
    return axios.get(`${liveUrl}/movie/getmoviesbylanguage?language=${LANGUAGE}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get ads for Home Screen
  getAdvertisement(USER_TOKEN) {
    // console.log('Token', USER_TOKEN);
    return axios.get(`${liveUrl}/adds`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Main Slider Images for Home Screen
  getSlider(USER_TOKEN) {
    console.log('Token', USER_TOKEN);
    return axios.get(`${liveUrl}/sliders`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Recently Watched Movies or Series
  getRecentlyWatched(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/watchlist/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  checkUser(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/user/userbundelcheck`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  getTvTokenList(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/user/get-detail`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Live Event content
  getLiveEvent(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/user/live-streaming`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  
  },

  getBannerAds(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/ads/banner/list`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  getVideoAds(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/ads/video/list`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Exclusive content
  getExclusiveVideo(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/movie/exclusivevideo`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Exclusive content
  getEclusiveNew(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/user/exclusivevideonew`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Exclusive content Bundle
  getEclusiveBundle(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/movie/bundelmovies`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  postUpdateToken(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN)
    return axios.post(`${liveUrl}/user/adddevicetoken`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Exclusive content Bundle New
  getEclusiveBundleNew(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/user/bundelmoviesnew`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Recently Watched Movies or Series
  getGaming(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/gaming/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Recently Watched Movies or Series
  getEntertainment(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/entertainment/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Movies for Movies Section
  getMovies(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/movie/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Series for Series Section
  getSeries(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/series/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Documentaries
  getDocumentaries(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/genres/documentry`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Coming Soon Movies or Series
  getComingSoon(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/coming-soon/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Trending Now
  getTrendingNow(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/trending/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Vlogs
  getVlogs(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/genres/vlog`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  // Get Latest Movies/Series for Home Screen
  getLatestRelease(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/movie/latest`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  /*------------------------------------ Header Component --------------------------------------*/
  //Get All Genres
  getGenres(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/genres/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get All Movies of Genres
  getGenresAllMovies(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/genres/all-movie`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Specific Movies of Genres
  getGenresSpecificMovies(USER_TOKEN, ID) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/genres/movie/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get All Series of Genres
  getGenresAllSeries(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/genres/all-series`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Specific Series of Genres
  getGenresSpecificSeries(USER_TOKEN, ID) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/genres/series/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  /*------------------------------------ Detail Screen --------------------------------------*/

  getAllContent(USER_TOKEN, ID) {
    // console.log('Token', ID);
    return axios.get(`${liveUrl}/genres/getallcategory/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Details of a Movie
  getMovieDetails(USER_TOKEN, ID) {
    // console.log('Token', USER_TOKEN, ID);
    return axios.get(`${liveUrl}/movie/show/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Details of a Movie
  getUserMovieDetails(USER_TOKEN, ID) {
    // console.log('Token & id ', USER_TOKEN, ID);
    return axios.get(`${liveUrl}/user/showmovie/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  getTVMovieDetails(USER_TOKEN, ID) {
    // console.log('Token & id ', USER_TOKEN, ID);
    return axios.get(`${liveUrl}/user/exclusivevideonewshow_tv/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Exclusive Details of a Movie
  getExclusiveDetails(USER_TOKEN, ID) {
    // console.log('Exclusive token and id ', USER_TOKEN, ID);
    return axios.get(`${liveUrl}/user/exclusivevideonewshow/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Related Movie
  getRelatedMovies(USER_TOKEN, ID) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/movie/more-like/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Details of a Series
  getSeriesDetails(USER_TOKEN, ID) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/series/show/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Get Details of a Series by user details
  getUserSeriesDetails(USER_TOKEN, ID) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/user/showseries/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Get Related Series
  getRelatedSeries(USER_TOKEN, ID) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/series/more-like/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Add Movie or Series to a wishlist
  addToWishlist(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN);
    return axios.post(`${liveUrl}/wishlist/store`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  getAllBundleContent(USER_TOKEN, Id) {
    console.log({Id, USER_TOKEN});
    return axios.post(`${liveUrl}/user/usercheckbundelmoviesbyid`, {bundel_id: Id}, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  addToTvToken(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN);
    return axios.post(`${liveUrl}/user/add-tv-token`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  updateTvToken(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN);
    return axios.post(`${liveUrl}/user/update-tv-token`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  deleteTvToken(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN);
    return axios.post(`${liveUrl}/user/delete-tv-token`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Remove Movie or Series from the wishlist
  removeFromWishlist(USER_TOKEN, ID) {
    return axios.get(`${liveUrl}/wishlist/destroy/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Store downloaded data of the app storage by user on to the server
  downloadSpecificVideo(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN)
    return axios.post(`${liveUrl}/download/store`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  getComingSoonDetails(USER_TOKEN, ID) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/coming-soon/show/${ID}`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  /*------------------------------------ Search Screen --------------------------------------*/
  //Get all the search results as per keyword specified by user
  getSearchResults(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN)
    return axios.post(`${liveUrl}/search`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  /*------------------------------------ Wishlist Screen --------------------------------------*/
  //Get list of all movies or Series added to the wishlist by user
  getWishlists(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/wishlist/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  /*------------------------------------ Download Screen --------------------------------------*/
  //Get list of all movies or Series downloaded to the app storage by user
  getDownloads(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/download/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Delete Movie or Series from the Download list & app storage
  deleteDownloads(USER_TOKEN, formData) {
    // console.log("FORMDATA",formData)
    return axios.post(`${liveUrl}/download/destroy`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  //Delete multiple  Movie or Series from the Download list & app storage
  deleteDownloadsAll(USER_TOKEN, formData) {
    // console.log("FORMDATA",formData)
    return axios.post(`${liveUrl}/download/deleteall`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  /*------------------------------------ Profile Screen --------------------------------------*/
  //Get User Information
  getUserInfromation(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/user/get-detail`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Update User Profile
  updatePassword(formData, USER_TOKEN) {
    // console.log("Update password", formData);
    return axios.post(`${liveUrl}/user/change-password`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  /*------------------------------------ Settings Screen --------------------------------------*/
  //Get All Setting info
  getSettings(USER_TOKEN) {
    // console.log("Token", USER_TOKEN)
    return axios.get(`${liveUrl}/setting/all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Update Setting
  updateSettings(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN)
    return axios.post(`${liveUrl}/setting/store`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
  //Delete All Movie or Series from the Download list & app storage
  deleteAllDownloads(USER_TOKEN) {
    return axios.get(`${liveUrl}/download/destroy-all`, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },

  /*------------------------------------ Settings Screen --------------------------------------*/
  addToWatchlist(USER_TOKEN, formData) {
    // console.log("Token", USER_TOKEN)
    return axios.post(`${liveUrl}/watchlist/store`, formData, {headers: {Authorization: 'Bearer '.concat(USER_TOKEN)}});
  },
};
