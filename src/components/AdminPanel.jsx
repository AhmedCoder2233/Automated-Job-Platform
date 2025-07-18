import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [showInput, setShowInput] = useState(null); // which card is active for input
  const [inputMessage, setInputMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ahmed123') setIsLoggedIn(true);
    else alert('Incorrect password!');
  };

  const fetchData = async () => {
    const res1 = await fetch('http://127.0.0.1:8000/userapply/');
    const apps = await res1.json();
    setApplicants(apps);

    const res2 = await fetch('http://127.0.0.1:8080/saveSummary/');
    const summ = await res2.json();
    setSummaries(summ);
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const sendNotification = async () => {
    if (!inputMessage.trim()) return alert("Message can't be empty!");
    try {
      await fetch('http://127.0.0.1:8081/sendnotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: inputMessage })
      });
      alert('Notification Sent!');
      setInputMessage('');
      setShowInput(null);
    } catch (e) {
      alert('Failed to send notification');
    }
  };

  const styles = {
    container: { fontFamily: 'Segoe UI, sans-serif', padding: '40px', background: '#f5f5f5', minHeight: '100vh' },
    loginBox: { background: '#333', color: '#fff', maxWidth: '400px', margin: '100px auto', padding: '30px', borderRadius: '10px', textAlign: 'center' },
    input: { padding: '10px', width: '100%', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    button: { padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: '#007bff', color: '#fff' },
    section: { marginTop: '30px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' },
    card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    actions: { marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
    actionBtn: (bg) => ({ padding: '10px', borderRadius: '5px', border: 'none', background: bg, color: '#fff', cursor: 'pointer' }),
    inputBox: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' },
    header: { marginBottom: '10px', fontSize: '22px' }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h2>Enter Admin Key</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  const renderInputBox = (id) => (
    showInput === id && (
      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Enter message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={sendNotification}>Send</button>
      </div>
    )
  );

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h2 style={styles.header}>All Applicants ({applicants.length})</h2>
        <div style={styles.grid}>
          {applicants.map((app) => (
            <div key={app.id} style={styles.card}>
              <p><strong>Name:</strong> {app.name}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Cover Letter:</strong> {app.cover_letter}</p>
              {app.resume_base64 && (
                <iframe
                  src={`data:application/pdf;base64,${app.resume_base64}`}
                  style={{ width: '100%', height: '250px', marginTop: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  title="Resume"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.header}>Selected After Interview ({summaries.length})</h2>
        <div style={styles.grid}>
          {summaries.map((s, index) => (
            <div key={s.secret_key || index} style={styles.card}>
              <p><strong>Summary:</strong> {s.summary}</p>
              <div style={styles.actions}>
                <button style={styles.actionBtn("#28a745")} onClick={() => setShowInput(s.secret_key)}>Accept</button>
                <button style={styles.actionBtn("#dc3545")} onClick={() => setShowInput(s.secret_key)}>Reject</button>
                {renderInputBox(s.secret_key)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
