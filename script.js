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
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dotContainer.appendChild(dot);
    }
    
    typingDiv.appendChild(dotContainer);
    return typingDiv; // Return the element but don't append it yet
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
    // For "How do I request an extension?"   
    if (/(how|can|what).*(request|get|ask for|apply for).*extension|need more time.*assignment|(extension|late).*policy|(can't|won't).*make.*deadline|(miss|late).*due date/i.test(lowerQuestion)) {
        return "To request an extension:\n1. Email instructor 24+ hours before deadline\n2. Explain your situation\n3. Specify needed time\n4. Use subject: 'Extension Request'\n\nLimit: 2 extensions per semester (not for finals)";
    }
    // For "What's an extension?"
     if (/what is an extension|what's an extension|what.*extension.*mean|what.*mean.*extension|what.*extension/i.test(lowerQuestion)) {
        return "An extension is extra time your professor gives you to finish an assignment after the original deadline. You should ask for an extension as soon as you know you won't be able to turn an assignment in on time.";
    }

    // COURSE BASICS
    // For "What is this class about?"
    if (/what.*freshman composition|what.*this course|what.*this class/i.test(lowerQuestion)) {
        return "This class, ENGL 1+28 develops college-level writing through:\n- Analytical essays\n- Research papers\n- Critical reading\n- Revision practice\nPrepares you for academic writing across disciplines.";
    }
    // For "What will I learn in this class?"
    if (/goals.*course|what.*learn.*class/i.test(lowerQuestion)) {
        return "You'll learn to:\n- Write thesis-driven essays\n- Conduct academic research\n- Analyze texts critically\n- Use MLA formatting\n- Revise effectively\n- Participate in scholarly discussions";
    }
    // For "What is a hybrid class?"
       if (/what.*hybrid/i.test(lowerQuestion)) {
        return "A hybrid class is a course that combines in-person classes with online learning.";
    }
    // For "Comparisons to high school"
    if (/how.*different.*high school|compare.*high school|not like high school|vs.*high school/i.test(lowerQuestion)) {
    return "This class moves way faster than high school English. You'll write longer papers (up to 8 pages), do real research with academic sources, and need to cite everything properly in MLA format. The readings are more challenging, and you're expected to analyze instead of just summarize. You'll spend 6-9 hours weekly outside class. It's a big step up, but office hours help.";
    }
    // For "How much reading and writing should I expect?"
    if (/how much.*reading|how much.*writing|workload|time commitment/i.test(lowerQuestion)) {
    return "You'll have about 50-100 pages of reading most weeks - mostly academic articles and essays. Writing-wise, expect 4 major papers (15-25 pages total) plus weekly discussion posts. Plan for 6-9 hours of work outside class each week. It's a grind, but office hours help!";
    }
    // What's the hardest part of the class?
    if (/hardest part|most difficult|biggest challenge/i.test(lowerQuestion)) {
    return "Most students struggle with the research paper - not the writing itself, but managing the timeline. Start early! The students who do well are the ones who come to office hours with drafts before the due date panic sets in.";
    }
    // For "What kind of assignments will we do?"
    if (/what kind.*assignments|types.*work|what.*papers|what.*essays/i.test(lowerQuestion)) {
    return "We'll do: 1) A personal identity essay (4-5 pgs), 2) An analytical paper (5-6 pgs), 3) A research proposal (2-3 pgs), and 4) A big research paper (7-8 pgs). Plus weekly discussion posts, reading annotations, and peer reviews. No busywork - everything builds toward those major papers.";
    }
    // Where exactly is our classroom?
    if (/where.*classroom|location.*class|find.*room/i.test(lowerQuestion)) {
    return "We meet in Room 11. It's on the first floor of the Liberal Arts building - look for the hallway past the main staircase. First week there'll be signs to help you find it!";
    }
    
    // SCHEDULE & ATTENDANCE
    // For "Where and when does this class meet?"
    if (/when.*class meet|what time.*class|class schedule|where.*class.*meet|where.*class/i.test(lowerQuestion)) {
        return "Class meets:\n- Tuesdays 1:11 PM in Room 11\n- Weekly Canvas modules\n- Discussions due Thursdays\n- Assignments due Sundays 11:59 PM";
    }
    // For "What is the attendance policy?"
    if (/attendance.*policy|how.*many.*absences|what.*if.*miss.*class|miss.*class|absent|can't*to.*class|miss.*a.*class/i.test(lowerQuestion)) {
        return "Attendance rules:\n- 2 absences allowed\n- 3rd = dropped from course\n- 3 tardies = 1 absence\n- No excused/unexcused distinction";
    }
    // For "Important due dates"
    if (/major due dates|important deadlines|write down now|big assignments due|when.*papers due/i.test(lowerQuestion)) {
    return "Mark these in your calendar now:\n" +
           "• Identity Essay - Week 3\n" +
           "• Analytical Paper - Week 6\n" +
           "• Midterm - Week 8\n" +
           "• Research Proposal - Week 10\n" +
           "• Research Paper - Week 14\n" +
           "• Final Portfolio - Finals Week\n\n" +
           "All assignments due Sundays at 11:59pm except the midterm (in-class). Don't wait until the last minute - these come up fast!";
    }
    // MATERIALS
    // Do we need to buy a textbook?
    if (/buy a textbook|textbook required|purchase books|textbook/i.test(lowerQuestion)) {
    return "Nope, no textbook to buy! All our readings are free Open Educational Resources available as PDFs on Canvas. Just bring your laptop/tablet or print them if you prefer paper.";
    }

    // Are readings online or in print?
    if (/readings online|print or digital|hard copy readings/i.test(lowerQuestion)) {
    return "Everything's digital - you'll access all readings through Canvas. You can read on your device or print them out, but we'll mostly work with the digital versions in class. Just make sure you can reliably access PDFs.";
    }

    // Will we be reading literature or mostly essays?
    if (/reading literature|novels or essays|types of readings/i.test(lowerQuestion)) {
    return "We'll focus mainly on academic essays and articles - the kind you'll encounter in college classes. Some might be literary texts, but mostly we're analyzing arguments and research rather than full novels or stories.";
    }

    // How often will we be tested on readings?
    if (/tested on readings|reading quizzes|reading checks/i.test(lowerQuestion)) {
    return "There aren't any pop quizzes, but you'll show your reading through weekly annotations (7.5% of your grade) and discussion posts (another 7.5%). The essays and exams will also require you to deeply engage with the texts.";
    }

    // Are there any required novels or long texts?
    if (/required novels|long books|full texts/i.test(lowerQuestion)) {
    return "No massive novels to get through - we'll work with shorter, focused texts each week. The longest reading might be 20-30 pages, but most are in the 5-15 page range. Everything's broken into manageable chunks on Canvas.";
    }
    // TECHNOLOGY
    // What if my computer crashes?
    if (/computer crashes|tech problems|lost work/i.test(lowerQuestion)) {
    return "Save constantly and use Google Docs as backup! If tech issues happen, email me immediately with details. We have computer labs on campus if your device fails - just don't wait until the last minute.";
    }

    // Is there a class group chat?
    if (/group chat|discord|class chat/i.test(lowerQuestion)) {
    return "I don't run official chats, but you're welcome to organize study groups. Just remember: anything you submit must be your own work, even if you discussed it with classmates first.";
    }
    
    // OFFICE HOURS
    // What are office hours?
    if (/what.*office hours|explain.*office hours/i.test(lowerQuestion)) {
        return "Office hours are dedicated times outside of class when professors are available to meet with students to discuss course material, ask questions, and get feedback on assignments.";
    }
    // When are office hours?
    if (/when.*office hours|how.*meet.*professor/i.test(lowerQuestion)) {
        return "Instructor availability:\n- Tuesdays 10:30 AM-12:30 PM (Room 11)\n- By appointment (email to schedule)\n- Virtual meetings available\n- Email: email@college.edu";
    }
    // How do I reach the professor?
    if (/how.*(contact|reach|email|talk to|message|get in touch with).*(professor|teacher|instructor)|(professor|teacher|instructor).*(contact info|email|how to reach)|where.*office hours|when.*office hours|best way.*ask.*question/i.test(lowerQuestion)) {
    return "The best way to reach your professor is by email: desimone_liliana@smc.edu.\n" +
           "For detailed questions, visit during office hours:\n" +
           "- Tuesdays 10:30 AM - 12:30 PM\n" +
           "- Room 11\n" +
           "- Virtual appointments available by request";
    }

    // ASSIGNMENTS
    // What are the major assignments?
    if (/how many.*essays|writing assignments/i.test(lowerQuestion)) {
        return "4 major essays:\n1. Identity (4-5 pages, 15%)\n2. Analytical (5-6 pages, 18%)\n3. Proposal (2-3 pages, 6%)\n4. Research (7-8 pages, 21%)";
    }
    // What is the final research essay?
    if (/research paper|final paper|final research essay|final essay|last essay\research essay/i.test(lowerQuestion)) {
        return "Research paper requirements:\n- 7-8 pages (21% of grade)\n- MLA format\n- Minimum 5 academic sources\n- Draft → Peer review → Revision\nDue Week 14";
    }
    // What is the final exam
    if (/final|final exam/i.test(lowerQuestion)) {
        return "Your research essay will be turned in during finals week. There will be no final exam.";
    }
    // What is the midterm exam
    if (/midterm/i.test(lowerQuestion)) {
        return "We will have an in-class midterm exam. It will take place between December 16-December 23. We'll go over details in class as the exam approaches.";
    }
    // How many essays will we write?
    if (/how many.*essays|number of papers|total writing assignments/i.test(lowerQuestion)) {
    return "You'll write four major essays this semester: an Identity Essay, an Analytical Argument, a Research Proposal, and a final Research Paper. Each one builds on the last, with drafts and revisions along the way.";
    }

    // How long do the essays have to be?
    if (/how long.*essays|length.*papers|page requirements/i.test(lowerQuestion)) {
    return "The Identity Essay runs 4-5 pages, the Analytical Argument is 5-6 pages, the Research Proposal is 2-3 pages, and the Research Paper is 7-8 pages. All essays should be double-spaced with standard MLA formatting.";
    }

    // What types of essays will we write?
    if (/types of essays|kinds of papers|what.*write.*(argumentative|narrative)/i.test(lowerQuestion)) {
    return "You'll write different types including personal reflection for the Identity Essay, critical analysis for the Analytical Argument, and formal research writing for the final paper. The focus is on developing strong thesis-driven arguments rather than creative narratives.";
    }

    // Will we have to write a research paper?
    if (/research paper|final paper|big paper/i.test(lowerQuestion)) {
    return "Yes, there's a significant 7-8 page research paper due in Week 14. It's worth 21% of your grade and requires using academic sources with proper MLA citations. We'll break the process into manageable steps throughout the semester.";
    }

    // Can we choose our own topics?
    if (/choose.*topics|pick.*own|select.*subjects/i.test(lowerQuestion)) {
    return "You'll have some flexibility with topics, especially for the research paper. The first two essays have guided prompts, while the research paper allows you to choose a topic within our course themes, subject to my approval. I'm happy to help brainstorm ideas during office hours.";
    }

    // How do we submit our essays?
    if (/submit.*essays|turn in.*papers|how.*upload/i.test(lowerQuestion)) {
    return "All essays must be submitted as PDFs through Canvas by 11:59pm on their due dates. Please name your files like this: LastName_AssignmentTitle.pdf. Email submissions won't be accepted, so make sure you're comfortable with Canvas uploads.";
    }

    // Can I revise my essays for a better grade?
    if (/revise.*essays|rewrite.*grade|improve.*score/i.test(lowerQuestion)) {
    return "You can revise any of the first three essays within one week of receiving feedback. The maximum grade improvement is one letter grade. Just upload your revised version to Canvas with 'REVISED' in the filename. The research paper can't be revised after submission.";
    }

    // Will there be peer review or group editing?
    if (/peer review|group editing|workshop.*papers/i.test(lowerQuestion)) {
    return "Yes, we'll do structured peer review sessions for each major essay. You'll exchange drafts with classmates, provide written feedback using guided worksheets, and use those comments to improve your own paper. This collaborative process counts toward your participation grade.";
    }

    // GRADING
    // What is the grading scale?
    if (/grading scale|how.*graded/i.test(lowerQuestion)) {
        return "Grading scale:\nA: 90-100%\nB: 80-89%\nC: 70-79%\nD: 60-69%\nF: Below 60%\nRounded to nearest whole % at semester end";
    }
    // Are grades rounded?
    if (/round.*|rounded.*/i.test(lowerQuestion)) {
        return "At the end of the semester, your grade will be rounded to the nearest whole percent. For example, if you have an 89.5, this will be rounded to a 90%. If you have an 89.4, it will not be rounded up to an A.";
    }
    // What is our grade made up of?
    if (/grade breakdown|grading breakdown|how much is.*worth|what percent of my grade is.*|weight.*assignments|grade.*based.*on|how.*get.*a|how.*pass.*class|how.*pass/i.test(lowerQuestion)) {
        return "Grade composition:\n- Participation (30%)\n  - Annotations (7.5%)\n  - Discussions (7.5%)\n  - Attendance (7.5%)\n  - In-class writing (7.5%)\n- Essays (60%)\n- Exams (10%)";
    }
    // What if I fail an assignment?
    if (/fail.*assignment|0 on.*assignment|fail.*quiz|failed.*essay|failed.*quiz|failed.*assignment/i.test(lowerQuestion)) {
        return "If you're not happy with the grade you earned on an essay or assignment, visit office hours or speak with your professor.";
    }
    // POLICIES
    // Late Work
    if (/late work|submit.*late|turn in.*late|hand in.*late|late.*turn.*in|late.*submit|late.*hand.*in/i.test(lowerQuestion)) {
        return "Late work rules:\n- ≤1 week late: 10% deduction\n- >1 week late: max 50% score\n- Nothing accepted >2 weeks late\nExtensions available (see extension policy)";
    }
    // Academic Honesty
    if (/plagiarism|can i use AI|AI|academic integrity/i.test(lowerQuestion)) {
        return "Academic honesty rules:\n- No AI-generated content\n- Proper citations required\n- 1st offense: F on assignment + tutorial\n- 2nd offense: Course failure\n- All cases reported to administration";
    }

    // RESOURCES
    // What kinds of writing help is available?
    if (/tutoring|help with writing|help.*writing|help.*assignment|help.*essay|help.*research/i.test(lowerQuestion)) {
        return "Writing support available:\n- Campus Writing Center\n- Online Writing Lab (OWL)\n- Peer review groups\n- Instructor feedback during office hours\nCheck syllabus 'Resources' section for locations/hours";
    }
    // Writing Center
    if (/where.*writing center|where.*tutoring/i.test(lowerQuestion)) {
        return "Visit the writing center here: https://www.smc.edu/student-support/academic-support/tutoring-centers/writing-humanities/";
    }
    // I'm overwhelmed - what should I do?
    if (/overwhelmed|falling behind|can't cope/i.test(lowerQuestion)) {
    return "First, breathe! Then come see me during office hours - we'll make a game plan. The counseling center also has great workshops on time management. Remember, everyone feels lost at first - asking for help is the smart move.";
    }

    // DEFAULT RESPONSE
    const commonQuestions = [
        "When are office hours?",
        "How do I request an extension?",
        "What's the research paper requirement?",
        "How many absences are allowed?",
        "What's the grading breakdown?"
    ];
    return `I'm not sure I understand. Try checking the syllabus, rephrasing your question, or asking a classmate.`;
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
