import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const App = () => {
  const [userData, setUserData] = useState({});
  const [status, setStatus] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '397564343881-ua40uifu6f41ii75smjopr6qus7n33et.apps.googleusercontent.com',
    });
  }, []);

  const googleSignIn = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      await setStatus(false);

      console.log('Sign out success !');
      // Google Account disconnected from your app.
      // Perform clean-up actions, such as deleting data associated with the disconnected account.
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          googleSignIn()
            .then(res => {
              console.log(res);
              setUserData(res.user);
              setStatus(true);
              console.log('Login with google success !');
            })
            .catch(error => console.log(error))
        }
        style={styles.btnBox}>
        <Text style={styles.title}>Google Login</Text>
      </Pressable>

      <View>
        <Text style={styles.text}>UID: {status ? userData.uid : ''}</Text>
        <Text style={styles.text}>
          Name: {status ? userData.displayName : ''}
        </Text>
        <Text style={styles.text}>Email: {status ? userData.email : ''}</Text>
      </View>

      <Pressable onPress={googleSignOut} style={styles.btnBox}>
        <Text style={styles.title}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#000000',
  },
  btnBox: {
    paddingHorizontal: 20,
    backgroundColor: 'coral',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default App;
