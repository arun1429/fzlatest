import React, { Component } from "react";
import { View, Image, ScrollView, ImageBackground, Keyboard, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Container, Content, Form, Card, CardItem, Button, Item, Input, Label, Text, Icon, Body, Header, Left, Right } from 'native-base';
import Orientation from 'react-native-orientation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HttpRequest from '../../../utils/HTTPRequest';
import { connect } from "react-redux";
import { userInfo, loginToken } from "../../../Redux/Actions/Actions";
import { bindActionCreators } from "redux";
//Components
import StatusBar from '../../../components/StatusBar/'
import BottomLine from '../../../components/BottomHorizontalLine/'
import Alerts from '../../../components/Alerts/'
//Styles
import styles from "./styles";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitPhone = this.onSubmitPhone.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitRepeatPassword = this.onSubmitRepeatPassword.bind(this);

    this.onAccessoryPress1 = this.onAccessoryPress1.bind(this);
    this.onAccessoryPress2 = this.onAccessoryPress2.bind(this);

    this.nameRef = this.updateRef.bind(this, 'name');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.phoneRef = this.updateRef.bind(this, 'phone');
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.repeatPassRef = this.updateRef.bind(this, 'repeatPass');

    this.renderPasswordAccessory1 = this.renderPasswordAccessory1.bind(this);
    this.renderPasswordAccessory2 = this.renderPasswordAccessory2.bind(this);

    this.state = {
      isLoading: false,
      name: "",
      email: "",
      phone: "",
      password: "",
      repeatPass: "",
      userInfo: null,
      loginToken: null,
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      secureTextEntry1: true,
      secureTextEntry2: true,
    };
  }

  componentDidMount () {
    Orientation.lockToPortrait();
  }

  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }
    this.setState({ errors });
  }

  onChangeText(text) {
    ['name', 'email', 'phone', 'password','repeatPass']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onAccessoryPress1() {
    this.setState(({ secureTextEntry1 }) => ({ secureTextEntry1: !secureTextEntry1 }));
  }

  onAccessoryPress2() {
    this.setState(({ secureTextEntry2 }) => ({ secureTextEntry2: !secureTextEntry2 }));
  }

  onSubmitName() {
    this.email.focus();
  }

  onSubmitEmail() {
    this.phone.focus();
  }

  onSubmitPhone() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.repeatPass.focus();
   
  }

  onSubmitRepeatPassword() {
    this.repeatPass.blur();
    this.onSubmit();
  }

  onSubmit() {
    let errors = {};
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    ['name', 'email', 'phone', 'password','repeatPass']
      .forEach((name) => {
        let value = this.state[name];

        if (!value) {
          errors[name] = 'Should not be empty';
        } 
        else {
          if ('phone' === name && value.length < 10) {
            errors[name] = 'The phone must be between 9 and 10 digits.';
          } else if ('password' === name && value.length < 8) {
            errors[name] = 'The password must be of atleast 8 characters.';
          } else if ('repeatPass' === name && value.length < 8) {
            errors[name] = 'The password must be of atleast 8 characters.';
          } else if('email' === name && reg.test(value) == false){
            errors[name] = 'Invalid Email Address Format.';
          } else if('repeatPass' === name && value !== this.state.password){
            errors[name] = 'Password did not match.';
          }
        }
      });

    this.setState({ errors });
    if(Object.entries(errors).length === 0){
      this.onSignupPressed();
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  renderPasswordAccessory1() {
    let { secureTextEntry1 } = this.state;

    let name = secureTextEntry1?
      'visibility':
      'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={'#ff0000'}
        onPress={this.onAccessoryPress1}
        suppressHighlighting={true}
      />
    );
  }

  renderPasswordAccessory2() {
    let { secureTextEntry2 } = this.state;

    let name = secureTextEntry2 ?
      'visibility':
      'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={'#ff0000'}
        onPress={this.onAccessoryPress2}
        suppressHighlighting={true}
      />
    );
  }

  // Signup Through Api
  onSignupPressed = () => {
    let { name, email, phone, password, repeatPass } = this.state;
      
    this.setState({ isLoading: true });
      // const device_type = Platform.OS;
    let cpassword = this.state.repeatPass;

      const formData = {
          name: name,
          email: email,
          phone: phone,
          password: password,
          password_confirmation: repeatPass
      };
      HttpRequest.signUp(formData)
        .then(res => {
          this.setState({ isLoading: false });
          // console.log("signup api response ---------- ", res);
          const result = res.data;
          if (res.status == 201 && result.error == false) {
            this.notify('success','Great!',"A verification link has been sent to your email address.", true);
          } else {
            console.log("SignUp API Error : ",result);
            this.notify('danger','Oops!',result.message != undefined ? result.message : result.status, false);
          }
        })
        .catch(err => {
          this.setState({ isLoading: false });
          console.log("SignUp API Catch Exception: ",err);
          this.notify('danger','Oops!','Something Went Worng!', false);
        });
  };

  //Notification Alerts Open
  notify = (type,title,subtitle, action) => {
    this.setState({
        isNotify: true,
        title: title,
        subtitle: subtitle,
        type: type,
        action: action,
        isSecurePassword: false,
        isSecureConfirmPassword: false, 
    })
  }
  //Notification Alerts CLose
  updateNotify() {
    this.setState({
      isNotify: false
    });
  }

  render() {
    let { isLoading, errors = {}, secureTextEntry1, secureTextEntry2, name, email, phone, password, repeatPass, isNotify , title, subtitle, type, action } = this.state;
    const errorName = errors.name == undefined ? '#fff' : '#ff0000';
    const errorEmail = errors.email == undefined ? '#fff' : '#ff0000';
    const errorPhone = errors.phone == undefined ? '#fff' : '#ff0000';
    const errorPassword = errors.password == undefined ? '#fff' : '#ff0000';
    const errorRepeatPassword = errors.repeatPass == undefined ? '#fff' : '#ff0000';

    return (
        <Container style={styles.container}>
        <Header transparent >
        <StatusBar /> 
            <Left>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Signin")} style={styles.backButton}>
                <Icon type= "MaterialIcons" name='arrow-back'style={{fontSize: 25, color: '#fff'}} />
                </TouchableOpacity>
            </Left>
            <Body></Body>
            <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("IntroHelp")}>
              <Image
                style={styles.infoIcon}
                source={require('../../../../assets/icons/help.png')}
              />
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate("IntroFaq")}>
                <Image
                style={styles.infoIcon}
                source={require('../../../../assets/icons/faq.png')}
              />
            </Button>
          </Right>
        </Header>
        { isNotify &&
          <Alerts 
            show={true} 
            type={type} 
            title={title} 
            subtitle={subtitle} 
            navigation={this.props.navigation} 
            action={action} 
            onRef={ref => (this.parentReference = ref)}
            parentReference = {this.updateNotify.bind(this)}  />
        }
        <ScrollView contentContainerStyle={{ flexGrow:1, justifyContent: 'center' , alignItems:'stretch',padding: 10 }}>
            <View style={styles.cardStyle}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>Create Account</Text>
                </View>
              </View>
              <ImageBackground source={require('../../../../assets/img/auth/signIn.png')} style={styles.bg} >
                <View style={styles.cardBody}>
                  <View style={styles.formContainer}>
                  <View style={[styles.formItem, { borderColor: errorName}]}>
                    <Icon type= "MaterialIcons" name='person' style={{fontSize: 25, color: '#fff'}} />
                    <TextInput 
                      ref={this.nameRef}
                      placeholder='Provide your full name'
                      autoCapitalize='none'
                      autoCompleteType='off'
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      onSubmitEditing={this.onSubmitName}
                      returnKeyType='next'
                      value={name}
                      selectionColor={'#fff'}
                      placeholderTextColor={errorName}
                      style={[styles.inputText,{ color: errorName}]} />
                  </View>
                  {errors.name != undefined &&
                    <Text style={styles.error}>{errors.name}</Text>
                  }
                  <View style={[styles.formItem, { borderColor: errorEmail}]}>
                  <Icon type= "AntDesign" name='mail'style={{fontSize: 25, color: '#fff'}} />
                    <TextInput 
                      ref={this.emailRef}
                      placeholder='Your@email.com'
                      keyboardType='email-address' 
                      autoCompleteType='off'
                      autoCapitalize='none'
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      onSubmitEditing={this.onSubmitEmail}
                      returnKeyType='next'
                      value={email}
                      placeholderTextColor={errorEmail}
                      style={[styles.inputText,{ color: errorEmail}]} />
                  </View>
                  {errors.email != undefined &&
                    <Text style={styles.error}>{errors.email}</Text>
                  }
                  <View style={[styles.formItem, { borderColor: errorPhone}]}>
                  <Icon type= "FontAwesome" name='phone'style={{fontSize: 25, color: '#fff'}} />
                    <TextInput 
                      ref={this.phoneRef}
                      placeholder='Contact Number'
                      keyboardType="numeric"
                      autoCompleteType='off'
                      autoCapitalize='none'
                      autoCorrect={false}
                      maxLength={10}
                      enablesReturnKeyAutomatically={true}
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      onSubmitEditing={this.onSubmitPhone}
                      returnKeyType='next'
                      value={phone}
                      placeholderTextColor={errorPhone}
                      style={[styles.inputText,{ color: errorPhone}]} />
                  </View>
                  {errors.phone != undefined &&
                    <Text style={styles.error}>{errors.phone}</Text>
                  }
                  <View style={[styles.formItem, { borderColor: errorPassword}]}>
                  <Icon type= "AntDesign" name ='lock' style={{fontSize: 25, color: '#fff'}} />
                    <TextInput 
                      ref={this.passwordRef}
                      placeholder='Create password (Min. 8 char.)' 
                      secureTextEntry={secureTextEntry1}
                      allowFontScaling={false} 
                      autoCapitalize='none'
                      autoCorrect={false}
                      enablesReturnKeyAutomatically={true}
                      clearTextOnFocus={true}
                      value={password}
                      textContentType="oneTimeCode"
                      onFocus={this.onFocus}
                      onChangeText={this.onChangeText}
                      onSubmitEditing={this.onSubmitPassword}
                      placeholderTextColor={errorPassword} 
                      style={[styles.inputText,{ color: errorPassword}]}/>
                    {this.renderPasswordAccessory1()}
                  </View>
                  { errors.password != undefined &&
                    <Text style={styles.error}>{errors.password}</Text>
                  }
                  <View style={[styles.formItem, { borderColor: errorRepeatPassword}]}>
                  <Icon type= "AntDesign" name ='lock' style={{fontSize: 25, color: '#fff'}} />
                    <TextInput 
                        ref={this.repeatPassRef}
                        placeholder='Re-type Password' 
                        secureTextEntry={secureTextEntry2}
                        allowFontScaling={false} 
                        autoCapitalize='none'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        clearTextOnFocus={true}
                        value={repeatPass}
                        selectionColor={'#fff'}
                        onFocus={this.onFocus}
                        textContentType="oneTimeCode"
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitRepeatPassword}
                        placeholderTextColor={errorRepeatPassword} 
                        style={[styles.inputText,{ color: errorRepeatPassword}]}/>
                      {this.renderPasswordAccessory2()}
                  </View>
                  { errors.repeatPass != undefined &&
                    <Text style={styles.error}>{errors.repeatPass}</Text>
                  }
                  <Button style={styles.loginBtn} onPress={this.onSubmit}>
                    { this.state.isLoading == true  && <ActivityIndicator size='large' color='#fff' /> }
                    { this.state.isLoading == false &&
                      <Text allowFontScaling={false} style={styles.boldText}>SIGN UP</Text>
                    }  
                  </Button>
                  </View>
                
                </View>
                <View transparent style={styles.cardFooter}>
                    <Text style={styles.cardFooterText}>Already have an account? <Label style={styles.labelBold} onPress={() => this.props.navigation.navigate("Signin")}> Login! </Label> </Text>
                </View>
              </ImageBackground>
           </View>
        </ScrollView>
        <BottomLine />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch)
  };
};

export default connect(
  mapDispatchToProps
)(Signup);
