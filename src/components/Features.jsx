const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Why Choose Our Platform</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>For Employers</h3>
            <ul>
              <li>Reach qualified candidates</li>
              <li>Easy job posting</li>
              <li>Applicant tracking</li>
            </ul>
          </div>
          <div className="feature-card">
            <h3>For Job Seekers</h3>
            <ul>
              <li>Thousands of jobs</li>
              <li>Easy application</li>
              <li>Job alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;