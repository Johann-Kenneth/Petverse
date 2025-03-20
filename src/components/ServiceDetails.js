import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ServiceDetails.css';
import serviceDetails from './videos/service-details-video.mp4'

const ServiceDetails = () => {
  const { title } = useParams();
  const [activeService, setActiveService] = useState('');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  const services = [
    { name: 'Nearby Pet Shops', path: '/Nearby-Pet-Shops', color: '#1a3c34', rating: 4.5 },
    { name: 'Nearby Doctors', path: '/Nearby-Doctors', color: '#1a3c34', rating: 4.7 },
    { name: 'Report Lost Pet', path: '/post-alert', color: '#1a3c34', rating: 4.2 },
    { name: 'Missing Pets', path: '/Missing-Pets', color: '#1a3c34', rating: 4.4 },
    { name: 'Training Videos', path: '/Training-Videos', color: '#1a3c34', rating: 4.6 },
    { name: 'Pets First Aid', path: '/pet-first-aid', color: '#1a3c34', rating: 4.5 },
    { name: 'Pet ID', path: '/pet-passport', color: '#1a3c34', rating: 4.5 },
    { name: 'Pet Names', path: '/pet-name', color: '#1a3c34', rating: 4.1 },
    { name: 'Find Pets', path: '/adoptable-pets', color: '#1a3c34', rating: 4.8 },
    { name: 'Find Shelters', path: '/pet-shelters', color: '#1a3c34', rating: 4.5 },
    { name: 'Pet Food Recommendation', path: '/pet-food-recommendation', color: '#1a3c34', rating: 4.7 },
  ];

  const userTestimonials = [
    { user: 'Sarah M.', service: 'Nearby Doctors', rating: 4.9, comment: 'The vet I found through Petverse was amazing! My dog got the best care.' },
    { user: 'John P.', service: 'Find Pets', rating: 4.7, comment: 'Adopted a lovely cat thanks to Petverse’s adoption network!' },
    { user: 'Emily R.', service: 'Vaccination Reminder', rating: 4.5, comment: 'The reminders helped me keep my pet’s vaccinations up to date.' },
    { user: 'Michael T.', service: 'Training Videos', rating: 4.8, comment: 'The training videos were super helpful in teaching my dog new tricks!' },
  ];

  // Set active service based on URL parameter
  useEffect(() => {
    console.log('ServiceDetails - Raw title from URL:', title); // Debug log
    const decodedTitle = decodeURIComponent(title || '');
    console.log('ServiceDetails - Decoded title:', decodedTitle); // Debug log
    const service = services.find((s) => decodeURIComponent(s.path.split('/service-details/')[1]) === decodedTitle);
    console.log('ServiceDetails - Found service:', service); // Debug log
    setActiveService(service ? service.name : 'Service Details');
  }, [title, services]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % userTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [userTestimonials.length]);

  // Improved scroll animation with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleSections = {};
        entries.forEach((entry) => {
          newVisibleSections[entry.target.id] = entry.isIntersecting;
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
        setVisibleSections(newVisibleSections);
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const getServiceContent = (serviceName) => {
    switch (serviceName) {
      case 'Nearby Pet Shops':
        return {
          title: 'Nearby Pet Shops',
          description:
            'Discover a wide range of pet shops and grooming centers near your location with Petverse. From premium pet food to professional grooming services, find everything your pet needs with ease. Our curated list ensures quality and convenience, featuring stores with expert staff and a variety of products tailored to cats, dogs, birds, and more! Whether you need high-quality treats, stylish collars, or specialized care items, Petverse connects you to the best local options.',
          backgroundVideo: '/videos/petshop-video.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.5,
          reviews: 120,
          benefits: [
            'Access to top-rated pet stores with verified reviews.',
            'Find grooming services tailored to your pet’s needs, including breed-specific cuts.',
            'Explore a variety of pet accessories, toys, and beds for comfort.',
            'Convenient online booking for grooming appointments with flexible scheduling.',
            'Receive personalized product recommendations based on your pet’s breed.',
          ],
          tips: [
            'Check for stores offering organic pet food for better health and longevity.',
            'Look for grooming centers with experienced staff certified in pet care.',
            'Ask about loyalty programs for regular discounts on supplies and services.',
            'Visit during off-peak hours for a personalized experience and less wait time.',
            'Bring your pet along to ensure the shop meets their specific needs.',
          ],
        };
      case 'Nearby Doctors':
        return {
          title: 'Nearby Doctors',
          description:
            'Locate trusted veterinarians in your area to provide expert medical care for your pets. Our network includes highly qualified vets offering routine checkups, surgeries, and emergency services to keep your pets healthy. With Petverse, you can find specialists for dental care, dermatology, and even exotic pets, ensuring comprehensive support for your furry, feathered, or scaled friends.',
          backgroundVideo: '/videos/pets-doctor-video.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1606923828922-8a55d098e7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.7,
          reviews: 150,
          benefits: [
            'Connect with licensed veterinarians near you with specialized expertise.',
            'Schedule appointments for routine or emergency care with online booking.',
            'Access 24/7 emergency vet services for peace of mind.',
            'Receive personalized health plans for your pet based on their age and breed.',
            'Get access to telehealth consultations for quick advice.',
          ],
          tips: [
            'Bring your pet’s medical history for a thorough checkup and accurate diagnosis.',
            'Ask about vaccination schedules and preventive care during your visit.',
            'Ensure the vet clinic has emergency after-hours support for urgent situations.',
            'Prepare questions in advance to maximize your visit and address all concerns.',
            'Follow up with the vet for post-treatment care instructions.',
          ],
        };
      case 'Report Lost Pet':
        return {
          title: 'Report Lost Pet',
          description:
            'Lost your pet? Report it through Petverse to get community support. Include a photo, description, and location to increase the chances of reuniting with your furry friend. Our platform connects you with local pet lovers, shelters, and rescue groups, offering a powerful network to spread the word and track sightings in real-time.',
          backgroundVideo: 'https://videos.pexels.com/video-files/3191812/3191812-hd_1920_1080_30fps.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.2,
          reviews: 80,
          benefits: [
            'Instantly alert the Petverse community about your lost pet with a single click.',
            'Share real-time location details and updates for faster searches.',
            'Receive notifications if someone spots your pet or has relevant information.',
            'Access a dedicated support team for lost pet cases with expert guidance.',
            'Get access to a map feature to track search efforts.',
          ],
          tips: [
            'Include a recent photo of your pet for better identification and recognition.',
            'Provide specific details like collar color, unique markings, or microchip info.',
            'Check local shelters and vet clinics regularly after reporting.',
            'Spread the word on social media and local groups for wider reach.',
            'Offer a reward to encourage community assistance.',
          ],
        };
      case 'Missing Pets':
        return {
          title: 'Missing Pets',
          description:
            'Browse our database of missing pets and help reunite them with their owners. Check daily updates, share posts, and contribute to our community effort to bring pets back home safely. Our platform features detailed profiles, including photos and last-known locations, making it easier to spot and report missing pets in your area.',
          backgroundVideo: 'https://videos.pexels.com/video-files/3191812/3191812-hd_1920_1080_30fps.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.4,
          reviews: 95,
          benefits: [
            'View a comprehensive list of missing pets in your area with detailed profiles.',
            'Share missing pet posts to increase visibility across the Petverse network.',
            'Collaborate with the community to reunite pets with owners through coordinated efforts.',
            'Get real-time updates on missing pet sightings and recovery statuses.',
            'Access a reporting tool to submit sightings directly.',
          ],
          tips: [
            'Keep an eye out for pets matching descriptions in your neighborhood or parks.',
            'Share missing pet posts on social media and community boards for wider reach.',
            'Contact the owner immediately if you spot a missing pet with matching details.',
            'Report any sightings to the Petverse community for verification.',
            'Distribute flyers in your local area to boost awareness.',
          ],
        };
      case 'Training Videos':
        return {
          title: 'Training Videos',
          description:
            'Access our library of professional training videos to teach your pet new tricks and behaviors. From basic commands to advanced training, our experts guide you step-by-step for a well-behaved pet. Our collection includes tailored sessions for puppies, senior dogs, cats, and even exotic pets, with downloadable resources to support your training journey.',
          backgroundVideo: 'https://videos.pexels.com/video-files/3191812/3191812-hd_1920_1080_30fps.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1507915135761-5bb418f3e05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.6,
          reviews: 110,
          benefits: [
            'Learn from professional trainers with years of experience in pet behavior.',
            'Access videos for all skill levels, from beginner to advanced techniques.',
            'Improve your pet’s behavior with consistent training and positive reinforcement.',
            'Downloadable guides and cheat sheets to complement video lessons.',
            'Join live Q&A sessions with trainers for personalized advice.',
          ],
          tips: [
            'Set aside 10-15 minutes daily for training sessions to build consistency.',
            'Use treats as positive reinforcement to encourage good behavior.',
            'Be patient and consistent with commands to avoid confusion.',
            'Practice in a quiet environment for better focus and engagement.',
            'Celebrate small milestones to keep your pet motivated.',
          ],
        };
      
      case 'Pet Names':
        return {
          title: 'Pet Names',
          description:
            'Find the perfect name for your pet with our extensive list of creative and unique suggestions. Filter by theme, breed, or personality to inspire your choice and make naming fun! Our database includes names inspired by nature, mythology, pop culture, and more, perfect for every pet type.',
          backgroundVideo: 'https://videos.pexels.com/video-files/3191812/3191812-hd_1920_1080_30fps.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.1,
          reviews: 70,
          benefits: [
            'Browse names by category, such as classic, quirky, or cultural themes.',
            'Get inspiration based on your pet’s personality, breed, or appearance.',
            'Share your favorite names with friends for feedback and suggestions.',
            'Access name trends for the latest ideas and popular choices.',
            'Save your favorites to a personal list for easy reference.',
          ],
          tips: [
            'Choose a name that’s easy for your pet to recognize with two syllables.',
            'Test the name by calling it out loud a few times to see how it feels.',
            'Pick a name that reflects your pet’s unique traits or your interests.',
            'Involve family members in the naming process for a group decision.',
            'Avoid names similar to common commands to prevent confusion.',
          ],
        };
      case 'Find Pets':
        return {
          title: 'Find Pets',
          description:
            'Explore adoptable pets in your area through Petverse’s adoption network. Browse profiles, contact shelters, and bring a new companion home with our easy-to-use adoption tools. Our platform features detailed pet bios, adoption fees, and shelter contact info to streamline your journey to pet parenthood.',
          backgroundVideo: 'https://videos.pexels.com/video-files/3191812/3191812-hd_1920_1080_30fps.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1606923828922-8a55d098e7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.8,
          reviews: 160,
          benefits: [
            'View detailed profiles of adoptable pets with photos and videos.',
            'Filter by breed, age, size, and location for the perfect match.',
            'Connect directly with shelters for adoption inquiries and visits.',
            'Receive adoption success stories and tips for new pet owners.',
            'Access a virtual adoption event calendar.',
          ],
          tips: [
            'Visit the shelter to meet the pet before adopting to ensure compatibility.',
            'Prepare your home with necessary supplies like food, beds, and toys beforehand.',
            'Ensure you’re ready for the responsibilities of pet ownership, including costs.',
            'Ask about the pet’s history, health, and behavior during your visit.',
            'Consider fostering first if you’re unsure about long-term adoption.',
          ],
        };
      case 'Find Shelters':
        return {
          title: 'Find Shelters',
          description:
            'Locate pet shelters near you for adoption, rescue, or support. Our directory provides contact info, services, and directions to help you connect with local animal welfare organizations. Whether you’re adopting, volunteering, or donating, Petverse links you to shelters committed to animal care.',
          backgroundVideo: 'https://videos.pexels.com/video-files/3191812/3191812-hd_1920_1080_30fps.mp4',
          fallbackImage: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.5,
          reviews: 130,
          benefits: [
            'Find shelters offering adoption, rescue, and rehabilitation services.',
            'Access contact details, visiting hours, and location maps.',
            'Support local animal welfare initiatives with donations or volunteering.',
            'Learn about volunteer opportunities and training programs.',
            'Get updates on shelter events and adoption drives.',
          ],
          tips: [
            'Call ahead to confirm the shelter’s adoption process and requirements.',
            'Consider volunteering at a shelter to help animals and gain experience.',
            'Donate supplies like food, blankets, or toys to support shelter operations.',
            'Attend adoption events for a hands-on experience and to meet pets.',
            'Check shelter reviews to ensure they align with your values.',
          ],
        };
        case 'Pet Food Recommendation':
        return {
          title: 'Pet Food Recommendation',
          description:
            'Get personalized food recommendations for your pet based on its age, breed, size, activity level, and health conditions. Our advanced system uses expert insights to suggest the best diets, including dry kibble, wet food, or raw diets, tailored to your pet’s unique needs. Start your journey to optimal pet nutrition with Petverse!',
          backgroundVideo: {serviceDetails},
          fallbackImage: 'https://images.unsplash.com/photo-1606923828922-8a55d098e7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
          rating: 4.7,
          reviews: 90,
          benefits: [
            'Receive tailored food suggestions based on your pet’s specific profile.',
            'Explore a variety of diet types, including kibble, wet food, and raw diets.',
            'Access recommendations from a wide range of trusted brands.',
            'Get dietary tips to improve your pet’s health and energy levels.',
            'Enjoy a user-friendly process with quick, personalized results.',
          ],
          tips: [
            'Provide accurate details about your pet for the best recommendations.',
            'Consult your vet to align suggestions with your pet’s health plan.',
            'Introduce new food gradually to avoid digestive issues.',
            'Monitor your pet’s reaction to new diets and adjust as needed.',
            'Check for brand availability at local pet stores or online.',
          ],
          actionLink: '/pet-food-recommendation', // Link to the dedicated recommendation page
        };
      default:
        return {
          title: 'Service Details',
          description:
            'Explore all the exceptional services offered by Petverse to care for your pets and enhance your pet-owning experience. From health and training to adoption and community support, Petverse is your all-in-one solution for pet care, designed to make every moment with your pet special and stress-free.',
          backgroundVideo: {serviceDetails},
          fallbackImage: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.5,
          reviews: 100,
          benefits: [
            'Comprehensive care options for pets of all types and ages.',
            'Easy access to a supportive pet community.',
            'Tailored services to meet your pet’s unique needs.',
            'Regular updates and resources for pet owners.',
            'Trusted platform with a focus on pet welfare.',
          ],
          tips: [
            'Explore all services to find the best fit for your pet.',
            'Stay updated with Petverse’s blog for pet care tips.',
            'Connect with other pet owners for advice and support.',
            'Use the platform regularly to maintain your pet’s health.',
            'Provide feedback to help improve our services.',
          ],
        };
    }
  };

  const content = getServiceContent(activeService);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.floor(rating) ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return (
      <div className="rating">
        {stars} <span className="rating-value">({rating}/5)</span>
      </div>
    );
  };

  // Function to scroll to services sidebar
  const scrollToSidebar = () => {
    const sidebar = document.querySelector('#sidebar-section');
    if (sidebar) {
      sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="service-details-container">
      {/* Top Banner with Background Video */}
      <section className="sd-banner-section animate-on-scroll fade-in" id="banner-section">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="sd-banner-video"
          poster={content.fallbackImage}
        >
          <source src={serviceDetails} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="sd-banner-content">
          <h1 className="sd-banner-title">Welcome to {content.title}</h1>
          <p className="sd-banner-description">
            Discover how Petverse can enhance your pet’s life with tailored services. Let’s get started on this journey together!
          </p>
          <button className="sd-banner-cta-btn slide-in-right" onClick={scrollToSidebar}>
            Explore Now
          </button>
        </div>
      </section>

      <div className="content-wrapper">
        <aside className="services-sidebar animate-on-scroll slide-in-left" id="sidebar-section">
          <h3>Our Services</h3>
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              className={`service-item ${activeService === service.name ? 'active' : ''}`}
              style={{ backgroundColor: activeService === service.name ? service.color : '#e0e8e0' }}
            >
              {service.name} <span>▶</span>
            </Link>
          ))}
        </aside>
        <main className="main-content">
          <section className="service-description animate-on-scroll fade-in-up" id="description-section">
            <h2>{content.title}</h2>
            {renderStars(content.rating)}
            <p className="reviews">Based on {content.reviews} reviews</p>
            <p className="service-main-description">{content.description}</p>
            {content.benefits.length > 0 && (
              <div className="service-benefits">
                <h3>Why Choose This Service?</h3>
                <ul>
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.tips.length > 0 && (
              <div className="service-tips">
                <h3>Tips for Best Results</h3>
                <ul>
                  {content.tips.map((tip, index) => (
                    <li key={index} className="tip-item">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </main>
      </div>

      <section className="testimonial-section animate-on-scroll fade-in" id="testimonial-section">
        <h2 className="section-title scale-in">What Our Customers Say</h2>
        <div className="testimonial-card">
          <p>{userTestimonials[currentTestimonialIndex].comment}</p>
          <span>
            - {userTestimonials[currentTestimonialIndex].user} <span className="rating-value">({userTestimonials[currentTestimonialIndex].rating}/5)</span>
          </span>
        </div>
      </section>

      <section className="faq-section animate-on-scroll fade-in-up" id="faq-section">
        <h2 className="service-section-title scale-in">Frequently Asked Questions</h2>
        <div className="faq-content">
          <details>
            <summary>How do I know if a pet shop is reliable?</summary>
            <p>Look for shops with high ratings, verified reviews, and a good reputation in the community. Petverse only lists shops that meet our quality standards.</p>
          </details>
          <details>
            <summary>What should I do if I find a missing pet?</summary>
            <p>Contact the owner through the details provided on Petverse, or take the pet to a local shelter to scan for a microchip. Share the sighting on our platform to help reunite them.</p>
          </details>
          <details>
            <summary>Can I set multiple vaccination reminders?</summary>
            <p>Yes, you can set reminders for each of your pets and customize the dates and notification preferences through Petverse’s service.</p>
          </details>
        </div>
      </section>

      <section className="cta-banner animate-on-scroll fade-in" id="cta-section">
        <div className="cta-content">
          <h2 className="section-title scale-in">Ready to Care for Your Pet?</h2>
          <p>Join Petverse today and explore all our services to keep your pet happy and healthy!</p>
          <button className="cta-btn slide-in-right">Get Started</button>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;