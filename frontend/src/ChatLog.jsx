import React from "react";

const ChatLog = ({ pastInputs, pastResponses }) => {
  return (
    <div style={styles.scrollableContainer}>
      <div style={styles.chatLog}>
        {pastInputs.map((input, index) => (
          <div key={`message-${index}`} style={styles.chatMessageContainer}>
            <div style={styles.userMessage}>{input}</div>
            {pastResponses[index] && (
              <div style={styles.responseMessage}>
                {pastResponses[index]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatLog;


const styles = {
    scrollableContainer: {
      height: '400px',
      overflowY: 'auto',
      paddingRight: '10px',
      marginBottom: '15px',
      backgroundColor: '#f6f6f6',
      borderRadius: '8px',
      padding: '10px',
    },
    chatLog: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    chatMessageContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-start',
    },
    userMessage: {
      backgroundColor: '#007BFF',
      color: '#fff',
      padding: '8px 15px',
      borderRadius: '15px',
      maxWidth: '60%',
      alignSelf: 'flex-end',
    },
    responseMessage: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      padding: '8px 15px',
      borderRadius: '15px',
      maxWidth: '60%',
      alignSelf: 'flex-start',
    },
  };