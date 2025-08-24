

// Enhanced Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.syllabus-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const searchToggle = document.getElementById('search-toggle');
    const navSearch = document.getElementById('nav-search');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Close search if open
        if (navSearch.classList.contains('active')) {
            navSearch.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });
    
    // Search toggle
    searchToggle.addEventListener('click', () => {
        navSearch.classList.toggle('active');
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
        
        // Focus on input when search is opened
        if (navSearch.classList.contains('active')) {
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        } else {
            searchResults.classList.remove('active');
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
        if (isDarkMode) {
            document.body.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (navSearch.classList.contains('active') && 
            !e.target.closest('#nav-search') && 
            !e.target.closest('#search-toggle')) {
            navSearch.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });
    
    // Search functionality
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(searchInput.value.trim());
    });
    
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            searchResults.classList.remove('active');
        } else {
            performSearch(searchInput.value.trim());
        }
    });
    
    function performSearch(query) {
        if (query === '') {
            searchResults.classList.remove('active');
            return;
        }
        
        // Simple search implementation
        const content = document.body.textContent.toLowerCase();
        const searchTerms = query.toLowerCase().split(' ');
        
        // Find sections that contain the search terms
        const sections = document.querySelectorAll('.section, .card, .highlight-box');
        const results = [];
        
        sections.forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            let matchCount = 0;
            
            searchTerms.forEach(term => {
                if (sectionText.includes(term)) {
                    matchCount++;
                }
            });
            
            if (matchCount > 0) {
                // Get the section title or heading
                const heading = section.querySelector('h2, h3') || 
                               section.closest('.section')?.querySelector('h2');
                const headingText = heading ? heading.textContent : 'Content';
                
                // Get a snippet of text around the first match
                const firstMatchIndex = sectionText.indexOf(searchTerms[0]);
                const start = Math.max(0, firstMatchIndex - 50);
                const end = Math.min(sectionText.length, firstMatchIndex + 100);
                let snippet = sectionText.substring(start, end);
                
                // Highlight the search terms in the snippet
                searchTerms.forEach(term => {
                    const regex = new RegExp(term, 'gi');
                    snippet = snippet.replace(regex, '<mark>$&</mark>');
                });
                
                results.push({
                    heading: headingText,
                    snippet: snippet,
                    element: section
                });
            }
        });
        
        // Display results
        displaySearchResults(results, query);
    }
    
    function displaySearchResults(results, query) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = `<div class="result-item"><p>No results found for "${query}"</p></div>`;
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <h4>${result.heading}</h4>
                    <p>${result.snippet}...</p>
                `;
                
                resultItem.addEventListener('click', () => {
                    result.element.scrollIntoView({ behavior: 'smooth' });
                    navSearch.classList.remove('active');
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.classList.add('active');
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize quote carousel
    initQuoteCarousel();
    
    // Initialize chatbot functionality
    initChatbot();
    
    // Initialize custom cursor
    const cursor = document.querySelector('.cursor');
    
    // Show custom cursor and hide default one
    cursor.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .section-title').forEach(el => {
        observer.observe(el);
    });
});

// Enhanced Quote Carousel Functionality
function initQuoteCarousel() {
    const quotes = document.querySelectorAll('.quote');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const carousel = document.querySelector('.quote-carousel');
    
    // Check if elements exist
    if (!quotes.length || !dots.length) {
        console.error('Carousel elements not found');
        return;
    }
    
    let currentQuote = 0;
    let autoPlayInterval;
    
    // Function to show a specific quote
    function showQuote(index) {
        // Hide all quotes
        quotes.forEach(quote => {
            quote.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected quote and update active dot
        quotes[index].style.display = 'block';
        dots[index].classList.add('active');
        
        // Update current quote index
        currentQuote = index;
        
        // Add subtle animation to carousel
        carousel.style.animation = 'none';
        setTimeout(() => {
            carousel.style.animation = 'pulse 1s ease';
        }, 10);
    }
    
    // Next quote function
    function nextQuote() {
        let nextIndex = (currentQuote + 1) % quotes.length;
        showQuote(nextIndex);
    }
    
    // Previous quote function
    function prevQuote() {
        let prevIndex = (currentQuote - 1 + quotes.length) % quotes.length;
        showQuote(prevIndex);
    }
    
    // Set up auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextQuote, 7000);
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners for navigation
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextQuote();
            startAutoPlay();
        });
        
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevQuote();
            startAutoPlay();
        });
    }
    
    // Event listeners for dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                showQuote(index);
                startAutoPlay();
            });
        });
    }
    
    // Pause auto-play when hovering over carousel
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Show the first quote immediately
    showQuote(0);
    
    // Initialize auto-play
    startAutoPlay();
}

// Chatbot functionality
function initChatbot() {
    const chatbotWidget = document.querySelector('.chatbot-widget');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-text-input');
    const chatbotSend = document.querySelector('.chatbot-send');
    
    // Create typing indicator element
    function createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chatbot-message', 'chatbot-response', 'typing-indicator');
        
        const dotContainer = document.createElement('div');
        dotContainer.classList.add('typing-dots');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dotContainer.appendChild(dot);
        }
        
        typingDiv.appendChild(dotContainer);
        return typingDiv;
    }
    
    // Remove typing indicator
    function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.remove();
        }
    }
    
    // Simulate typing effect
    function typeMessage(message, element, callback) {
        let i = 0;
        const typingSpeed = 10 + Math.random() * 15;
        
        function type() {
            if (i < message.length) {
                element.textContent += message.charAt(i);
                i++;
                setTimeout(type, typingSpeed);
                
                // Scroll to bottom as we type
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }
    
    // Add message to chat
    function addMessage(text, isQuestion = false, isInitialGreeting = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message');
        messageDiv.classList.add(isQuestion ? 'chatbot-question' : 'chatbot-response');
        
        const messageText = document.createElement('p');
        messageDiv.appendChild(messageText);
        
        if (isQuestion) {
            // For questions, show immediately
            messageText.textContent = text;
            chatbotMessages.appendChild(messageDiv);
        } else if (isInitialGreeting) {
            // For initial greeting
            messageText.textContent = text;
            chatbotMessages.appendChild(messageDiv);
        } else {
            // For normal responses
            const typingIndicator = createTypingIndicator();
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            setTimeout(() => {
                // Replace typing indicator with actual message
                typingIndicator.replaceWith(messageDiv);
                typeMessage(text, messageText);
            }, 500 + Math.random() * 500);
        }
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Handle sending messages
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatbotInput.value = '';
            
            // Get response after a short delay
            setTimeout(() => {
                const response = getChatbotResponse(message);
                addMessage(response);
            }, 500);
        }
    }
    
    function getChatbotResponse(question) {
    const lowerQuestion = question.toLowerCase().trim();
    
    // EXTENSION REQUESTS
    if (/(how|can|what).*(request|get|ask for|apply for).*extension|need more time.*assignment|(extension|late).*policy|(can't|won't).*make.*deadline|(miss|late).*due date|life happens extension/i.test(lowerQuestion)) {
        return "You have one 48-hour 'Life Happens' extension available per semester. Just email me to let me know you'd like to use it—no explanation needed. This extension cannot be used for your final conference paper. Regular late work penalties: <1 hour (5%), 1 class day (10%), 2 class days (20%), >1 week (max 50%).";
    }
    
    // COURSE BASICS
    if (/what('s| is).*(class|course|engl\s?100b|composition)|(can you|could you).*(tell me|explain).*(about|this).*class|what.*we.*do.*in.*class|describe.*(course|class)|overview.*of.*class|what.*cover.*in.*this.*class|what.*learn.*in.*(this|the).*class|what's.*the.*point.*of.*this.*class|why.*take.*this.*class/i.test(lowerQuestion)) {
        return "ENGL 100B is an expository writing course designed for first-year students. It satisfies one of the writing requirements for general education at CSULB. The course emphasizes academic discourse, focusing on analytical reading, thesis-driven writing, and rhetorical strategies.";
    }
    
    if (/(what|what's|what will|how).*(learn|gain|get from|take away from).*(class|course)|(skills|outcomes|abilities).*(from|in).*class|why.*take.*this.*class|what's.*the.*point.*of.*this.*class|how.*this.*class.*help.*me|what.*teach.*in.*this.*class|what.*get.*out.*of.*class|how.*improve.*(writing|reading).*in.*this.*class/i.test(lowerQuestion)) {
        return "In this class, you'll learn to: compose work using multiple modalities; assess rhetorical purpose; develop academic essays with evidence and sources; use organizational patterns effectively; demonstrate critical comprehension of college-level reading; and control sentence structure, grammar, and mechanics.";
    }
    
    // SCHEDULE & ATTENDANCE
    if (/(when|what time|where|what days).*(class|meet|lecture|session).*(schedule|time|location|room|la2-100)|(class|lecture).*(schedule|time|meet|location)|(day|time).*of.*class|when.*we.*meet|what.*are.*class.*hours|(where|when).*is.*(class|lecture)|how.*often.*we.*meet/i.test(lowerQuestion)) {
        return "Our class meets in person on Mondays, Wednesdays, and Fridays from 9:00–9:50 AM in Room LA2-100.";
    }
    
    if (/(attendance|absent|miss|late|tardy).*(policy|rule|requirement|grade|count|drop)|how many.*(absences|misses|lates).*allowed|what happens if.*(miss|absent|late)|(can|what if) I.*(miss|skip).*class|(number|amount) of.*(absences|misses)|(consequences|penalty).*for.*(missing|absence)|(will|does).*(missing|absence).*(affect|drop).*grade|show up.*required/i.test(lowerQuestion)) {
        return "More than three unexcused absences will lower your final grade. Excused absences require documentation for illness, family emergencies, religious reasons, jury duty, or university activities. You have three free absences for circumstances like car trouble, minor illness, work conflicts, etc.";
    }
    
    // MATERIALS
    if (/(do|have to|need to|must|should|are we).*(buy|purchase|get|bring|need).*(textbook|book|materials|readings)|(is|are).*textbook.*(required|needed)|(what|which).*books.*(need|required)|(how much|cost).*textbook|(where|how).*get.*textbook|(do we|can I).*use.*(ebook|pdf)|(required|course).*materials/i.test(lowerQuestion)) {
        return "Required texts: 1) Lunsford's 'Let's Talk with Readings' (2nd ed.), 2) Ball and Loewe's 'Bad Ideas About Writing' (free eBook available on Canvas), and 3) A composition notebook for handwritten journal entries. Additional readings are posted on Canvas.";
    }
    
    // ASSIGNMENTS
    if (/(rhetorical|response).*journal|journal.*entries/i.test(lowerQuestion)) {
        return "The Rhetorical Response Journal consists of ten low-stakes, handwritten entries designed to develop critical reading and writing skills. These are graded on engagement and completion (20% of total grade) rather than correctness, focusing on your thinking process.";
    }
    
    if (/position paper|vision.*university|750.*1000|first paper/i.test(lowerQuestion)) {
        return "The Position Paper is a 750-1000 word essay where you articulate and defend your vision of the university. It's worth 20% of your grade and involves drafting in stages with version history enabled. You can revise and resubmit it after final grades are posted with a 300-word revision statement.";
    }
    
    if (/conference presentation|presentation|lecture.*topic/i.test(lowerQuestion)) {
        return "The Conference Presentation is a 5-7 minute lecture based on your research topic, using at least one visual aid. You'll also write a brief reflection analyzing your experience. It's worth 10% of your grade.";
    }
    
    if (/conference paper|final paper|research paper|1500.*word|capstone/i.test(lowerQuestion)) {
        return "The Conference Paper is your 1500-word capstone project (25% of grade) that develops your presentation into a polished academic paper with a complex thesis. It must follow MLA style and show sophisticated engagement with scholarly conversation.";
    }
    
    if (/quizzes|quiz/i.test(lowerQuestion)) {
        return "Weekly quizzes (10% of grade) encourage consistent engagement with course material. They're open-note (but not open-computer) and may be retaken to improve your score. Given at the beginning of class using pen and paper.";
    }
    
    if (/participation|attendance|workshop|peer.*group/i.test(lowerQuestion)) {
        return "Participation and attendance account for 15% of your grade. This is a workshop-based course where you'll work in peer groups all semester. Your final grade is determined by averaging self-evaluation with peer evaluations.";
    }
    
    if (/how many.*assignments|workload|what.*due|papers.*write/i.test(lowerQuestion)) {
        return "You'll complete: 10 journal entries, 1 position paper (750-1000 words), weekly quizzes, 1 conference presentation, and 1 conference paper (1500 words). See the syllabus schedule for specific due dates.";
    }
    
    // GRADING
    if (/grading scale|how.*graded/i.test(lowerQuestion)) {
        return "Grading scale: A (90-100%), B (80-89%), C (70-79%), D (60-69%), F (Below 60%). Final grades are not rounded up.";
    }
    
    if (/grade breakdown|grading breakdown|how much is.*worth|what percent of my grade is.*|weight.*assignments|grade.*based.*on|how.*get.*a|how.*pass.*class|how.*pass/i.test(lowerQuestion)) {
        return "Grade composition: Rhetorical Response Journal (20%), Position Paper (20%), Quizzes (10%), Participation and Attendance (15%), Conference Presentation (10%), Conference Paper (25%).";
    }
    
    if (/extra credit|writing center|uwc/i.test(lowerQuestion)) {
        return "You can earn 5% extra credit on your Position Paper by visiting the University Writing Center. Take your graded essay there, then submit the visit summary with your revised essay and a 300-word revision statement. Limited to one visit for extra credit.";
    }
    
    // POLICIES
    if (/late work|submit.*late|turn in.*late|hand in.*late|late.*turn.*in|late.*submit|late.*hand.*in/i.test(lowerQuestion)) {
        return "Late work penalties: <1 hour (5%), 1 class day (10%), 2 class days (20%), >1 week (max 50%). One 48-hour 'Life Happens' extension available per semester (not for final conference paper). If having technical issues, email your work to show completion, then submit to Canvas.";
    }
    
    if (/plagiarism|can i use AI|AI|academic integrity|cheating|turnitin/i.test(lowerQuestion)) {
        return "Plagiarism, self-plagiarism, or unauthorized AI use results in a zero and possible course failure. Using GenAI tools to generate content is not allowed. All submissions are checked through Turnitin, and version history is required for non-handwritten assignments. Editing tools like Grammarly are allowed only for basic spellcheck, not generating content.";
    }
    
    if (/communication policy|email|contact|office hours|how.*reach.*professor/i.test(lowerQuestion)) {
        return "I respond to emails within 24 hours Monday-Friday (9-5). Weekend responses aren't guaranteed. Office hours: MW 10-11am in MHB510. Enable Canvas notifications for announcements. If you don't hear back within 24 hours on weekdays, please follow up!";
    }
    
    if (/(technology|computer).*policy|laptops|devices|phones|electronics in class/i.test(lowerQuestion)) {
        return "You may use laptops/electronic devices for taking notes and reading course materials. Please avoid non-course related browsing as it distracts you and others. Phones should be silenced. Disruptive behavior may result in being asked to leave, counting as an absence.";
    }
    
    if (/withdrawal policy|drop.*class|withdraw/i.test(lowerQuestion)) {
        return "Withdrawals during the final three weeks require a serious, compelling reason beyond your control. You must officially file withdrawal paperwork with Enrollment Services regardless of attendance, otherwise you'll receive a 'WU' (unauthorized withdrawal) grade.";
    }
    
    // RESOURCES
    if (/bmac|disability|accommodation|accessibility/i.test(lowerQuestion)) {
        return "Students with disabilities must register with the Bob Murphy Access Center (BMAC) each semester and provide faculty with verification of accommodations as early as possible. BMAC is in the Shakarian Student Success Center, Room 110. Phone: (562) 985-5401, Email: bmac@csulb.edu.";
    }
    
    if (/resources|support|help|tutoring|writing center|library/i.test(lowerQuestion)) {
        return "Campus resources include: Bob Murphy Access Center, Student Affairs, Health Services, Counseling, University Library, Writing Center (offers extra credit), Technology Help Desk, and open computer labs (Horn Center and Spidell Technology Center).";
    }
    
    if (/computer.*lab|printing|software|technical support/i.test(lowerQuestion)) {
        return "Open computer labs: Horn Center (lower campus) and Spidell Technology Center (Library). Printing: 10 cents/page using Beach ID card. Technical support: Technology Help Desk at (562) 985-4959, helpdesk@csulb.edu, or visit Horn Center/Library 5th Floor.";
    }
    
    // DEFAULT RESPONSE
    return "I'm not sure I understand. Try checking the syllabus, rephrasing your question, or asking your instructor during office hours (MW 10-11am in MHB510). You might ask about assignments, policies, grading, or resources.";
}
    
    // Toggle chatbot visibility and show initial greeting
    chatbotToggle.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
        
        // Only add greeting if this is the first open
        if (chatbotWidget.classList.contains('active') && chatbotMessages.children.length === 0) {
            addMessage(
                "Hark, scholars! The ENGL 380 syllabus lies open before thee. Ask of grading, attendance, or the ordinances of the course, and I shall make all plain.",
                false,
                true
            );
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotWidget.classList.remove('active');
    });
    
    // Send message on button click or Enter key
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}
