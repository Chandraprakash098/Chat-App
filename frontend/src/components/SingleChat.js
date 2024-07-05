import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./../config/chatLogics";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { FormControl, Input, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";

const ENDPOINT = "http://localhost:3500";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3500/api/message/${selectedChat._id}`,
        config
      );
      console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Fail to load message",
        position: "bottom",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "http://localhost:3500/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        socket.emit("new message", data);
        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Fail to send message",
          position: "bottom",
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="chat-header"
          >
            <IconButton
              display="flex"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              className="back-button"
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            p={3}
            w="100%"
            h="100%"
            className="chat-container"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}
              className="chat-input"
            >
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={60}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : null}
              <Input
                variant="filled"
                bg="white"
                placeholder="Enter the message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl">Click On User To Start Chat</Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
