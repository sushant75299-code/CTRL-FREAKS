import { useRef, useState } from "react";



import "./App.css";

import "./demo-mode.css";







const API_URL = "http://127.0.0.1:8000";



const MAX_FILE_SIZE = 5 * 1024 * 1024;







function formatScore(value) {



  if (value === null || value === undefined || value === "") return 0;



  const number = Number(value);



  if (!Number.isFinite(number)) return 0;







  // Accept either a percentage (85) or a ratio (0.85).



  return Math.round(Math.max(0, Math.min(100, number <= 1 ? number * 100 : number)));



}







function ScoreRing({ score }) {



  const circumference = 2 * Math.PI * 68;



  const progress = circumference * (1 - score / 100);







  return (



    <div className="score-ring" role="img" aria-label={`Resume match: ${score}%`}>



      <svg viewBox="0 0 160 160" aria-hidden="true">



        <circle className="ring-track" cx="80" cy="80" r="68" />



        <circle



          className="ring-progress"



          cx="80"



          cy="80"



          r="68"



          strokeDasharray={circumference}



          strokeDashoffset={progress}



        />



      </svg>



      <div className="ring-label">



        <span className="ring-number">{score}</span>



        <span className="ring-percent">percent match</span>



      </div>



    </div>



  );



}







function SkillChips({ skills, variant = "sage" }) {



  if (!skills?.length) {



    return <p className="empty-note">No skills to display yet.</p>;



  }







  return (



    <div className="skill-chips">



      {skills.map((skill, index) => (



        <span className={`skill-chip ${variant}`} key={`${skill}-${index}`}>



          {skill}



        </span>



      ))}



    </div>



  );



}







function Roadmap({ items = [] }) {



  if (!items.length) {



    return (



      <p className="empty-note">



        Your personalized learning steps will appear here after analysis.



      </p>



    );



  }







  return (



    <div className="roadmap">



      {items.map((item, index) => {



        const resources = Array.isArray(item.resources) ? item.resources : [];







        return (



          <article className="roadmap-step" key={`${item.focus || "step"}-${index}`}>



            <div className="roadmap-marker">



              <span>{String(index + 1).padStart(2, "0")}</span>



            </div>



            <div className="roadmap-content">



              <div className="roadmap-meta">



                {item.days !== undefined && item.days !== null && (



                  <span>{typeof item.days === "string" ? item.days : `Days ${item.days}`}</span>



                )}



                <span>Learning step {index + 1}</span>



              </div>



              <h4>{item.focus || "Build a new skill"}</h4>



              <p>{item.task || "Practice this skill with a small hands-on project."}</p>



              {resources.length > 0 && (



                <div className="resource-links">



                  {resources.map((resource, resourceIndex) => (



                    <a



                      key={`${resource.url}-${resourceIndex}`}



                      href={resource.url}



                      target="_blank"



                      rel="noreferrer"



                    >



                      {resource.name || "Learning resource"} ↗



                    </a>



                  ))}



                </div>



              )}



            </div>



          </article>



        );



      })}



    </div>



  );



}







