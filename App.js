import React from 'react';
import {StyleSheet, Text, TextInput, Button, View, ScrollView, Clipboard} from 'react-native';
import CryptoJS from 'crypto-js';
import autobind from 'autobind-decorator'

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
    constructor(props) {
        super(props);
        this.state = {
            pwd1: "antidisestablishmentarianism",
            pwd2: "honorificabilitudinitatibus",
            pwd3: "WeiBuXin @_@ 微不信",
            cipherText: "",
            plainText: ""
        };
    }

    @autobind
    encrypt(text) {
        return 'Webx!' + CryptoJS.AES.encrypt(text, this.state.pwd1 + '!' + this.state.pwd2 + '!' + this.state.pwd3);
    }

    @autobind
    decrypt(text) {
        if (text.startsWith('Webx!')) {
            try {
                let dec = CryptoJS.AES.decrypt(text.slice(5), this.state.pwd1 + '!' + this.state.pwd2 + '!' + this.state.pwd3);
                return dec.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    }

    @autobind
    updatePlainText(cipherText) {
        let decTxt = this.decrypt(cipherText);
        if (!decTxt) decTxt = "Sorry, I can't decrypt your text.";
        this.setState({
            cipherText: cipherText,
            plainText: cipherText ? decTxt : "",
        })
    }

    @autobind
    updateCipherText(plainText) {
        this.setState({
            cipherText: plainText ? this.encrypt(plainText) : "",
            plainText: plainText,
        })
    }
    
    @autobind
    async copy(field) {
        await Clipboard.setString(this.state[field]);
    }

    @autobind
    async paste(field, isCipher) {
        const content = await Clipboard.getString();
        this.setState({[field]: content});
        if (isCipher) {
            this.updatePlainText(content);
        } else {
            this.updateCipherText(content)
        }
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text>Encryption Key 1</Text>
                <WebxInput value={this.state.pwd1} onChangeText={(text) => {
                    this.setState({
                        pwd1: text,
                    }, () => this.updatePlainText(this.state.cipherText));

                }}/>
                <Text>Encryption Key 2</Text>
                <WebxInput value={this.state.pwd2} onChangeText={(text) => {
                    this.setState({
                        pwd2: text,
                    }, () => this.updatePlainText(this.state.cipherText));
                }}/>
                <View style={styles.inlineContainer}>
                    <Text style={styles.inlineComponent}>Encrypted Text</Text>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.copy('cipherText')}
                            title="Copy"
                        />
                    </View>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.paste('cipherText', true)}
                            title="Paste"
                        />
                    </View>
                </View>
                <WebxMultilineInput value={this.state.cipherText} onChangeText={this.updatePlainText}/>
                <View style={styles.inlineContainer}>
                    <Text style={styles.inlineComponent}>Plain Text</Text>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.copy('plainText')}
                            title="Copy"
                        />
                    </View>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.paste('plainText', false)}
                            title="Paste"
                        />
                    </View>
                </View>
                <WebxMultilineInput value={this.state.plainText} onChangeText={this.updateCipherText}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    input: {
        width: 240,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    multilineInput: {
        height: 80,
    },
    inlineContainer: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginVertical: 5
    },
    inlineComponent: {
        alignSelf: 'center',
        marginHorizontal: 5
    }
});
