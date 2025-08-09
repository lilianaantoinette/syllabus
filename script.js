// Enhanced Custom Cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Cursor hover effects
const interactiveElements = document.querySelectorAll(
    'a, button, .resource-item, .card, .quick-nav a, .nav-links a, li'
);

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-active');
        el.style.transform = 'translateY(-2px)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-active');
        el.style.transform = 'translateY(0)';
    });
});

// Scroll effects
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.syllabus-nav');
    if (window.scrollY > 50) {
        nav.classList.add('syllabus-nav-scrolled');
    } else {
        nav.classList.remove('syllabus-nav-scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    });
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

// Chatbot functionality
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
    
    // Create three dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dotContainer.appendChild(dot);
    }
    
    typingDiv.appendChild(dotContainer);
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
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
    const typingSpeed = 10 + Math.random() * 15; // Faster typing speed (10-25ms)
    
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
    chatbotMessages.appendChild(messageDiv);
    
    if (isQuestion) {
        // For questions, show immediately
        messageText.textContent = text;
    } else if (isInitialGreeting) {
        // For initial greeting, show immediately without typing
        messageText.textContent = text;
    } else {
        // For normal responses, show typing indicator first
        const typingIndicator = createTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator(typingIndicator);
            typeMessage(text, messageText);
        }, 500 + Math.random() * 500); // Short delay before typing starts
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

// Chatbot response logic
function getChatbotResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Course description responses
    if (lowerQuestion.includes('description') || lowerQuestion.includes('about') || lowerQuestion.includes('what is')) {
        return "ENGL 1 is an introductory course in rhetoric emphasizing clear writing and research papers. ENGL 28 focuses on intensive college writing skills to prepare students for composition and reading.";
    }
    
    // Grading responses
    if (lowerQuestion.includes('grading') || lowerQuestion.includes('grade') || lowerQuestion.includes('percent')) {
        if (lowerQuestion.includes('scale')) {
            return "The grading scale is: A (90-100%), B (80-89%), C (70-79%), D (60-69%), F (below 60%). Grades are rounded to the nearest whole number at semester's end.";
        }
        if (lowerQuestion.includes('breakdown') || lowerQuestion.includes('distribution')) {
            return "Grading breakdown: Participation (30%) includes annotations, discussions, attendance. Essays (60%) include identity essay, analytical argument, research paper. See the syllabus for detailed percentages.";
        }
        if (lowerQuestion.includes('essay') || lowerQuestion.includes('paper')) {
            return "Essays make up 60% of your grade: Identity Essay (15%), Analytical Argument (18%), Research Proposal (6%), and Research Paper (21%). Each includes prewriting, draft, and peer review components.";
        }
        return "Grades are based on participation (30%) and essays (60%). The remaining 10% comes from midterm and final assessments. See the 'Evaluation Methods' section for details.";
    }
    
    // Attendance responses
    if (lowerQuestion.includes('attendance') || lowerQuestion.includes('absent') || lowerQuestion.includes('miss class')) {
        return "Attendance policy: No penalty for first two absences. After three absences, you'll be dropped from the course. Three tardies or early departures equal one absence.";
    }
    
    // Late work responses
    if (lowerQuestion.includes('late') || lowerQuestion.includes('due date') || lowerQuestion.includes('deadline')) {
        return "Late work policy: Assignments due at 11:59PM on indicated dates. Work submitted >1 week late gets 10% deduction. Dropboxes won't open more than one week in advance.";
    }
    
    // Policies responses
    if (lowerQuestion.includes('policy') || lowerQuestion.includes('policies')) {
        if (lowerQuestion.includes('integrity') || lowerQuestion.includes('plagiarism')) {
            return "Academic integrity: Plagiarism results in an 'F' until corrected (accidental) or zero (deliberate). Our class respects all backgrounds - disrespectful behavior won't be tolerated.";
        }
        return "Key policies: Attendance (3 absences max), Late work (10% deduction after 1 week), Academic integrity (no plagiarism), Inclusivity (respect for all).";
    }
    
    // Structure responses
    if (lowerQuestion.includes('format') || lowerQuestion.includes('hybrid') || lowerQuestion.includes('meet')) {
        return "Course format: Hybrid - we meet once weekly in class, with remaining work online via Canvas (videos, readings, quizzes, discussions, and conferences).";
    }
    
    // Resources responses
    if (lowerQuestion.includes('resource') || lowerQuestion.includes('help') || lowerQuestion.includes('support')) {
        return "Resources include: Academic Support, Counseling, Career Services, Wellbeing, Health Services, Food Programs, Disability Services. See the 'Resources & Support' section for links.";
    }
    
    // Instructor responses
    if (lowerQuestion.includes('instructor') || lowerQuestion.includes('professor') || lowerQuestion.includes('teacher')) {
        return "The instructor is Firstname Lastname. Office hours are Tuesdays 10:30-12:30. Contact information should be available on your course syllabus or Canvas page.";
    }
    
    // Default response
    return "I'm not sure I understand. Try asking about: grading, attendance, course policies, or assignments. You can also check the relevant section of the syllabus for detailed information.";
}

// Toggle chatbot visibility and show initial greeting
chatbotToggle.addEventListener('click', () => {
    chatbotWidget.classList.toggle('active');
    
    // Only add greeting if this is the first open
    if (chatbotWidget.classList.contains('active') && chatbotMessages.children.length === 0) {
        addMessage(
            "Hello! I can answer questions about the ENGL 1+28 syllabus. Try asking about grading, attendance, or course policies.",
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
