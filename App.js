/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ReactNativeBiometrics from 'react-native-biometrics';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      biometricsSupported:0,
      biometricArray:"",
      acceptedBiometric:false
    }
  }

  componentDidMount(){
    ReactNativeBiometrics.isSensorAvailable()
    .then((resultObject) => {
      const { available, biometryType } = resultObject
      let val = 0;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log('TouchID is supported')
        val = 1
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported')
        val = 2
      } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        console.log('Biometrics is supported')
        val = 3
      } else {
        console.log('Biometrics not supported')
        val = 0
      }
      this.setState({biometricsSupported:val},()=>console.log(this.state.biometricsSupported))
    })
    ReactNativeBiometrics.createKeys('Confirm fingerprint')
    .then((resultObject) => {
      const { publicKey } = resultObject
      console.log("publicKey",publicKey)
      this.setState({biometricArray:publicKey});
      console.log("publicKey",publicKey == this.state.biometricArray)

    })
  }

  createBiometric(){
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    let payload = epochTimeSeconds + 'some message'
     
    ReactNativeBiometrics.createSignature({
      promptMessage: 'Sign in',
      payload: payload
    })
    .then((resultObject) => {
      const { success, signature } = resultObject
    
      if (success) {
        console.log(signature)
        console.log(this.state.biometricArray)
        this.setState({acceptedBiometric:true});
        if(signature == this.state.biometricArray){
          console.log("firma aceptada");
        }else{
          console.log("firma no aceptada",signature == this.state.biometricArray);

        }
      }
    })
  }

  biometrics(){
    if(this.state.biometricArray !== ""){
      console.log("biom exists",this.state.biometricArray);
    }else{
      console.log("biom no exists");
      if(this.state.biometricsSupported == 1 || this.state.biometricsSupported == 3){
        
      }
    }
  }
  
  render() {
    return (
      <SafeAreaView style={{backgroundColor: Colors.darker}}>
        <StatusBar barStyle={'dark-content'} />
          <Header />
          {this.state.acceptedBiometric ? 
            <View
            style={{ padding:20, paddingTop:100,backgroundColor: Colors.darker}}>
            <Text style={{color:"#FFF"}}>Entraste!</Text>
          </View>
          : 
            <View
              style={{ padding:20, paddingTop:100,backgroundColor: Colors.darker}}>
              <Button onPress={()=>this.createBiometric()} title="Login"  color="#841584"/>
            </View>
          }
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
