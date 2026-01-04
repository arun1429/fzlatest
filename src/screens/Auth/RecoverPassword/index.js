import React, { Component } from "react";
import { Image, ScrollView, View, ImageBackground, Keyboard, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Container, Header, Left, Right, Icon, Text, Button, Body } from 'native-base';
import Orientation from 'react-native-orientation';
import HttpRequest from '../../../utils/HTTPRequest';
import Ionicons from 'react-native-vector-icons/Ionicons';
//Components
import StatusBar from '../../../components/StatusBar/'
import BottomLine from '../../../components/BottomHorizontalLine/'
import Alerts from '../../../components/Alerts/'
//Styles
import styles from "./styles";

export default class RecoverPassword extends Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);

    this.emailRef = this.updateRef.bind(this, 'email');

    this.state = {
        isLoading: false,
        email: '',
        isNotify: false,
        title: '',
        subtitle: '',
        type: '',
        action: false
    }
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

  onSubmitEmail() {
    this.email.blur();
    this.onSubmit();
  }

  onSubmit() {
    let errors = {};
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    ['email']
      .forEach((name) => {
        let value = this.state[name];

        if (!value) {
          errors[name] = 'Should not be empty';
        } 
        else {
          if('email' === name && reg.test(value) == false){
            errors[name] = 'Invalid Email Address Format.';
          }
        }
      });

    this.setState({ errors });
    if(Object.entries(errors).length === 0){
      this.onForgotPressed();
    }
  }

  // Function for resetting the password using API
  onForgotPressed = () => {
    this.setState({ isLoading: true, notify: false })
    let { email } = this.state;

    HttpRequest.forgotPassword({"email": email})
        .then((res) => {
            this.setState({ isLoading: false })
            const result = res.data;
            if(res.status == 200 && result.error == false){
              this.notify('success','Good Job!',result.message, true);
            } else{
              console.log("Forget Password API Error : ",result);
              this.notify('danger','Oops!',result.message != undefined ? result.message : result.status, false);
            }
        })
        .catch(err => {
            this.setState({ isLoading: false })
            console.log("Forget Password API Catch Exception: ",err);
            this.notify('danger','Oops!','Something Went Worng!', false);
        })
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

 //Notification Alerts Open
  notify = (type,title,subtitle, action) => {
    this.setState({
        isNotify: true,
        title: title,
        subtitle: subtitle,
        type: type,
        action: action
    })
  }
  //Notification Alerts CLose
  updateNotify() {
    this.setState({
      isNotify: false
    });
  }

  render() {
    let { isLoading, errors = {}, email, isNotify , title, subtitle, type, action } = this.state;
    const errorEmail = errors.email == undefined ? '#fff' : '#ff0000';

    return (
        <Container style={styles.container}>
        <StatusBar /> 
        {/* Header */}
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
        <ScrollView contentContainerStyle={{ flexGrow:1, justifyContent: 'center' ,padding: 10 }}>
            <View style={styles.cardStyle}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>FORGET PASSWORD</Text>
                </View>
              </View>
              <ImageBackground source={require('../../../../assets/img/auth/signIn.png')} style={styles.bg} >
              <View style={styles.cardBody}>
              <View style={{flex:1,flexDirection:'column',justifyContent: 'space-around',alignItems: 'stretch',margin:'3%'}}>
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
                    onChangeText={(text) => this.setState({ email: text})}
                    onSubmitEditing={this.onSubmitEmail}
                    value={email}
                    returnKeyType='next'
                    placeholderTextColor={errorEmail}
                    style={[styles.inputText,{ color: errorEmail}]} />
                   
                </View>
                {errors.email != undefined &&
                <Text style={styles.error}>{errors.email}</Text>
                }
                
                <Button block danger style={styles.loginBtn} onPress={this.onSubmit}>
                  { isLoading && <ActivityIndicator size='large' color='#fff' /> }
                  { !isLoading  && <Text style={styles.boldText}>RECOVER</Text> }  
                </Button>
              </View>
            </View>
            </ImageBackground>
          </View>
          </ScrollView>
          {/* <ScrollView contentContainerStyle={{ justifyContent: 'center',padding: 10 }}>
            <Card style={styles.cardStyle}>
              <CardItem style={styles.cardHeader}>
                <Content padder contentContainerStyle={styles.cardHeaderContent}>
                  <Text style={styles.cardTitle}>FORGET PASSWORD</Text>
                </Content>
              </CardItem>
              <ImageBackground source={require('../../../../assets/img/auth/signIn.png')} style={styles.bg} >
              <CardItem style={styles.cardBody}>
                <View style={styles.formContent}>
                  <Form>
                    <Item floatingLabel style={styles.formItem}>
                      <Label style={styles.label}>Enter your Email</Label>
                      <Input 
                        style={styles.inputText} 
                        allowFontScaling={false} 
                        returnKeyType='next'
                        keyboardType='email-address' 
                        autoCapitalize='none'
                        onChangeText={(email) => (this.setState({ email }))}
                        onSubmitEditing={() => this.validate()}
                        value={this.state.email}
                      />
                    </Item>
                  </Form>
                    <Button style={styles.loginBtn} onPress={() => this.validate()}>
                      { this.state.isLoading && <ActivityIndicator size='large' color='#fff' /> }
                      { this.state.isLoading == false &&
                        <Text style={styles.boldText}>RECOVER</Text>
                      }  
                    </Button>
                </View>
            </CardItem>
            </ImageBackground>
          </Card>
          </ScrollView> */}
        <BottomLine />
      </Container>
    );
  }
}