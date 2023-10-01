import { StatusBar } from 'expo-status-bar';
import { FlatList, Button, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { app, database, storage } from './firebase';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

//Image picker
import * as ImagePicker from 'expo-image-picker'

//import method used to upload
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function App() {
  //alert(JSON.stringify(app, null, 4))
  return (
    <View style={styles.container}>
      <ListPage />
    </View>
  );
}

const ListPage = () => {

  const [text, setText] = useState('')

  const [values, loading, error] = useCollection(collection(database, "notes"))

  //Read data
  const data = values?.docs.map((doc) => ({...doc.data(), id: doc.id}))

  const [editObject, setEditObject] = useState(null)

  //Create new note
  async function addNote() {  
    await addDoc(collection(database, "notes"), {
      note: text
    })
    setText("");
    }

  function openEditMenu(noteItem){
    setEditObject(noteItem)
    setText(noteItem.note)
  }

  async function updateNote(){

    await updateDoc(doc(database, "notes", editObject.id), {note: text})
    setText("")
    setEditObject(null)
  }

  async function deleteNote(id){
    await deleteDoc(doc(database, "notes", id))
  }


  return (
    <View>
      
      <View>
        <Text>Welcome to your note-app</Text>
      </View>

        {editObject && <View>
          <TextInput
            style={styles.textInput} 
            defaultValue={editObject.note} 
            onChangeText={(txt) => setText(txt)} />
          <NoteImage note={editObject} />
          <Button 
            title='Save'
            onPress={updateNote} />  
        </View>}

        {!editObject && <View>
          <Text>Add your new note here</Text>
          <TextInput
            style={styles.textInput} 
            value={text}
            onChangeText={(txt) => setText(txt)} />
          <NoteImage />
          <Button 
            title='Add note' 
            onPress={addNote}
          />
        </View>}
      
      <View>
        <FlatList 
          data={data}
          renderItem={(note) => 
            <View>
              <Text>
                {note.item.note}
              </Text>
              <Button 
                title='Delete' 
                onPress={() => deleteNote(note.item.id)} />

              <Button 
                title='Edit' 
                onPress={() => openEditMenu(note.item)} />       

            </View>
        }
          
        />
      </View>

    </View>
  )
}

const NoteImage = (props) => {

    //Image picker
    const [imagePath, setImagePath] = useState(null)
    async function lauchImagePicker(){
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      })
      if (!result.canceled){
        setImagePath(result.assets[0].uri) //this one is detailed 
      }
    }
  
    async function uploadImage () {
      id = props.note.id || "myImage"
      const resource = await fetch(imagePath)
      const blob = await resource.blob()
      const storageRef = ref(storage, id + ".jpg")
      uploadBytes(storageRef, blob).then((snapshot) => 
      alert("image uploaded "+id))
    }
  
    //download
    async function downloadImage () {
      getDownloadURL(ref(storage, "myimage.jpg"))
      .then((url) => {
        setImagePath(url)
      })
      .catch((err) => {
        alert('image could not be downloaded '+ err)
      })
    }
  

  return(
      <View>

      <Image 
        style={{width:200, height: 200 }}
        source={{uri: imagePath}} />

      <Button 
        onPress={lauchImagePicker}
        title={imagePath ? 'pick new image' : 'pick image'} />

      {imagePath && 
      <Button 
        onPress={() => uploadImage()}
        title='upload image' />}

        
        <Button 
          onPress={downloadImage}
          title='download image'/>


      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: 'lightblue'
  },
});
