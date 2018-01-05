import React from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import CryptoJS from 'crypto-js';

class WebxInput extends React.Component {
  render() {
    return (
      <TextInput
        {...this.props}
        style={styles.input}
        autoCorrect={false}
        underlineColorAndroid='transparent'
      />
    );
  }
}

class WebxMultilineInput extends React.Component {
  render() {
    return (
      <TextInput
        {...this.props}
        style={[styles.input, styles.multilineInput]}
        multiline={true}
        autoCorrect={false}
        underlineColorAndroid='transparent'
        blurOnSubmit={false}
      />
    );
  }
}

export default class App extends React.Component {
  constructor(props){ 
    super(props);
    this.state = {
      pwd1: "antidisestablishmentarianism",
      pwd2: "honorificabilitudinitatibus",
      pwd3: "WeiBuXin @_@ 微不信",
      cipherText: "",
      plainText: ""
    };
  }

  encrypt(text) {
    return 'Webx!' + CryptoJS.AES.encrypt(text, this.state.pwd1 + '!' + this.state.pwd2 + '!' + this.state.pwd3);
  }

  decrypt(text) {
    if (text.startsWith('Webx!')) {
      try {
        let dec = CryptoJS.AES.decrypt(text.slice(5), this.state.pwd1 + '!' + this.state.pwd2 + '!' + this.state.pwd3);
        let res = dec.toString(CryptoJS.enc.Utf8);
        return res;
      } catch (e) {
        return null;
      }      
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Encryption Key 1</Text>
        <WebxInput value={this.state.pwd1} onChangeText={(text) => {
            this.setState({
              pwd1: text,
            }, () => {
              let decTxt = this.decrypt(this.state.cipherText);
              if (decTxt) {
                this.setState({
                  plainText: decTxt,
                });
              }
            });
            
          }} />
        <Text>Encryption Key 2</Text>
        <WebxInput value={this.state.pwd2} onChangeText={(text) => {
            this.setState({
              pwd2: text,
            }, () => {
              let decTxt = this.decrypt(this.state.cipherText);
              if (decTxt) {
                this.setState({
                  plainText: decTxt,
                });
              }
            });            
          }} />
        <Text>Encrypted Text (Paste to Decrypt)</Text>
        <WebxMultilineInput value={this.state.cipherText} onChangeText={(text) => {
            let decTxt = this.decrypt(text);
            if (!decTxt) decTxt = "Sorry, I can't decrypt your text.";
            this.setState({
              cipherText: text,
              plainText: text ? decTxt : "",
            })
          }} />
        <Text>Plain Text (Input to Encrypt)</Text>
        <WebxMultilineInput value={this.state.plainText} onChangeText={(text) => {
            this.setState({
              cipherText: text ? this.encrypt(text) : "",
              plainText: text,
            })       
          }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 240,
    borderColor: 'gray',
    borderWidth: 1
  },
  multilineInput: {
    height: 80,    
  },
});
