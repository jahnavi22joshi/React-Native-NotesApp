import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2);

const App = () => {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [color, setColor] = useState('#fefefe');
  const [editingId, setEditingId] = useState(null);

  const addOrEditNote = () => {
    if (text.trim() === '') return;

    if (editingId) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingId ? { ...note, text, color } : note
        )
      );
      setEditingId(null);
    } else {
      setNotes(prev => [...prev, { id: generateId(), text, color }]);
    }
    setText('');
  };

  const deleteNote = id => {
  Alert.alert(
    'Delete Note',
    'Are you sure you want to delete this note?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotes(prev => prev.filter(note => note.id !== id));
        },
      },
    ]
  );
};


  const editNote = note => {
    setText(note.text);
    setColor(note.color);
    setEditingId(note.id);
  };

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />

      <Text style={styles.title}>📝 My Notes</Text>

      <TextInput
        placeholder="Search notes..."
        placeholderTextColor={'black'}
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <TextInput
        placeholder="Enter your note..."
        placeholderTextColor={'black'}
        value={text}
        onChangeText={setText}
        multiline
        style={[styles.noteInput, { backgroundColor: color }]}
      />

      <View style={styles.colorPalette}>
        {['#fefefe', '#ffdddd', '#ddffdd', '#ddddff', '#fff7cc'].map(c => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={[styles.colorOption, {
              backgroundColor: c,
              borderWidth: color === c ? 2 : 1,
              borderColor: color === c ? '#007bff' : '#ccc',
            }]}
          />
        ))}
      </View>

      <TouchableOpacity onPress={addOrEditNote} style={styles.button}>
        <Text style={styles.buttonText}>{editingId ? 'Update Note' : 'Add Note'}</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={[styles.noteItem, { backgroundColor: item.color }]}>
            <Text style={styles.noteText}>{item.text}</Text>
            <View style={styles.noteActions}>
              <TouchableOpacity onPress={() => editNote(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 60,
  },
  colorPalette: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteItem: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
  noteActions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  edit: {
    color: '#007bff',
    marginRight: 16,
  },
  delete: {
    color: '#ff4444',
  },
});

export default App;