function SampleResults({ onClose }) {



  return (



    <section className="report-section" aria-label="Sample analysis preview">



      <div className="section-heading">



        <div>



          <span className="eyebrow">A GLIMPSE OF WHAT'S POSSIBLE</span>



          <h2>Your career, in perspective.</h2>



          <p>This is illustrative sample data, not a real resume analysis.</p>



        </div>



        <button className="text-button" onClick={onClose}>Close preview ×</button>



      </div>







      <div className="report-grid">



        <article className="paper-card match-card">



          <span className="card-kicker">SAMPLE REPORT</span>



          <h3>A promising starting point.</h3>



          <ScoreRing score={78} />



          <p className="report-copy">



            A sample match showing how your experience could align with a target role.



          </p>



        </article>







        <article className="paper-card skill-card">



          <span className="card-kicker">01 / YOUR STRENGTHS</span>



          <h3>Skills that connect</h3>



          <SkillChips skills={["Python", "Problem solving", "SQL"]} />



          <div className="soft-divider" />



          <span className="card-kicker">02 / ROOM TO GROW</span>



          <h3>Skills to explore</h3>



          <SkillChips skills={["Cloud deployment", "Testing"]} variant="burgundy" />



        </article>



      </div>







      <article className="paper-card roadmap-card">



        <span className="card-kicker">03 / YOUR NEXT CHAPTER</span>



        <h3>A learning roadmap, made personal.</h3>



        <Roadmap



          items={[



            { days: "Week 1", focus: "Build the foundations", task: "Review the core concepts and complete a guided exercise." },



            { days: "Week 2", focus: "Put skills into practice", task: "Create a small project that demonstrates what you learned." },



            { days: "Week 3", focus: "Show your progress", task: "Polish your project and add the strongest evidence to your portfolio." },



          ]}



        />



      </article>



    </section>



  );



}









const DEMO_RESULT = {

  filename: "sample_resume.pdf",

  match_score: 78,

  text_similarity: 74,

  skill_coverage: 82,

  resume_skills: ["Python", "React", "HTML", "CSS", "Git", "REST APIs"],

  required_skills: ["Python", "React", "JavaScript", "SQL", "FastAPI", "REST APIs"],

  matched_skills: ["Python", "React", "REST APIs"],

  missing_skills: ["JavaScript", "SQL", "FastAPI"],

  learning_plan: [

    {

      days: "Days 1–5",

      focus: "JavaScript foundations",

      task: "Practise functions, arrays, objects, and async/await.",

      resources: [{

        name: "MDN JavaScript Guide",

        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",

      }],

    },

    {

      days: "Days 6–10",

      focus: "SQL essentials",

      task: "Learn SELECT queries, filtering, and joins.",

      resources: [{ name: "SQLBolt", url: "https://sqlbolt.com/" }],

    },

    {

      days: "Days 11–20",

      focus: "FastAPI basics",

      task: "Build a small API with validation and endpoints.",

      resources: [{ name: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }],

    },

    {

      days: "Days 21–30",

      focus: "Portfolio project",

      task: "Build a small full-stack application and document it.",

      resources: [{ name: "GitHub Skills", url: "https://skills.github.com/" }],

    },

  ],

  explanation: "DEMO DATA ONLY: These illustrative results are not generated from your uploaded resume.",

  is_demo: true,

};





