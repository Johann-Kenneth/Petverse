import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import teamMember1 from './images/Gaja.WEBP';
import teamMember2 from './images/Gouri Parvathy.WEBP';
import teamMember3 from './images/joo_whitebg.jpeg';
import teamMember4 from './images/arshitha.jpeg';
import './About.css';

const About = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Petverse</h1>
        <p className="header-subtitle">
          Connecting pets and owners through love, technology, and community.
        </p>
      </header>

      <section id="our-story" className="about-section">
        <h2>Our Story</h2>
        <div className="section-content">
          <p>
            Petverse was founded in 2025 with a heartfelt mission to reunite lost pets with their owners. Our journey began when our founder, Jane Doe, experienced the heartbreak of losing her beloved dog, Max. After days of searching and posting flyers with no success, Jane realized there was a gap in the pet community—a need for a centralized, technology-driven platform to help pet owners in similar situations.
          </p>
          <p>
            Driven by her passion for animals, Jane assembled a team of like-minded individuals to create Petverse, a platform that leverages technology to connect pet owners, shelters, and communities. Since its inception, Petverse has grown into a global network, helping thousands of pets find their way back home. We’re more than just a platform; we’re a community built on love, hope, and the shared belief that every pet deserves a happy reunion.
          </p>
        </div>
      </section>

      <section id="team" className="about-section">
        <h2>Our Team</h2>
        <div className="section-content">
          <p>
            Behind Petverse is a dedicated team of pet lovers, tech enthusiasts, and community builders who work tirelessly to make a difference in the lives of pets and their owners.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <img src={teamMember1} alt="Team Member 1" className='team-photo'/>
              <h3>Gaja Lakshmi</h3>
              <p className="team-role">Designer</p>
              <p>
                Gaja’s love for animals and her personal experience with losing Max inspired her to create Petverse. She leads the team with a vision to make pet reunification accessible to everyone.
              </p>
            </div>
            <div className="team-member">
            <img src={teamMember3} alt="Team Member 2" className='team-photo'/>
              <h3>Johann Kenneth</h3>
              <p className="team-role">Lead Developer</p>
              <p>
                Johann is the tech genius behind Petverse’s platform. With over 10 years of experience in software development, he ensures our tools are user-friendly and efficient.
              </p>
            </div>
            <div className="team-member">
            <img src={teamMember2} alt="Team Member 3" className='team-photo'/>
              <h3>Gouri Parvathy</h3>
              <p className="team-role">Developer</p>
              <p>
                Gouri connects with pet owners and shelters, building a supportive community. Her passion for animal welfare drives our outreach and engagement efforts.
              </p>
            </div>
            <div className="team-member">
              <img src={teamMember4} alt="Team Member 4" className='team-photo'/>
              <h3>Arshitha</h3>
              <p className="team-role">Designer</p>
              <p>
              Arshitha’s deep passion for animals and her personal experience with losing her beloved pet, Luna, inspired her to create Petverse. She leads the team with a heartfelt vision to make pet reunification accessible and seamless for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="mission-vision" className="about-section">
        <h2>Mission & Vision</h2>
        <div className="section-content">
          <div className="mission-vision-content">
            <div className="mission">
              <h3>Our Mission</h3>
              <p>
                To create a global community where no pet goes missing without a chance to be found. We aim to empower pet owners with tools to locate their lost companions and support shelters in reuniting pets with their families.
              </p>
            </div>
            <div className="vision">
              <h3>Our Vision</h3>
              <p>
                To be the leading platform for pet reunification worldwide, leveraging cutting-edge technology, community support, and partnerships with shelters and veterinarians to ensure every pet has a safe home.
              </p>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            alt="Happy pet reunion"
            className="section-image"
          />
        </div>
      </section>

      <section id="our-impact" className="about-section">
        <h2>Our Impact</h2>
        <div className="section-content">
          <p>
            Since launching in 2020, Petverse has made a significant impact in the pet community. Here are some of our proudest achievements:
          </p>
          <div className="impact-stats">
            <div className="stat">
              <h3>10,000+</h3>
              <p>Pets Reunited</p>
            </div>
            <div className="stat">
              <h3>50,000+</h3>
              <p>Community Members</p>
            </div>
            <div className="stat">
              <h3>1,200+</h3>
              <p>Partner Shelters</p>
            </div>
          </div>
          <p>
            We’re committed to growing these numbers and continuing our mission to ensure every pet has a chance to return home. Join us in making a difference!
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;