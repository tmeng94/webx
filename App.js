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

class WebxButton extends React.Component {
  render() {
    return (
      <Button
        {...this.props}
        onPress={() => console.log('Meow')}
      />
    );
  }
}

export default class App extends React.Component {
  constructor(props){ 
    super(props);
    this.state = {
      pwd1: "精神焕发",
      pwd2: "防冷涂的蜡",
      pwd3: "WeiBuXin @_@ 微不信",
      cipherText: "",
      plainText: ""
    };
  }

  encrypt(text) {
    let enc1 = CryptoJS.AES.encrypt(text, this.state.pwd1);
    let enc2 = CryptoJS.AES.encrypt(enc1.toString(), this.state.pwd2);
    return 'Webx!' + CryptoJS.AES.encrypt(enc2.toString(), this.state.pwd3);
  }

  decrypt(text) {
    if (text.startsWith('Webx!')) {
      try {
        let dec1 = CryptoJS.AES.decrypt(text.slice(5), this.state.pwd3);
        if (!dec1) return "很抱歉，我不知道你在说什么。";
        let dec2 = CryptoJS.AES.decrypt(dec1.toString(CryptoJS.enc.Utf8), this.state.pwd2);
        if (!dec2) return "很抱歉，我不知道你在说什么。";
        let dec3 = CryptoJS.AES.decrypt(dec2.toString(CryptoJS.enc.Utf8), this.state.pwd1);
        if (!dec3) return "很抱歉，我不知道你在说什么。";
        let res = dec3.toString(CryptoJS.enc.Utf8);
        return res? res: "很抱歉，我不知道你在说什么。"
      } catch (e) {
        return "很抱歉，我不知道你在说什么。";
      }      
    } else {
      return "很抱歉，我不知道你在说什么。";
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>你的脸怎么红了：</Text>
        <WebxInput value={this.state.pwd1} onChangeText={(text) => {
            this.setState({
              pwd1: text,
            })
          }} />
        <Text>怎么又黄了：</Text>
        <WebxInput value={this.state.pwd2} onChangeText={(text) => {
            this.setState({
              pwd2: text,
            })
          }} />
        <Text>微不信：</Text>
        <WebxMultilineInput value={this.state.cipherText} onChangeText={(text) => {
            this.setState({
              cipherText: text,
              plainText: this.decrypt(text),
            })
          }} />
        <Text>信不信由你：</Text>
        <WebxMultilineInput value={this.state.plainText} onChangeText={(text) => {
            this.setState({
              cipherText: text ? this.encrypt(text) : "",
              plainText: text,
            })       
          }} />
        <WebxButton title='爱信不信' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50
    // justifyContent: 'center',
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
