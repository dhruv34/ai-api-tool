import React from "react";

const HistoryBar = ({ history, setType, setModel, setSystemPrompt, setPastInputs, setPastResponses }) => {
  return (
    <div style={styles.historyContainer}>
      <h2 style={{ color: "black" }}>History</h2>
      {history.map((item, index) => (
        <div
          key={index}
          style={styles.historyCard}
          onClick={() => {
            setType(item.type);
            setModel(item.model);
            setSystemPrompt(item.systemPrompt);
            setPastInputs(item.pastInputs);
            setPastResponses(item.pastResponses);
          }}
        >
          <p>
            <strong>Type:</strong> {item.type}
          </p>
          <p>
            <strong>Model:</strong> {item.model}
          </p>
          <p>
            <strong>System Prompt:</strong> {item.systemPrompt}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HistoryBar;


const styles = {
    historyContainer: {
      width: '20%',
      paddingLeft: '20px',
      borderLeft: '2px solid #ccc',
      height: '900px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    historyCard: {
      backgroundColor: '#f3f3f3',
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#333',
      width: '85%'
    },
  };