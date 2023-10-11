import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import React, { useContext, useState } from "react";
import { TodosContext } from "../context/TodosContext";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  VStack,
  Input,
  Icon,
  NativeBaseProvider,
  Box,
  Heading,
} from "native-base";
import uuid from "uuid-random";
import { FontAwesome5 } from "@expo/vector-icons";

const LinearGradient = require("expo-linear-gradient").LinearGradient;

const TodoList = () => {
  // receive state and dispatch from App.js
  const { state, dispatch } = useContext(TodosContext);
  const [todoText, setTodoText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const buttonTitle = editMode ? "Düzenle" : "Ekle";

  const handleSubmit = () => {
    if (editMode) {
      dispatch({
        type: "edit",
        payload: { ...editTodo, text: todoText, tarih: new Date() },
      });
      setEditMode(false);
      setEditTodo(null);
    } else {
      const newToDo = { id: uuid(), text: todoText, tarih: new Date() };
      dispatch({ type: "add", payload: newToDo });
    }
    setTodoText(""); //kullanıcı yeni bir görev ekledikten sonra ekleme alanını temizlemek için
  };

  const renderItem = (data) => (
    <Box
      bg={{
        linearGradient: {
          colors: ["lightBlue.300", "violet.800"],
          start: [0, 0],
          end: [1, 0],
        },
      }}
      p="12"
      rounded="xl"
      _text={{
        fontSize: "md",
        fontWeight: "medium",
        color: "warmGray.50",
        textAlign: "center",
      }}
    >
      <Text>{data.item.text}</Text>
      <Text>Eklenme Tarihi: {new Date(data.item.tarih).toLocaleString()}</Text>
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity onPress={() => editRow(data.item, rowMap)}>
        <Text>Düzenle</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backRightbtn}
        onPress={() => deleteRow(data.item)}
      >
        <Text style={{ color: "#FFF" }}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  const deleteRow = (todo) => {
    dispatch({ type: "delete", payload: todo });
  };

  const editRow = (todo, rowMap) => {
    setTodoText(todo.text);
    setEditMode(true);
    setEditTodo(todo);
    if (rowMap[todo.id]) {
      rowMap[todo.id].closeRow();
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 60 }}>
      <Heading fontSize="2xl">Yapılacaklar</Heading>
      <SwipeListView
        data={state.todos}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
      <View style={{ marginLeft: 5, marginBottom: 10 }}>
        <VStack w="100%" space={5} alignSelf="center">
          <View
            style={{ flexDirection: "row", marginLeft: 2, marginRight: 60 }}
          >
            <Input
              placeholder="Görev Girin"
              onChangeText={(text) => setTodoText(text)}
              value={todoText}
              variant="filled"
              width="200½"
              borderRadius="10"
              py="1"
              px="120"
              borderWidth="7"
            />
            <Button
              onPress={handleSubmit}
              title={buttonTitle}
              style={{ height: 20 }}
            />
          </View>
        </VStack>
      </View>
    </View>
  );
};

const config = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};

export default () => {
  return (
    <NativeBaseProvider config={config}>
      <TodoList />
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightbtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    backgroundColor: "red",
    right: 0,
  },
});
