import React, { useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function storeData(value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key8', jsonValue);
    console.log('luu thanh cong');
  } catch {
    // saving error
    console.log('luu that bai');
  }
};


async function getData(arr) {
  try {
    const value = await AsyncStorage.getItem('@storage_Key8')
    if (value !== null) {
      k =JSON.parse(value);
      if (arr.length == 0) {
        for (var i = 0; i < k.length; i++)
          arr.push(k[i]);
      }
    }


    console.log('read data thanh cong');
    // jsonValue != null ? JSON.parse(jsonValue) : 
  } catch {
    // error reading value
    console.log('read data that bai');

  }
}
const Stack = createNativeStackNavigator();
let A = [];
getData(A);
function isEvalable(text) {
  try {
    eval(text);
    return true;
  }
  catch {
    return false;
  }
}

function isNumber(n) {
  if (n - n == 0)
    return true;
  else
    return false;
}

function ConvertTextToArray(text) {
  let t = [];
  let i = 0;
  let c = ['+', '-', '*', '/', '(', ')', '.'];
  while (i < text.length) {
    if ((text[i] >= '0' && text[i] <= '9') || c.indexOf(text[i]) >= 0) {
      t.push(text[i]);
      i++;
    }
    else {
      if (text[i] == ' ') {
        i++;
      }
      else if (text.substring(i, i + 4) == 'sqrt') {
        t.push('sqrt');
        i += 4;
      }
      else {
        return [];
      }
    }
  }
  return t;
}
function calculator(A, text) {
  let t = ConvertTextToArray(text);
  if (t.length == 0) {
    return 'SYNTAX ERROR';
  }
  let str_calculate = '';
  let str_store = '';
  for (let i = 0; i < t.length; i++) {
    str_store += t[i];
    if (t[i] != 'sqrt') {
      str_calculate += t[i];
    }
    else {
      str_calculate += 'Math.sqrt';
    }
  }

  if (isEvalable(str_calculate)) {
    let evaled_str_calculate = eval(str_calculate);
    if (isNumber(evaled_str_calculate)) {
      A.push(str_store + '\n' + '=' + evaled_str_calculate);
      return evaled_str_calculate;
    }
    else {
      return 'SYNTAX ERROR';
    }
  }
  else {
    return 'SYNTAX ERROR';
  }

}

function getHistory(A) {
  let str = '';
  for (let i = A.length - 1; i >= 0; i--) {
    str += A[i] + '\n' + '\n';
  }
  return str;
}

function search0(A, text) {
  let t = ConvertTextToArray(text);
  if (t.length == 0) {
    return '';
  }
  let str = '';
  let str1 = '';
  for (let i = 0; i < t.length; i++) {
    str += t[i];
  }
  for (let i = 0; i < A.length; i++) {
    if (A[i].substring(0, str.length) == str) {
      str1 += A[i] + '\n' + '\n';
    }
  }
  return str1;
}


function search(A, text) {
  if (text[0] == 's') {
    let str1 = '';
    A.filter(item => {
      for (let i = 0; i < item.length; i++)
        if (item[i] == 's') {
          str1 += item + '\n' + '\n';
          break;
        }
    })


  }
  let str1 = search0(A, text);
  if (str1 != '') {
    return str1;
  }
  str1 = '';
  A.filter(item => {
    for (let i = 0; i < text.length; i++) {
      let flag = 0;
      for (let j = 0; j < item.length; j++) {
        if (item[j] == text[i]) { flag++; }
      }
      if (flag > 0) { str1 += item + '\n' + '\n'; break; }
    }
  })
  return str1;
}

const CalculatorScreen = ({ navigation }) => {
  let c = ['+', '-', '*', '/', '(', ')', 'sqrt'];

  const [text_input, setTextInput] = useState('');
  const [answer, setAnswer] = useState('');
  return (
    <View style={{ padding: 25 }}>
      <Text>Nhập biểu thức bạn cần tính:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'black', borderWidth: 1, fontSize: 20 }}
        keyboardType='numeric'
        onChangeText={(newText) => { setTextInput(newText); setAnswer('') }}
        defaultValue={text_input}
        onSubmitEditing={() => { setAnswer(calculator(A, text_input)), storeData(A), console.log(A) }}
      />

      <View style={styles.row} >
        {
          c.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTextInput(text_input + item)}
              style={
                styles.button}
            >
              <Text
                style={
                  styles.buttonLabel}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))
        }

      </View>



      <Text>Kết quả:</Text>
      <Text style={{ fontSize: 20 }}>
        {answer}
      </Text>
      <Button
        title='history'
        onPress={() =>
          navigation.navigate('History')
        }
      />
    </View>
  );
}

const HistoryScreen = ({ navigation }) => {
 // getData(A);
 // console.log(A);
  const [text_ans, setTextAns] = useState(getHistory(A));

  return (
    <ScrollView style={{ padding: 25 }}>
      <Text style={{ frontSize: 20 }}>Nhập biểu thức bạn muốn tìm kiếm</Text>
      <TextInput
        style={{ height: 40, borderColor: 'black', borderWidth: 1, fontSize: 20 }}
        onChangeText={(newtext) => { if (newtext == '') { setTextAns(getHistory(A)) } else { setTextAns(search(A, newtext)) } }}
      />

      <Text style={{ fontSize: 20 }}>{text_ans}</Text>
    </ScrollView>
  )

}


const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Calculator' component={CalculatorScreen} option={{ title: 'Calculator' }} />
        <Stack.Screen name='History' component={HistoryScreen} option={{ title: 'History' }} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "black",
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "28%",
    textAlign: "center",
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
})
export default App;
