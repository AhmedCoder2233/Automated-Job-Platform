import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";


const YourPost = () => {

   const {user} = useUser()

   const [jobPosts, setjobPosts] = useState([])
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

  const Fetching = async()=>{
    const response = await fetch("http://127.0.0.1:8000/jobpost/")
    const data = await response.json()
    const filtering = data.filter(clerk => clerk.clerk_id == user.id)
    setjobPosts(filtering)
  }

  useEffect(()=>{
    Fetching()
  },[])

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
    <div className="your-posts-container">
      <h2>Your Job Posts</h2>
      <div className="job-card-wrapper">
        {jobPosts.map((job, index) => (
          <div className="job-card" key={index}>
            <h3>{job.title}</h3>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Location:</strong> {job.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourPost;
