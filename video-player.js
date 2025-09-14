// Video Player functionality for Google Drive videos
document.addEventListener('DOMContentLoaded', function() {
  // Get modal elements
  const videoModal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  const closeModal = document.querySelector('.close-modal');
  
  // Store project video URLs with your actual Google Drive video IDs
  const projectVideos = {
    'smart-grid-monitoring-system': 'https://drive.google.com/file/d/1RyJzB9uqz2N0TjDua1W7kBAy3JFcULY8/preview',
    'renewable-energy-management': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_2/preview',
    'automated-irrigation-system': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_3/preview',
    'digital-circuit-simulator': 'https://drive.google.com/file/d/YOUR_VIDEO_ID_4/preview'
  };
  
  // Function to convert Google Drive share link to embed URL
  function convertToEmbedUrl(shareUrl) {
    // If it's already an embed URL, return it
    if (shareUrl.includes('/preview')) {
      return shareUrl;
    }
    
    // Extract file ID from various Google Drive URL formats
    let fileId = '';
    
    // Standard share link format
    if (shareUrl.includes('/file/d/')) {
      const match = shareUrl.match(/\/file\/d\/([^\/]+)/);
      if (match && match[1]) {
        fileId = match[1];
      }
    }
    // URL with view parameter
    else if (shareUrl.includes('drive.google.com/file/d/') && shareUrl.includes('/view')) {
      const parts = shareUrl.split('/');
      const dIndex = parts.indexOf('d');
      if (dIndex !== -1 && parts.length > dIndex + 1) {
        fileId = parts[dIndex + 1];
      }
    }
    // Shortened URL format
    else if (shareUrl.includes('drive.google.com/open?id=')) {
      fileId = shareUrl.split('id=')[1];
      // Remove any additional parameters
      if (fileId.includes('&')) {
        fileId = fileId.split('&')[0];
      }
    }
    
    // Return embed URL if we found a file ID
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    // Return original URL if we couldn't parse it
    return shareUrl;
  }
  
  // Function to open video modal
  function openVideoModal(videoUrl) {
    const embedUrl = convertToEmbedUrl(videoUrl);
    videoPlayer.src = embedUrl;
    videoModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  // Function to close video modal
  function closeVideoModal() {
    videoModal.style.display = 'none';
    videoPlayer.src = ''; // Stop video playback
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
  
  // Add click event to all demo buttons
  const demoButtons = document.querySelectorAll('.project-actions .btn-secondary');
  
  demoButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Find the parent project card
      const projectCard = this.closest('.project-card');
      
      // Get project title to identify which video to play
      const projectTitle = projectCard.querySelector('h3').textContent;
      const projectKey = projectTitle.toLowerCase().replace(/\s+/g, '-');
      
      // Get the video URL (if available)
      const videoUrl = projectVideos[projectKey];
      
      if (videoUrl) {
        openVideoModal(videoUrl);
      } else {
        alert('Video demonstration not available for this project yet.');
      }
    });
  });
  
  // Close modal when clicking on X
  if (closeModal) {
    closeModal.addEventListener('click', closeVideoModal);
  }
  
  // Close modal when clicking outside the content
  window.addEventListener('click', function(event) {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && videoModal.style.display === 'block') {
      closeVideoModal();
    }
  });
  
  // Additional function to handle direct URL conversion if needed
  window.convertDriveUrl = function(shareUrl) {
    return convertToEmbedUrl(shareUrl);
  };
});