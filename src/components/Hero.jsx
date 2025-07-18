import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router";

const Hero = () => {

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Job or Ideal Candidate</h1>
          <p className="hero-subtitle">
            Connect with thousands of employers and job seekers in one platform
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary"><Link to="/create-job">Post a Job</Link></button>
            <button className="btn btn-secondary"><Link to="your-post">See your Posted Jobs!</Link></button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://media.istockphoto.com/id/2168922157/photo/partnership-and-collaboration-in-office-group-discussion-for-feedback.webp?a=1&b=1&s=612x612&w=0&k=20&c=J8bnSbqkyViFy7S99_XkemYX-d_FruNwYjTsUlW-8zY=" alt="People working" />
        </div>
      </div>
      
      <div className="search-container">
        <div className="search-card">
          <div className="search-tabs">
            <button className="tab active">Find Jobs</button>
          </div>
          <form className="search-form">
            <div className="form-group">
              <input type="text" placeholder="Job title, keywords" />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Location" />
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;