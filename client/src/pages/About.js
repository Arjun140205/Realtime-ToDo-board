import './About.css';

const About = () => (
  <div 
    className="about-container"
    style={{
      backgroundImage: 'url("/about.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}
  >
    <div className="about-card">
      <h1 className="about-title">About TodoBoard</h1>
      <p className="about-desc">
        <b>TodoBoard</b> is a modern, real-time Kanban board app designed for productivity and collaboration. Organize your tasks, track progress, and work seamlessly—whether solo or with a team. Built with React and Node.js, it features real-time updates, conflict resolution, and a beautiful, responsive UI. <br /><br />
        <span className="about-highlight">Drag, drop, and get things done!</span>
      </p>
      <div className="about-anim-bg"></div>
    </div>
  </div>
);

export default About; 