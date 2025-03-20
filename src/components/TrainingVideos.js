import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './TrainingVideos.css';
import trainingVideos from './videos/training-video.mp4'

const TrainingVideos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [likedVideos, setLikedVideos] = useState(
    JSON.parse(localStorage.getItem('likedVideos')) || []
  );
  const [bookmarkedVideos, setBookmarkedVideos] = useState(
    JSON.parse(localStorage.getItem('bookmarkedVideos')) || []
  );
  const [showLiked, setShowLiked] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [apiError, setApiError] = useState(null);

  const fetchVideos = async (query) => {
    setLoading(true);
    setApiError(null);
    try {
      const searchQuery = `${query} pet training`;
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: searchQuery,
          maxResults: '16',
          type: 'video',
          key: 'AIzaSyDqzfKKOG594ctCfGNVv1_uC8RDlMQXEyI'
        }
      });
      const videoItems = response.data.items.filter(item => item.id && item.id.videoId);

      if (videoItems.length === 0) {
        throw new Error('No valid videos found');
      }

      const videoIds = videoItems.map((video) => video.id.videoId).join(',');
      const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'contentDetails,snippet',
          id: videoIds,
          key: 'AIzaSyDqzfKKOG594ctCfGNVv1_uC8RDlMQXEyI'
        }
      });

      const videosWithDuration = videoItems.map((video, index) => ({
        ...video,
        duration: detailsResponse.data.items[index]?.contentDetails?.duration,
        thumbnail: detailsResponse.data.items[index]?.snippet?.thumbnails?.medium?.url || ''
      }));

      setVideos(videosWithDuration);
      setFilteredVideos(videosWithDuration);

      if (videosWithDuration.length > 0) {
        setFeaturedVideo(videosWithDuration[0]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setApiError('Failed to fetch videos. Please check your API key or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      fetchVideos(searchTerm);
    }
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    filterVideos(category, durationFilter);
  };

  const handleDurationFilter = (e) => {
    const duration = e.target.value;
    setDurationFilter(duration);
    filterVideos(categoryFilter, duration);
  };

  const filterVideos = (category, duration) => {
    let filtered = videos;

    if (category !== 'all') {
      filtered = filtered.filter((video) =>
        video.snippet.title.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (duration !== 'all') {
      filtered = filtered.filter((video) => {
        if (!video.duration) return false;
        const durationInSeconds = parseDuration(video.duration);
        if (duration === 'short') return durationInSeconds < 300;
        if (duration === 'medium') return durationInSeconds >= 300 && durationInSeconds <= 600;
        if (duration === 'long') return durationInSeconds > 600;
        return true;
      });
    }

    setFilteredVideos(filtered);
  };

  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatDuration = (duration) => {
    const seconds = parseDuration(duration);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const shareVideo = (e, video) => {
    e.stopPropagation();
    const shareText = `Check out this pet training video: ${video.snippet.title} on Petverse! ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: video.snippet.title,
        text: shareText,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`
      }).then(() => {
        console.log('Shared successfully');
      }).catch((err) => {
        console.error('Share failed:', err);
      });
    } else {
      alert('Share this link: ' + shareText);
    }
  };

  const handleLike = (e, videoId) => {
    e.stopPropagation();
    let updatedLikedVideos;
    if (likedVideos.includes(videoId)) {
      updatedLikedVideos = likedVideos.filter((id) => id !== videoId);
    } else {
      updatedLikedVideos = [...likedVideos, videoId];
    }
    setLikedVideos(updatedLikedVideos);
    localStorage.setItem('likedVideos', JSON.stringify(updatedLikedVideos));
  };

  const handleBookmark = (e, videoId) => {
    e.stopPropagation();
    let updatedBookmarkedVideos;
    if (bookmarkedVideos.includes(videoId)) {
      updatedBookmarkedVideos = bookmarkedVideos.filter((id) => id !== videoId);
    } else {
      updatedBookmarkedVideos = [...bookmarkedVideos, videoId];
    }
    setBookmarkedVideos(updatedBookmarkedVideos);
    localStorage.setItem('bookmarkedVideos', JSON.stringify(updatedBookmarkedVideos));
  };

  const handlePlayVideo = (videoId) => {
    console.log('Playing video with ID:', videoId);
    console.log('Current playingVideo:', playingVideo);
    setPlayingVideo(playingVideo === videoId ? null : videoId);
  };

  const getDisplayVideos = () => (showLiked ? filteredVideos.filter((video) => likedVideos.includes(video.id.videoId)) : filteredVideos);

  const scrollToVideos = () => {
    const videoGrid = document.querySelector('.video-grid');
    if (videoGrid) {
      videoGrid.scrollIntoView({ behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const videoGridRetry = document.querySelector('.video-grid');
        if (videoGridRetry) videoGridRetry.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  useEffect(() => {
    fetchVideos('pet training');
  }, []);

  useEffect(() => {
    console.log('playingVideo updated to:', playingVideo);
  }, [playingVideo]);

  return (
    <div className="training-videos-container">
      {/* Introductory Banner Section with Video */}
      <section className="intro-banner">
        <video className="intro-video" autoPlay loop muted playsInline>
          <source src={trainingVideos} type="video/mp4" />
          <img
            src="/fallback-image.jpg"
            alt="Fallback for video"
            className="intro-fallback"
          />
          Your browser does not support the video tag.
        </video>
        <div className="intro-overlay"></div>
        <div className="intro-content">
          <h1 className="intro-title">Train Your Pet with Petverse</h1>
          <p className="intro-tagline">
            Discover expert-led training videos to help your pet learn new skills, improve behavior, and build a stronger bond with you.
          </p>
          <button className="intro-cta-button" onClick={scrollToVideos}>
            Explore Videos Now
          </button>
        </div>
      </section>

      {/* Why Watch Section */}
      <section className="why-watch-section">
        <h2 className="why-watch-title">Why Watch Pet Training Videos?</h2>
        <div className="why-watch-grid">
          <div className="why-watch-item">
            <span className="why-watch-icon">🐾</span>
            <h3>Expert Guidance</h3>
            <p>Learn from professional trainers with years of experience in pet behavior.</p>
          </div>
          <div className="why-watch-item">
            <span className="why-watch-icon">🎥</span>
            <h3>Visual Learning</h3>
            <p>Follow step-by-step video tutorials to see techniques in action.</p>
          </div>
          <div className="why-watch-item">
            <span className="why-watch-icon">❤️</span>
            <h3>Strengthen Bonds</h3>
            <p>Training builds trust and understanding between you and your pet.</p>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      {featuredVideo && (
        <section className="featured-video-section">
          <h3 className="training-videos-featured-section-title">Featured Video</h3>
          <div className="featured-video-card">
            <div className="video-player-wrapper">
              {playingVideo !== featuredVideo.id.videoId && (
                <div
                  className="featured-thumbnail"
                  onClick={() => handlePlayVideo(featuredVideo.id.videoId)}
                >
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.snippet.title}
                    className="featured-thumbnail-image"
                  />
                  <div className="play-overlay">
                    <span className="play-icon">▶</span>
                  </div>
                  <div className="duration-badge">
                    {featuredVideo.duration ? formatDuration(featuredVideo.duration) : 'N/A'}
                  </div>
                </div>
              )}
              {playingVideo === featuredVideo.id.videoId && (
                <iframe
                  width="100%"
                  height="225"
                  src={`https://www.youtube.com/embed/${featuredVideo.id.videoId}?enablejsapi=1&autoplay=1`}
                  title={featuredVideo.snippet.title}
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <div className="featured-info">
              <h4 className="featured-title">{featuredVideo.snippet.title}</h4>
              <p className="featured-description">
                {featuredVideo.snippet.description.substring(0, 100)}...
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tabs for All Videos and Liked Videos */}
      <div className="video-tabs">
        <button
          className={`tab-button ${!showLiked ? 'active' : ''}`}
          onClick={() => setShowLiked(false)}
        >
          All Videos
        </button>
        <button
          className={`tab-button ${showLiked ? 'active' : ''}`}
          onClick={() => setShowLiked(true)}
          disabled={likedVideos.length === 0}
        >
          Liked Videos ({likedVideos.length})
        </button>
      </div>

      <section className="training-videos-filter-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for training videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        <div className="filter-controls">
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="filter-select"
          >
            <option value="all">All Pets</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
          </select>
          <select
            value={durationFilter}
            onChange={handleDurationFilter}
            className="filter-select"
          >
            <option value="all">All Durations</option>
            <option value="short">Under 5 mins</option>
            <option value="medium">5-10 mins</option>
            <option value="long">Over 10 mins</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="training-videos-loading">
          <div className="training-videos-spinner"></div>
          <p>Loading videos...</p>
        </div>
      ) : apiError ? (
        <div className="training-videos-error">
          <p>{apiError}</p>
          <p>Please contact support or use a valid API key.</p>
        </div>
      ) : (
        <div className="video-grid">
          {getDisplayVideos().length > 0 ? (
            getDisplayVideos().map((video, index) => {
              const videoId = video.id?.videoId;
              if (!videoId) {
                console.warn('Invalid video ID for video:', video);
                return null;
              }
              return (
                <div
                  key={videoId}
                  className="video-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="video-player-wrapper">
                    {playingVideo !== videoId && (
                      <div
                        className="video-thumbnail"
                        onClick={() => handlePlayVideo(videoId)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.snippet.title}
                          className="thumbnail-image"
                        />
                        <div className="play-overlay">
                          <span className="play-icon">▶</span>
                        </div>
                        <div className="duration-badge">
                          {video.duration ? formatDuration(video.duration) : 'N/A'}
                        </div>
                      </div>
                    )}
                    {playingVideo === videoId && (
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`}
                        title={video.snippet.title}
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.snippet.title}</h3>
                    <p className="video-description">
                      {video.snippet.description.substring(0, 100)}...
                    </p>
                    <div className="video-actions">
                      <button
                        className={`action-button like ${likedVideos.includes(videoId) ? 'liked' : ''}`}
                        onClick={(e) => handleLike(e, videoId)}
                      >
                        👍 {likedVideos.includes(videoId) ? 'Unlike' : 'Like'}
                      </button>
                      <button
                        className={`action-button bookmark ${bookmarkedVideos.includes(videoId) ? 'bookmarked' : ''}`}
                        onClick={(e) => handleBookmark(e, videoId)}
                      >
                        ★ {bookmarkedVideos.includes(videoId) ? 'Unbookmark' : 'Bookmark'}
                      </button>
                      <button
                        className="action-button share"
                        onClick={(e) => shareVideo(e, video)}
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No {showLiked ? 'liked' : ''} videos found for "{searchTerm}"</p>
          )}
        </div>
      )}

      <section className="training-tips-section">
        <h3 className="training-videos-section-title">Quick Training Tips</h3>
        <ul className="training-tips-list">
          <li>Use positive reinforcement with treats and praise.</li>
          <li>Keep training sessions short and consistent.</li>
          <li>Be patient and avoid punishment-based methods.</li>
          <li>Practice commands in different environments.</li>
        </ul>
      </section>

      <section className="success-stories-section">
        <h3 className="training-videos-section-title">Training Success Stories</h3>
        <div className="success-story">
          <p>
            "Using videos from Petverse, I taught my dog Bella to sit and stay in just two weeks!" - Emily R.
          </p>
        </div>
        <div className="success-story">
          <p>
            "My cat Whiskers learned to use a scratching post instead of my furniture, thanks to these videos!" - Mark T.
          </p>
        </div>
      </section>

      <section className="resources-section">
        <h3 className="training-videos-section-title">Additional Training Resources</h3>
        <ul className="resources-list">
          <li><a href="#">Top 10 Commands Every Dog Should Know</a></li>
          <li><a href="#">How to Train Your Cat to Use a Litter Box</a></li>
          <li><a href="#">Bird Training Basics: Teaching Your Bird to Talk</a></li>
          <li><a href="#">Clicker Training for Pets: A Beginner’s Guide</a></li>
        </ul>
      </section>

      <section className="volunteer-cta-section">
        <h3 className="training-videos-section-title">Volunteer for Training Workshops</h3>
        <p>
          Love training pets? Join our community of volunteers to host training workshops and help other pet owners!
        </p>
        <button className="cta-button">Sign Up to Volunteer</button>
      </section>

      <section className="cta-banner">
        <div className="cta-content">
          <h3 className="cta-title">Share Your Training Tips!</h3>
          <p>Have a great training video or tip? Share it with the Petverse community!</p>
          <button className="cta-button">Submit Your Video</button>
        </div>
      </section>
    </div>
  );
};

export default TrainingVideos;