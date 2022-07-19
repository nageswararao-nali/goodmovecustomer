import React from 'react'
import { StyleSheet, Button, View , Text ,TouchableOpacity ,Linking} from 'react-native'
import email from 'react-native-email'
import Hyperlink from 'react-native-hyperlink'
 
export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.contentText}>Contact us on </Text>
                <TouchableOpacity onPress={this.handleEmail}>
                                  <Text style={styles.content_Text}>admin@gogoodmove.com</Text>
                </TouchableOpacity>

            </View>
        )
    }
 
    handleEmail = () => {
        const to = ['admin@gogoodmove.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            cc: [], // string or array of email addresses
            bcc: '', // string or array of email addresses
            subject: '',
            body: ''
        }).catch(console.error)
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        //marginBottom: '3%',
    },
    contentText: {
        color: "#777",
        textAlign: 'justify',
        lineHeight: 18,
        fontSize: 16,
    },
    content_Text: {
        color: "blue",
        textAlign: 'justify',
        lineHeight: 18,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
    },
})