export default function App() {



  const fileInputRef = useRef(null);



  const [resume, setResume] = useState(null);



  const [jobDescription, setJobDescription] = useState("");



  const [loading, setLoading] = useState(false);



  const [error, setError] = useState("");



  const [results, setResults] = useState(null);



  const [showSample, setShowSample] = useState(false);

  const [demoMode, setDemoMode] = useState(true);





  const [dragging, setDragging] = useState(false);







  function chooseFile(file) {



    setError("");



    setResults(null);



    setShowSample(false);







    if (!file) return;







    if (!/\.(pdf|docx|txt)$/i.test(file.name)) {



      setError("Please choose a PDF, DOCX, or TXT resume.");



      return;



    }







    if (file.size > MAX_FILE_SIZE) {



      setError("Your resume must be 5 MB or smaller.");



      return;



    }







    setResume(file);



  }







  async function analyzeResume(event) {



    event.preventDefault();







    if (!resume || !jobDescription.trim()) {



      setError("Add your resume and the job description before continuing.");



      return;



    }







    setError("");

    setResults(null);

    setShowSample(false);



    if (demoMode) {

      setResults({ ...DEMO_RESULT });

      window.setTimeout(() => {

        document.getElementById("analysis-report")?.scrollIntoView({

          behavior: "smooth",

          block: "start",

        });

      }, 50);

      return;

    }



    setLoading(true);







    const formData = new FormData();



    formData.append("resume", resume);



    formData.append("job_description", jobDescription.trim());







    try {



      const response = await fetch(`${API_URL}/analyze`, {



        method: "POST",



        body: formData,



      });







      const data = await response.json().catch(() => ({}));







      if (!response.ok) {



        throw new Error(



          typeof data.detail === "string"



            ? data.detail



            : `Analysis failed with status ${response.status}.`



        );



      }







      setResults(data);



      window.setTimeout(() => {



        document.getElementById("analysis-report")?.scrollIntoView({



          behavior: "smooth",



          block: "start",



        });



      }, 50);



    } catch (err) {



      if (err.message === "Failed to fetch") {



        setError(



          "We couldn't reach the analysis service. Check that the backend is running, the API URL is correct, and CORS allows this page."



        );



      } else {



        setError(err.message || "Something went wrong. Please try again.");



      }



    } finally {



      setLoading(false);



    }



  }







  const matchScore = results ? formatScore(results.match_score) : 0;



  const similarity = results ? formatScore(results.text_similarity) : 0;



  const coverage = results ? formatScore(results.skill_coverage) : 0;







  return (



    <div className="site-shell">



      <header className="site-header">



        <a className="wordmark" href="#" aria-label="SkillBridge home">



          <span className="wordmark-icon"><span /></span>



          <span>skillbridge<span className="wordmark-period">.</span></span>



        </a>







        <nav className="header-nav" aria-label="Main navigation">



          <a href="#how-it-works">How it works</a>



          <a href="#workspace">Your analysis</a>



        </nav>







        <a className="header-cta" href="#workspace">



          Find your fit <span>↗</span>



        </a>



      </header>







      <main>



        <section className="hero-section">



          <div className="hero-copy">



            <div className="eyebrow hero-eyebrow">



              <span className="eyebrow-line" />



              A MORE THOUGHTFUL CAREER TOOL



            </div>



            <h1>



              Your next chapter



              <br />



              <em>starts with clarity.</em>



            </h1>



            <p className="hero-description">



              See where your experience meets opportunity.



              Discover your strengths, identify skill gaps, and



              turn your next career move into a clear plan.



            </p>



            <a className="primary-link" href="#workspace">



              Explore your career fit <span>↗</span>



            </a>



            <div className="hero-footnote">



              <span className="tiny-star">✳</span>



              A clearer path, one step at a time.



            </div>



          </div>







          <div className="hero-art" aria-label="Illustration of a career path">



            <div className="art-topline">



              <span>THE ART OF MOVING FORWARD</span>



              <span>01 — 03</span>



            </div>



            <div className="art-orbit orbit-one" />



            <div className="art-orbit orbit-two" />



            <div className="art-sun" />



            <div className="art-arch">



              <div className="arch-inner" />



            </div>



            <div className="art-plant plant-one">



              <span /><span /><span /><i />



            </div>



            <div className="art-plant plant-two">



              <span /><span /><span /><i />



            </div>



            <div className="art-path" />



            <div className="art-label label-top">KNOW YOUR VALUE</div>



            <div className="art-label label-bottom">GROW WITH INTENTION</div>



            <div className="art-caption">



              <span>YOUR POTENTIAL, IN FOCUS</span>



              <span className="caption-dot" />



            </div>



          </div>



        </section>







        <section className="trust-strip" id="how-it-works">



          <span className="trust-intro">A better way to prepare</span>



          <div><span className="strip-number">01</span> Understand your match</div>



          <div><span className="strip-number">02</span> Find your skill gaps</div>



          <div><span className="strip-number">03</span> Plan your next steps</div>



        </section>







        <section className="workspace-section" id="workspace">



          <div className="workspace-intro">



            <span className="eyebrow">LET'S BEGIN WITH YOU</span>



            <h2>Make your next move<br /><em>a considered one.</em></h2>



            <p>Two simple things help us understand the opportunity ahead.</p>



          </div>







          <div className="demo-mode-control">

            <div className="demo-mode-copy">

              <strong>Presentation demo mode</strong>

              <span>

                {demoMode

                  ? "Sample results enabled — no backend request is made."

                  : "Live analysis mode — requires the backend API."}

              </span>

            </div>

            <label className="demo-switch">

              <input

                type="checkbox"

                checked={demoMode}

                onChange={(event) => {

                  setDemoMode(event.target.checked);

                  setResults(null);

                  setError("");

                }}

              />

              <span className="demo-switch-track" />

              <span className="demo-switch-label">{demoMode ? "DEMO ON" : "LIVE API"}</span>

            </label>

          </div>



          {demoMode && (

            <div className="demo-notice" role="status">

              <span className="demo-notice-dot" />

              <div>

                <strong>DEMO PREVIEW · SAMPLE DATA</strong>

                <p>

                  Results are illustrative and are not generated from your uploaded resume.

                  Turn demo mode off to use the live API.

                </p>

              </div>

            </div>

          )}



          <form className="input-workspace" onSubmit={analyzeResume}>



            <article className="input-card">



              <div className="input-card-heading">



                <span className="step-index">01</span>



                <div>



                  <h3>Your experience</h3>



                  <p>Start with your current resume.</p>



                </div>



              </div>







              <div



                className={`dropzone ${dragging ? "is-dragging" : ""} ${resume ? "has-file" : ""}`}



                onDragOver={(event) => {



                  event.preventDefault();



                  setDragging(true);



                }}



                onDragLeave={() => setDragging(false)}



                onDrop={(event) => {



                  event.preventDefault();



                  setDragging(false);



                  chooseFile(event.dataTransfer.files?.[0]);



                }}



                onClick={() => fileInputRef.current?.click()}



                onKeyDown={(event) => {



                  if (event.key === "Enter" || event.key === " ") {



                    event.preventDefault();



                    fileInputRef.current?.click();



                  }



                }}



                role="button"



                tabIndex={0}



                aria-label="Choose or drop your resume"



              >



                <input



                  ref={fileInputRef}



                  type="file"



                  accept=".pdf,.docx,.txt"



                  onChange={(event) => {



                    chooseFile(event.target.files?.[0]);



                    event.target.value = "";



                  }}



                />



                <div className="upload-symbol">



                  {resume ? "✓" : "↑"}



                </div>



                <strong>{resume ? resume.name : "Drop your resume here"}</strong>



                <span>{resume ? "Ready for your analysis" : "or click to browse your files"}</span>



                <div className="file-format">PDF <span /> DOCX <span /> TXT <span /> UP TO 5 MB</div>



              </div>







              {resume && (



                <button



                  type="button"



                  className="remove-file"



                  onClick={() => {



                    setResume(null);



                    setResults(null);



                  }}



                >



                  Remove resume ×



                </button>



              )}



            </article>







            <article className="input-card">



              <div className="input-card-heading">



                <span className="step-index">02</span>



                <div>



                  <h3>The opportunity</h3>



                  <p>Tell us about the role you have in mind.</p>



                </div>



              </div>







              <label className="visually-hidden" htmlFor="job-description">



                Job description



              </label>



              <textarea



                id="job-description"



                className="job-input"



                value={jobDescription}



                onChange={(event) => {



                  setJobDescription(event.target.value);



                  setResults(null);



                  setError("");



                }}



                placeholder={"Paste the job description here...\n\nInclude the role, responsibilities, required skills, and qualifications."}



                rows={7}



              />



              <div className="textarea-footer">



                <span>More detail helps provide a more useful comparison.</span>



                <span>{jobDescription.length} chars</span>



              </div>



            </article>







            {error && <div className="error-banner" role="alert">{error}</div>}







            <div className="submit-row">



              <button



                className="submit-button"



                type="submit"



                disabled={!resume || !jobDescription.trim() || loading}



              >



                {loading ? (



                  <><span className="loading-spinner" /> Reading your experience...</>



                ) : (



                  <>Discover your match <span>↗</span></>



                )}



              </button>



              <p><span>✳</span> Your resume is sent to the configured analysis server for processing.</p>



            </div>



          </form>



          <button className="sample-link" type="button" onClick={() => setShowSample((current) => !current)}>



            {showSample ? "Hide sample report ↑" : "Curious what the report looks like? View a sample ↗"}



          </button>



        </section>







        {showSample && <SampleResults onClose={() => setShowSample(false)} />}







        {results && (



          <section className="report-section" id="analysis-report">



            <div className="section-heading">



              <div>



                <span className="eyebrow">YOUR PERSONAL REPORT</span>



                <h2>Here is where you stand.</h2>



                <p>{results.explanation || "Your resume and the job description have been compared."}</p>



              </div>



              <span className={`report-badge ${results.is_demo ? "demo-report-badge" : ""}`}>

                  {results.is_demo ? "DEMO · SAMPLE DATA" : "ANALYSIS COMPLETE"}

                </span>



            </div>







            <div className="report-grid">



              <article className="paper-card match-card">



                <span className="card-kicker">YOUR OVERALL ALIGNMENT</span>



                <h3>A starting point for your next move.</h3>



                <ScoreRing score={matchScore} />



                <p className="report-copy">Use this score as a guide to explore how your experience aligns with this role.</p>



              </article>







              <article className="paper-card metrics-card">



                <span className="card-kicker">THE DETAILS</span>



                <h3>Three ways to look at your fit.</h3>



                {[



                  { label: "Text similarity", score: similarity },



                  { label: "Skill coverage", score: coverage },



                ].map((metric) => (



                  <div className="metric-row" key={metric.label}>



                    <div className="metric-label">



                      <span>{metric.label}</span><strong>{metric.score}%</strong>



                    </div>



                    <div className="metric-track">



                      <span style={{ width: `${metric.score}%` }} />



                    </div>



                  </div>



                ))}



                <p className="metric-note">These are comparison signals, not a guarantee of hiring outcomes.</p>



              </article>



            </div>







            <div className="skill-report-grid">



              <article className="paper-card skill-card">



                <span className="card-kicker">01 / ALREADY IN YOUR CORNER</span>



                <h3>Skills that connect</h3>



                <SkillChips skills={results.matched_skills} variant="sage" />



              </article>



              <article className="paper-card skill-card">



                <span className="card-kicker">02 / ROOM TO GROW</span>



                <h3>Skills to strengthen</h3>



                <SkillChips skills={results.missing_skills} variant="burgundy" />



              </article>



              <article className="paper-card skill-card">



                <span className="card-kicker">03 / YOUR CURRENT TOOLKIT</span>



                <h3>Skills found in your resume</h3>



                <SkillChips skills={results.resume_skills} variant="sage" />



              </article>



              <article className="paper-card skill-card">



                <span className="card-kicker">04 / THE ROLE ASKS FOR</span>



                <h3>Required skills</h3>



                <SkillChips skills={results.required_skills} variant="burgundy" />



              </article>



            </div>







            <article className="paper-card roadmap-card">



              <div className="roadmap-heading">



                <div>



                  <span className="card-kicker">YOUR NEXT CHAPTER</span>



                  <h3>A learning roadmap, made personal.</h3>



                  <p>Small, focused steps can help you work toward the skills this role requires.</p>



                </div>



                <div className="roadmap-stamp">KEEP<br />GROWING ✳</div>



              </div>



              <Roadmap items={results.learning_plan} />



            </article>



          </section>



        )}



      </main>







      <footer className="site-footer">



        <a className="wordmark footer-wordmark" href="#">



          <span className="wordmark-icon"><span /></span>



          <span>skillbridge<span className="wordmark-period">.</span></span>



        </a>



        <p>Built for the next version of you.</p>



        <span className="footer-note">THOUGHTFUL TOOLS. MEANINGFUL PROGRESS.</span>



      </footer>



    </div>



  );



}
