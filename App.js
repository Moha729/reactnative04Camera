import { StatusBar } from 'expo-status-bar';
import { FlatList, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { app, database } from './firebase';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

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

  function openEditMenu(noteInfo){
    setEditObject(noteInfo)
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
