import {View, Text, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Chat = () => {

  const [messageList, setMessageList] = useState<any>([]);
  const route = useRoute();
  useEffect(() => {
    
    const subscriber = firestore()
      .collection('chats')
      // @ts-ignore
      .doc(route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        // @ts-ignore
        return {...item._data, createdAt: item._data.createdAt};
      });
      setMessageList(allmessages);
    });

    // @ts-ignore
    return () => subscriber();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const myMsg = {
      // @ts-ignore
      ...msg,
      // @ts-ignore
      sendBy: route.params.id,
      // @ts-ignore
      sendTo: route.params.data.userId,
      // @ts-ignore
      createdAt: Date.parse(msg.createdAt),
    };
    // @ts-ignore
    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    firestore()
      .collection('chats')
      // @ts-ignore
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);
    firestore()
      .collection('chats')
      // @ts-ignore
      .doc('' + route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);
  }, []);

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messageList}
        // @ts-ignore
        onSend={messages => onSend(messages)}
        user={{
          // @ts-ignore
          _id: route.params.id,
        }}
      />
    </View>
  );
}

export default Chat


const styles = StyleSheet.create({})