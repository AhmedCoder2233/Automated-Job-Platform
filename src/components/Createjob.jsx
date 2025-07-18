import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';

const CreateJob = () => {
  const { user } = useUser();

   const primaryEmail = user.primaryEmailAddress?.emailAddress;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    clerk_id: user?.id || '',
    user_email: primaryEmail || ''
  });

  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'ahmed123') {
      setIsAuthorized(true);
    } else {
      alert('Incorrect password. Please contact admin.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Job posted successfully!');
    await fetch("http://127.0.0.1:8000/jobpost/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    setFormData({
      title: '',
      description: '',
      requirements: '',
      location: '',
      clerk_id: user?.id || '',
      user_email: primaryEmail || ''
    });
  };

  if (!isAuthorized) {
    return (
      <div className="auth-creator">
        <h2>Contact Admin at <a href="mailto:ahmedmemon3344@gmail.com">ahmedmemon3344@gmail.com</a> for Password to Become a Creator!</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Enter Creator Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="create-job-container">
      <div className="create-job-header">
        <h1>Post a New Job</h1>
        <p>Fill out the form below to list your job opportunity</p>
      </div>

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="title">Job Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior React Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location*</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the responsibilities and what the job entails"
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements*</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the required skills, qualifications, and experience"
              rows="6"
              required
            ></textarea>
            <p className="hint">Separate requirements with bullet points or new lines</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Post Job</button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
