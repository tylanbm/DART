import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, TextInput,KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import IonButton from '../components/IonButton';

// import Firestore docs
import {
    collection,
    query,
    where,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs,
} from 'firebase/firestore';

import {
    getStorage,
    ref,
    uploadString,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage';
import { auth } from '../firebaseConfig';
import { ScrollView } from 'react-native-gesture-handler';

const db = getFirestore();


const likeImage = () => {
    console.log("You liked the image");
}

const dislikeImage = () => {
    console.log("You disliked the image");
}

const reportImage = () => {
    console.log("You reported the image");
}

const postComment = () => {
    console.log("You posted a comment");
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');




const ImageScreen = ({route, navigation}) => {
  
    //Url of image to load
    const {imageSourceToLoad, imageId} = route.params;

    //Set up storage
    const storage = getStorage();

    //User comment
    const [comment, setComment] = useState('');
    


    const [imageAuthorUsername, setImageAuthorUserName] = useState("Default");
    const [imageTitle, setImageTitle] = useState("Default");
    const [authorImageUrl, setAuthorImageUrl] = useState("Default");
    const [authorUid, setAuthorUid] = useState("Default");

    const getImageData = async (imageId) => {

        

        const docRef = doc(db, "uniqueImageNames", imageId.substring(0, imageId.indexOf('.')));
        const docSnap = await getDoc(docRef);

        console.log("ImageId:" + imageId.substring(0, imageId.indexOf('.')));

        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            setImageAuthorUserName(String(docSnap.data().imageAuthorUsername.toString()));
            setImageTitle(String(docSnap.data().imageTitle.toString()));

            const tempAuthorUid =  docSnap.data().imageAuthorUID.toString();
            //For author profile photo
            const pathReference = ref(storage, 'userProfileImages/' + tempAuthorUid);

            let temp = await getDownloadURL(pathReference);
            //console.log("Temp: " + temp);
            setAuthorImageUrl(temp);
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }
  
    useEffect(() => {
        getImageData(imageId);
    }, []);
  

  

  //console.log("Got ID:" + imageId);
  
  return (
      <KeyboardAvoidingView behavior="padding">
          <ScrollView>
        <View style={styles.imageHeaderContainer}>
            <Image
                source={{ uri: authorImageUrl }} style={styles.authorProfilePhoto}
            />
            <View>
                  <Text style={styles.imageNameText}>{imageTitle}</Text>
                  <Text style={styles.authorNameText}>by {imageAuthorUsername}</Text>
            </View>
            
        </View>
        
        <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => console.log("Touched photo")}>
                <Image
                    source={{ uri: imageSourceToLoad }} style={styles.image}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.imageFooterContainer}>
              <View style={styles.buttonContainer}>
                <IonButton name="heart" onPress={() => likeImage()} color="gray" style={styles.buttonContainer} />
              </View>
              <View style={styles.buttonContainer}>
                  <IonButton name="thumbs-down" onPress={() => dislikeImage()} color="gray" />
              </View>
              <View style={styles.reportButtonContainer}>
                  <IonButton name="flag" onPress={() => reportImage()} color="red" />
              </View>
        </View>

        
              <View style={styles.imageFooterContainer}>
                  <View behavior="height" style={styles.inputContainer}>
                      <TextInput
                          style={styles.inputText}
                          multiline={true}
                          onChangeText={text => setComment(text)}
                          placeholder="Add a comment..."
                      />
                  </View>
                  <IonButton name="send" onPress={() => postComment()} color="cyan" />
        </View>

        <Text>Comments</Text>
          
          
          </ScrollView>
      </KeyboardAvoidingView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
    imageContainer: {
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: 'gray',
        borderBottomColor: "gray",
    },
    image: {

        width:screenWidth,
        height:screenWidth+2,
    },
    imageHeaderContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    authorProfilePhoto: {
        marginLeft: 4,
        marginVertical: 4,
        borderRadius: 30,
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: 'black',
    },
    authorNameText: {
        marginLeft: 8,
        fontSize: 12,
    },
    imageNameText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    imageFooterContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
    buttonContainer: {
        padding: 4,
    },
    reportButtonContainer: {
        padding: 4,
        marginLeft: "auto"
    },
    inputText: {
        
        padding: 10,
        width: '100%',
    },
    inputContainer: {
        marginTop: 20,
        maxWidth: screenWidth * 0.9,
        width: screenWidth * 0.9,
        backgroundColor: 'white',
        borderRadius: 30,
        borderWidth: 2,
        flexWrap: "wrap",
        marginBottom: 20,
        marginRight: 8,
    },

});
