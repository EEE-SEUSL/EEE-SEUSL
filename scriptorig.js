// Enhanced Preloader with Guaranteed 5s Loading (No Launch Button)
document.addEventListener("DOMContentLoaded", function() {
  // ======================
  // Preloader Functionality
  // ======================
  const launchScreen = document.getElementById("launch-screen");
  const preloader = document.getElementById("preloader");
  const typingText = document.getElementById("typing-text");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  
  // Configuration
  const fullText = "Electrical & Electronic Engineering Society";
  const minLoadingTime = 5000; // 5 seconds in milliseconds
  const typingSpeed = 100; // milliseconds per character
  const progressUpdateInterval = 50; // milliseconds
  
  // State variables
  let loadingStartTime;
  let progressInterval;

  // Check if preloader has already been shown in this session
  const preloaderShown = sessionStorage.getItem('preloaderShown');
  
  // Improved homepage detection
  function isHomePage() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop();
    return path === "/" || 
           path === "/index.html" || 
           path === "" || 
           pageName === "index.html" || 
           pageName === "";
  }

  // Only initialize if on homepage (where preloader should show)
  if (isHomePage()) {
    // If preloader has already been shown in this session, hide it immediately
    if (preloaderShown) {
      if (launchScreen) {
        launchScreen.style.display = "none";
      }
      document.body.style.overflow = "auto";
      return; // Exit the function early
    }
    
    // Initially hide the body content to prevent flash
    document.body.style.overflow = "hidden";
    
    if (preloader) {
      // Record start time
      loadingStartTime = Date.now();
      
      // Start typing animation
      typeText(fullText, typingText, function() {
        // After typing completes, start progress bar
        startProgressAnimation();
      });
    }
  } else {
    // On other pages, ensure scrolling is enabled
    document.body.style.overflow = "auto";
  }
  
  // Typing animation function
  function typeText(text, element, callback) {
    let i = 0;
    element.style.borderRight = "3px solid var(--golden-500)";
    
    function typing() {
      if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1);
        i++;
        setTimeout(typing, typingSpeed);
      } else {
        element.style.borderRight = "none";
        if (callback) callback();
      }
    }
    
    typing();
  }

  // Progress animation function
  function startProgressAnimation() {
    let progress = 0;
    const startTime = Date.now();
    
    // Clear any existing interval
    if (progressInterval) clearInterval(progressInterval);
    
    progressInterval = setInterval(function() {
      const elapsed = Date.now() - startTime;
      progress = Math.min(100, (elapsed / minLoadingTime) * 100);
      
      // Update progress bar
      progressFill.style.width = progress + "%";
      progressPercent.textContent = Math.floor(progress);
      
      // Check if we've reached 100% or 5 seconds
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Calculate remaining time to reach exactly 5 seconds
        const totalElapsed = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, minLoadingTime - totalElapsed);
        
        // Wait for remaining time if needed
        setTimeout(finishLoading, remainingTime);
      }
    }, progressUpdateInterval);
  }
  
  // Finish loading and transition to main site
  function finishLoading() {
    // Ensure progress shows 100%
    progressFill.style.width = "100%";
    progressPercent.textContent = "100";
    
    // Set flag in sessionStorage to indicate preloader has been shown in this session
    sessionStorage.setItem('preloaderShown', 'true');
    
    // Fade out preloader
    launchScreen.style.opacity = "0";
    
    // After fade completes, hide and enable scrolling
    setTimeout(function() {
      if (launchScreen) {
        launchScreen.style.display = "none";
      }
      document.body.style.overflow = "auto";

      window.dispatchEvent(new Event('scroll'));


    }, 500);
  }



  // ======================
  // Navigation Functionality
  // ======================
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (navbar && window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else if (navbar) {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on links
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu && navToggle) {
          navMenu.classList.remove("active");
          navToggle.classList.remove("active");
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }

  // Smooth navigation with page transition
  function navigateTo(url) {
    document.body.style.opacity = "0.95";
    setTimeout(() => {
      window.location.href = url;
    }, 150);
  }

  // Set active navigation link
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (
        link.getAttribute("href") === currentPage ||
        (currentPage === "" && link.getAttribute("href") === "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  // ======================
  // Carousel Functionality
  // ======================
  let currentSlideIndex = 0;
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    // Hide all slides
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show current slide
    if (slides[index]) {
      slides[index].classList.add("active");
    }
    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }

  function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
  }

  function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
  }

  function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
  }

  function changeSlide(direction) {
    if (direction === 1) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  // Auto-play carousel
  if (slides.length > 0) {
    setInterval(nextSlide, 5000);
  }

  // ======================
  // Gallery Functionality
  // ======================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          if (filter === "all") {
            item.style.display = "block";
          } else {
            const categories = item.getAttribute("data-category")?.split(" ") || [];
            if (categories.includes(filter)) {
              item.style.display = "block";
            } else {
              item.style.display = "none";
            }
          }
        });
      });
    });
  }

  // Lightbox functionality
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        if (img && lightboxImage) {
          lightboxImage.src = img.src;
          lightboxImage.alt = img.alt;
          lightbox.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    });

    // Close lightbox
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      if (lightbox) {
        lightbox.classList.remove("active");
      }
      document.body.style.overflow = "auto";
    }
  }

  // ======================
  // Contact Form Functionality
  // ======================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.email || !data.subject || !data.message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Simulate form submission
      alert("Thank you for your message! We will get back to you soon.");
      contactForm.reset();

      // In a real application, you would send the data to a server
      console.log("Form data:", data);
    });
  }

  // ======================
  // Scroll Animations
  // ======================
  function animateOnScroll() {
    const elements = document.querySelectorAll(".fade-in");

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("visible");
      }
    });
  }

  // Add fade-in class to elements that should animate
  const animatedElements = document.querySelectorAll(
    ".event-card, .member-card, .project-card, .achievement-card, .gallery-item"
  );
  animatedElements.forEach((element) => {
    element.classList.add("fade-in");
  });

  // Set active nav link
  setActiveNavLink();

  // Initial animation check
  animateOnScroll();

  // Listen for scroll events
  window.addEventListener("scroll", animateOnScroll);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ======================
  // Page Transition Effects
  // ======================
  window.addEventListener("beforeunload", () => {
    document.body.style.opacity = "0.95";
  });

  window.addEventListener("load", () => {
    document.body.style.opacity = "1";
    window.scrollTo(0, 0);
  });

  // ======================
  // Utility Functions
  // ======================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimized scroll handler
  const optimizedScrollHandler = debounce(() => {
    animateOnScroll();
  }, 10);

  window.addEventListener("scroll", optimizedScrollHandler);

  // Handle page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.log("Page hidden");
    } else {
      console.log("Page visible");
      animateOnScroll();
    }
  });

  // Error handling for images
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+";
      this.alt = "Image not available";
    });
  });

  // Console welcome message
  console.log("%c🎓 Welcome to EEES Website!", "color: #1e3a8a; font-size: 20px; font-weight: bold;");
  console.log("%cElectrical & Electronic Engineering Society - SEUSL", "color: #f59e0b; font-size: 14px;");



  const timelineItems = document.querySelectorAll('.timeline-item');

  function checkVisibility() {
    const windowHeight = window.innerHeight;
    
    timelineItems.forEach(item => {
        const position = item.getBoundingClientRect();
        
        // If item is in the viewport
        if (position.top < windowHeight * 0.85 && position.bottom >= 0) {
            item.classList.add('visible');
        }
    });
  }
  
  // Check visibility on load and scroll
  checkVisibility();
  window.addEventListener('scroll', checkVisibility);
  
  // Add slight delay between animations for better visual effect
  timelineItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.15}s`;
  });
});




