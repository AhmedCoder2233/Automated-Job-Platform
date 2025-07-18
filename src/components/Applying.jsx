import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const Applying = () => {

  const {user} = useUser()

  const [data, setData] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null,
    coverLetter: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const jobTitle = localStorage.getItem("jobTitle");
    if (jobTitle) {         
      setData(JSON.parse(jobTitle));
      localStorage.removeItem("jobTitle");
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const form = new FormData();
  form.append("name", formData.name);
  form.append("email", formData.email);
  form.append("coverLetter", formData.coverLetter);
  form.append("resume", formData.resume); 
  form.append("clerk_id", user.id)
  form.append("data", JSON.stringify(data))
  form.append("ischecked", false)
  form.append("is_eligible", false)


  try {
    const res = await fetch("http://127.0.0.1:8000/userapply/", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      setSubmitSuccess(true);
    }
  } catch (error) {
    console.error("Error submitting form", error);
  } finally {
    setIsSubmitting(false);
  }
};

  if (submitSuccess) {
    return (
      <div className="application-success">
        <div className="success-container">
          <h2>Application Submitted Successfully!</h2>
            <p>Thank you for applying to the {data?.title || "job"} position.</p>
          <p>We'll review your application and get back to you soon.</p>
          <button 
            className="back-button"
            onClick={() => setSubmitSuccess(false)}
          >
            Apply to Another Position
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-container">
      <div className="application-header">
        <h1>Apply for: {data?.title || "..."}</h1>
        <p>Please fill out the form below to apply for this position</p>
      </div>
      
      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="name">Full Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Upload Resume (PDF only)*</label>
            <div className="file-upload">
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf"
                required
              />
              <label htmlFor="resume" className="file-label">
                {formData.resume ? formData.resume.name : "Choose a file"}
              </label>
            </div>
            <p className="file-hint">Max file size: 5MB</p>
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Tell us why you're a good fit for this position..."
              rows="6"
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Applying;