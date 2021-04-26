import Head from 'next/head';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from '../styles/Home.module.css';
import UsernameField from '../components/UsernameField';

export default function Home() {
  // save socket
  const [socket, setSocket] = useState(null);
  // confirmation of username state
  const [isUsernameConfirmed, setUsernameConfirmed] = useState(false);
  // Username state
  const [username, setUsername] = useState("");
  // Form field state
  const [message, setMessage] = useState("");
  // Message history state
  const [history, setHistory] = useState([]);


  const connectSocket = () => {

    fetch("/api/chat");

    if (!socket) {
      const newSocket = io();

      // Confirm connection
      newSocket.on("connect", () => {
        console.log("initial connection established")
      })

      // handle user msg
      newSocket.on("message", (msg) => {
        setHistory((history) => [...history, msg])
      });

      // logs on server disconnect
      newSocket.on("disconnect", () => {
        console.warn("WARNING: Chat application disconnected");
      })

      setSocket(() => newSocket);
    }
  }


  useEffect(() => {
    connectSocket();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!socket) {
      alert("Chatroom not connected yet.")
      return;
    }

    // prevents empty msg submits
    if (!message || !isUsernameConfirmed) {
      return;
    }

    // submit and blank-out msg field
    socket.emit("message-submitted", { message, username });
    setMessage("");
  }

  return (
    <div>

      {/* Set the page's title */}
      <Head>
        <title>My Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Username Area */}
      <UsernameField
        completed={isUsernameConfirmed}
        value={username}
        onChange={(value) => setUsername(value)}
        onSubmit={() => setUsernameConfirmed(true)}
      />

      {/* Form submission */}
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Type your message:
           <input
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                username ? "Enter your message..." : "Set Username..."
              }
              disabled={!isUsernameConfirmed}
            />
          </label>
          <input type="submit" value="Submit" disabled={!isUsernameConfirmed} />
        </form>
      </div>

      {/* The list of messages */}
      <div>
        {history.map(({ username, message }, i) => (
          <div key={i}>
            <b>{username}</b>: {message}
          </div>
        ))}
      </div>
    </div>
  )

}
