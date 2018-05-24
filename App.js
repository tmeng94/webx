import React from 'react';
import {StyleSheet, Text, TextInput, Button, View, Clipboard} from 'react-native';
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
            pwd1: "精神焕发",
            pwd2: "防冷涂的蜡",
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
        if (!decTxt) decTxt = "很抱歉，我不知道你在说什么。";
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
            <View style={styles.container}>
                <Text>你的脸怎么红了？</Text>
                <WebxInput value={this.state.pwd1} onChangeText={(text) => {
                    this.setState({
                        pwd1: text,
                    }, () => this.updatePlainText(this.state.cipherText));

                }}/>
                <Text>怎么又黄了？</Text>
                <WebxInput value={this.state.pwd2} onChangeText={(text) => {
                    this.setState({
                        pwd2: text,
                    }, () => this.updatePlainText(this.state.cipherText));
                }}/>
                <View style={styles.inlineContainer}>
                    <Text style={styles.inlineComponent}>微不信：</Text>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.copy('cipherText')}
                            title="复制"
                        />
                    </View>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.paste('cipherText', true)}
                            title="粘贴"
                        />
                    </View>
                </View>
                <WebxMultilineInput value={this.state.cipherText} onChangeText={this.updatePlainText}/>
                <View style={styles.inlineContainer}>
                    <Text style={styles.inlineComponent}>信不信由你：</Text>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.copy('plainText')}
                            title="复制"
                        />
                    </View>
                    <View style={styles.inlineComponent}>
                        <Button
                            onPress={() => this.paste('plainText', false)}
                            title="粘贴"
                        />
                    </View>
                </View>
                <WebxMultilineInput value={this.state.plainText} onChangeText={this.updateCipherText}/>
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
