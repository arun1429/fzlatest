import React, {Component} from 'react';
import {View, Image, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator, TextInput, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Container, Button, Label, Text, Icon, Body, Header, Left, Right} from 'native-base';
import Orientation from 'react-native-orientation';
import {hideNavigationBar, showNavigationBar} from 'react-native-navigation-bar-color';
import {EventRegister} from 'react-native-event-listeners';

//API
import HttpRequest from '../../../utils/HTTPRequest';
import LocalData from '../../../utils/LocalData';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken} from '../../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//Components
import StatusBar from '../../../components/StatusBar/';
import BottomLine from '../../../components/BottomHorizontalLine/';
import Alerts from '../../../components/Alerts/';
import {appleAuth} from '@invertase/react-native-apple-authentication';
//Styles
import styles from './styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk-next';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
class Signin extends Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);

    this.emailRef = this.updateRef.bind(this, 'email');
    this.passwordRef = this.updateRef.bind(this, 'password');

    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = {
      secureTextEntry: true,
      isLoading: false,
      email: '',
      password: '',
      userInfo: null,
      loginToken: null,
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: '',
    };
  }

  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    showNavigationBar();
    Orientation.lockToPortrait();
    GoogleSignin.configure({
      scopes: ['profile'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: Platform.OS == 'ios' ? '483954169009-5qnhg4f6vgvs9flff4il2sgtv8g54oa2.apps.googleusercontent.com' : '483954169009-drvulhadgt228s05snjho8a326pc9bep.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
    });
  }
  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      appleAuth.onCredentialRevoked(async () => {
        console.log('If this function executes, User Credentials have been Revoked');
      });
    }
  }
  // Function to use Login API
  onLoginPressed = () => {
    this.setState({isLoading: true});
    let {email, password} = this.state;
    console.log('Login Credential', email, password);

    HttpRequest.login({email, password})
      .then(res => {
        this.setState({isLoading: false});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          // console.log(result);
          LocalData.setLoginToken(result.token);
          this.props.loginToken(result.token);

          //Get Info of the Logged in user
          LocalData.setUserInfo(result.detail);
          this.props.userInfo(result.detail);

          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        } else {
          this.setState({isLoading: false});
          console.log('Signin API Error : ', result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        console.log('Signin API Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
  };

  onFocus() {
    let {errors = {}} = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({errors});
  }

  onChangeText(text) {
    ['email', 'password']
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          this.setState({[name]: text});
        }
      });
  }

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({secureTextEntry: !secureTextEntry}));
  }

  onSubmitEmail() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.password.blur();
    this.onSubmit();
  }

  onSubmit() {
    let errors = {};
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    ['email', 'password'].forEach(name => {
      let value = this.state[name];

      if (!value) {
        errors[name] = 'Should not be empty';
      } else {
        if ('password' === name && value.length < 8) {
          errors[name] = 'The password must be at least 8 characters.';
        } else if ('email' === name && reg.test(value) == false) {
          errors[name] = 'Invalid Email Address Format.';
        }
      }
    });

    this.setState({errors});
    if (Object.entries(errors).length === 0) {
      this.onLoginPressed();
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  renderPasswordAccessory() {
    let {secureTextEntry} = this.state;

    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    return <MaterialIcon size={24} name={name} color={'#ff0000'} onPress={this.onAccessoryPress} suppressHighlighting={true} />;
  }

  //Notification Alerts Open
  notify = (type, title, subtitle, action) => {
    this.setState({
      isNotify: true,
      title: title,
      subtitle: subtitle,
      type: type,
      action: action,
      isSecure: false,
    });
  };
  //Notification Alerts CLose
  updateNotify() {
    this.setState({
      isNotify: false,
    });
  }

  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,email',
      },
    };
    const profileRequest = new GraphRequest('/me', {token, parameters: PROFILE_REQUEST_PARAMS}, (error, user) => {
      if (error) {
        console.log('login info has error: ' + error);
      } else {
        console.log('user  : ' + JSON.stringify(user));
        const emailmodified = user.email === undefined ? user.id + '@gmail.com' : user.email;
        console.log('login with modifoed email : ' + emailmodified);
        this.setState({isLoading: true});
        const dataSend = {
          email: emailmodified,
          phone: '1234567890',
          password: user.id,
          login_type: 'Facebook',
          name: user.name,
        };
        console.log('dataSend : ' + JSON.stringify(dataSend));
        HttpRequest.loginSocial(dataSend)
          .then(res => {
            this.setState({isLoading: false});
            const result = res.data;
            if (res.status == 200 && result.error == false) {
              console.log(result);
              LocalData.setLoginToken(result.token);
              this.props.loginToken(result.token);

              //Get Info of the Logged in user
              LocalData.setUserInfo(result.detail);
              this.props.userInfo(result.detail);

              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            } else {
              this.setState({isLoading: false});
              console.log('Signin API Error : ', result);
              this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
            }
          })
          .catch(err => {
            this.setState({isLoading: false});
            console.log('Signin API Catch Exception: ', err);
            this.notify('danger', 'Oops!', 'Something Went Worng!', false);
          });
        // console.log('result:', user);
      }
    });
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  FbLoginButton = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.setLoginBehavior('web_only');
    if (AccessToken.getCurrentAccessToken() != null) {
      LoginManager.logOut();
      LoginManager.logInWithPermissions(['public_profile']).then(
        login => {
          if (login.isCancelled) {
            console.log('Login cancelled');
            alert('Login cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              const accessToken = data.accessToken.toString();
              this.getInfoFromToken(accessToken);
            });
          }
        },
        error => {
          console.log('Login fail with error: ' + error);
        },
      );
    }
  };

  googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const googleUser = await GoogleSignin.signIn();
      console.log('googleUser : ' + JSON.stringify(googleUser));

      this.setState({isLoading: true});
      const dataSend = {
        email: googleUser.user.email,
        phone: '1234567890',
        login_type: 'Google',
        password: googleUser.user.id,
        name: googleUser.user.name,
      };
      console.log('dataSend : ' + JSON.stringify(dataSend));
      HttpRequest.loginSocial(dataSend)
        .then(res => {
          this.setState({isLoading: false});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            console.log(result);
            LocalData.setLoginToken(result.token);
            this.props.loginToken(result.token);

            //Get Info of the Logged in user
            LocalData.setUserInfo(result.detail);
            this.props.userInfo(result.detail);

            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          } else {
            this.setState({isLoading: false});
            console.log('Signin API Error : ', result);
            this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
          }
        })
        .catch(err => {
          this.setState({isLoading: false});
          console.log('Signin API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } catch (e) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled google login');
      } else if (e.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play service not available');
      } else {
        console.log('Unknown google sign in error' + JSON.stringify(e));
      }
    }
  };

  onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    console.log('cred : ' + JSON.stringify(credentialState));
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      console.log('appleAuthRequestResponse : ' + JSON.stringify(appleAuthRequestResponse));

      try {
        this.setState({isLoading: true});
        var dataSendAll = '';
        if (appleAuthRequestResponse.realUserStatus == 2) {
          var name = appleAuthRequestResponse.fullName.givenName + ' ' + appleAuthRequestResponse.fullName.familyName;
          const dataSend = {
            email: appleAuthRequestResponse.email,
            phone: '1234567890',
            password: appleAuthRequestResponse.user,
            login_type: 'Apple',
            name: name,
          };
          dataSendAll = dataSend;
        } else {
          const dataSend = {
            email: '',
            phone: '1234567890',
            password: appleAuthRequestResponse.user,
            login_type: 'Apple',
            name: '',
          };
          dataSendAll = dataSend;
        }

        console.log('dataSendAll : ' + JSON.stringify(dataSendAll));
        HttpRequest.loginSocial(dataSendAll)
          .then(res => {
            this.setState({isLoading: false});
            const result = res.data;
            if (res.status == 200 && result.error == false) {
              console.log(result);
              LocalData.setLoginToken(result.token);
              this.props.loginToken(result.token);

              //Get Info of the Logged in user
              LocalData.setUserInfo(result.detail);
              this.props.userInfo(result.detail);

              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            } else {
              this.setState({isLoading: false});
              console.log('Signin API Error : ', result);
              this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
            }
          })
          .catch(err => {
            this.setState({isLoading: false});
            console.log('Signin API Catch Exception: ', err);
            this.notify('danger', 'Oops!', 'Something Went Worng!', false);
          });
      } catch (e) {
        console.log('Unknown apple sign in error' + JSON.stringify(e));
      }
    }
  };
  render() {
    let {isLoading, errors = {}, secureTextEntry, email, password, isNotify, title, subtitle, type, action} = this.state;
    const errorEmail = errors.email == undefined ? '#fff' : '#ff0000';
    const errorPassword = errors.password == undefined ? '#fff' : '#ff0000';

    return (
      <Container style={styles.container}>
        <StatusBar hidden={true} />
        <Header transparent>
          <StatusBar />
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
              <Icon type="MaterialIcons" name="arrow-back" style={{fontSize: 25, color: '#fff'}} />
            </TouchableOpacity>
          </Left>
          <Body></Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate('IntroHelp')}>
              <Image style={styles.infoIcon} source={require('../../../../assets/icons/help.png')} />
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate('IntroFaq')}>
              <Image style={styles.infoIcon} source={require('../../../../assets/icons/faq.png')} />
            </Button>
          </Right>
        </Header>
        {isNotify && <Alerts show={isNotify} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
        <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', padding: 10}}>
          <View style={styles.cardStyle}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderContent}>
                <Text style={styles.cardTitle}>LOGIN</Text>
              </View>
            </View>
            <ImageBackground source={require('../../../../assets/img/auth/signIn.png')} style={styles.bg}>
              <View style={styles.cardBody}>
                <View style={{width: '90%', flexDirection: 'column', margin: '5%'}}>
                  <View style={[styles.formItem, {borderColor: errorEmail}]}>
                    <Icon type="AntDesign" name="mail" style={{fontSize: 25, color: '#fff'}} />
                    <TextInput ref={this.emailRef} placeholder="Your@email.com" keyboardType="email-address" autoCompleteType="off" autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} onFocus={this.onFocus} onChangeText={this.onChangeText} onSubmitEditing={this.onSubmitEmail} returnKeyType="next" value={email} placeholderTextColor={errorEmail} style={[styles.inputText, {color: errorEmail}]} />
                  </View>
                  {errors.email != undefined && <Text style={styles.error}>{errors.email}</Text>}
                  <View style={[styles.formItem, {borderColor: errorPassword}]}>
                    <Icon type="AntDesign" name="lock" style={{fontSize: 25, color: '#fff'}} />
                    <TextInput ref={this.passwordRef} placeholder="Password" secureTextEntry={secureTextEntry} allowFontScaling={false} autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} clearTextOnFocus={true} value={password} onFocus={this.onFocus} onChangeText={this.onChangeText} onSubmitEditing={this.onSubmitPassword} placeholderTextColor={errorPassword} style={[styles.inputText, {color: errorPassword}]} />
                    {this.renderPasswordAccessory()}
                    {/* <TouchableOpacity onPress={() => {this.setState({ isSecure: !this.state.isSecure})}}>
                      <Icon active ios={!isSecure ? 'ios-eye' : 'ios-eye-off'} android={!isSecure ? 'md-eye' : 'md-eye-off'} style={{fontSize: 25, color: '#fff'}}/>
                  </TouchableOpacity> */}
                    {/* ios-eye-off */}
                  </View>
                  {errors.password != undefined && <Text style={styles.error}>{errors.password}</Text>}
                  <Button block danger style={styles.loginBtn} onPress={this.onSubmit}>
                    {isLoading && <ActivityIndicator size="large" color="#fff" />}
                    {!isLoading && <Text style={styles.boldText}>LOGIN</Text>}
                  </Button>
                  <TouchableOpacity style={styles.forgotPassword} onPress={() => this.props.navigation.navigate('RecoverPassword')}>
                    <Text style={styles.cardFooterText}>Forget password?</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                    <TouchableOpacity onPress={() => this.googleLogin()}>
                      <Image source={require('../../../components/images/Google-plus.png')} style={{height: 35, width: 35, alignSelf: 'center'}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.FbLoginButton()}>
                      <Image source={require('../../../components/images/facebook-logo.png')} style={{height: 40, width: 40, marginLeft: 15}} />
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                      <TouchableOpacity onPress={() => this.onAppleButtonPress()}>
                        <Image source={require('../../../components/images/apple_icon.png')} style={{height: 40, width: 40, marginLeft: 15}} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text style={styles.cardFooterText}>
                    Don't have an account?{' '}
                    <Label style={styles.labelBold} onPress={() => this.props.navigation.navigate('Signup')}>
                      {' '}
                      Sign up!{' '}
                    </Label>{' '}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
        {/* <BottomLine /> */}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
