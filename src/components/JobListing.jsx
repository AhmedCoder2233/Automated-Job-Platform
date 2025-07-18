import { useState, useEffect } from "react";
import { useNavigate } from "react-router";


const JobListings = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/jobpost/");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const storeJobTitle = (data) => {
    localStorage.setItem("jobTitle", JSON.stringify(data))
    navigate("/apply-for-job");
  }

  useEffect(() => {
    getData();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No jobs found</div>;

  return (
    <section className="job-listings" id="jobs">
      <div className="container">
        <h2 className="section-title">Latest Job Postings</h2>
        <div className="jobs-grid">
          {data.map((item) => (
            <div className="job-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>{item.requirements}</p>
              <span>{item.location}</span>
              <button onClick={() => storeJobTitle(item)} className="btn-apply">
                Apply Now
              </button>

            </div>
          ))}
        </div>
        <button className="btn-view-all">View All Jobs</button>
      </div>
    </section>
  );
};

export default JobListings;