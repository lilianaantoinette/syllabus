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
    if (/(how|can|what).*(request|get|ask for|apply for).*extension|need more time.*assignment|(extension|late).*policy|(can't|won't).*make.*deadline|(miss|late).*due date/i.test(lowerQuestion)) {
        return "To request an extension, you should email your instructor as soon as you know you won't be able to get the assignment in on time. In the subject line, write 'Extension Request.' If you're using your 'Life Happens' 48-hour extension, you don't need to include an explanation. If you've already used your 'Life Happens' extension or you need an extension for one of the assignments it doesn't cover, then you should explain your situation: how much extra time do you need and why?";
    }
    if (/(what('s| is)|explain|tell me about) an? extension|how.*extension.*work|what.*extension.*mean|(don't|do not) understand.*extension|define.*extension|how.*late.*work/i.test(lowerQuestion)) {
        return "An extension is when you get official permission to turn in an assignment after the original due date. Here's what you should know:<br><br>" +
               "• You need to request your extension within 24 hours of the original deadline<br>" +
               "• Explain briefly why you need more time<br>" +
               "• Specify how much time you're requesting<br>" +
               "• Extensions aren't automatic - approval depends on your situation<br>" +
               "It's best to ask early if you see trouble coming! It's better to request an extension than just turn work in late.";
    }

    // COURSE BASICS
    if (/what('s| is).*(class|course|freshman comp|engl\s?[128]|writing class)|(can you|could you).*(tell me|explain).*(about|this).*class|what.*we.*do.*in.*class|describe.*(course|class)|overview.*of.*class|what.*cover.*in.*this.*class|what.*learn.*in.*(this|the).*class|what's.*the.*point.*of.*this.*class|why.*take.*this.*class/i.test(lowerQuestion)) {
        return "In this class, you'll sharpen your academic reading and writing skills and discover how language shapes how we understand and connect with the world around us. This hybrid course invites you to bring your own voice, experiences, and ideas to the table. Becoming a confident communicator starts with believing that what you have to say matters.";
    }
    if (/(what|what's|what will|how).*(learn|gain|get from|take away from).*(class|course)|(skills|outcomes|abilities).*(from|in).*class|why.*take.*this.*class|what's.*the.*point.*of.*this.*class|how.*this.*class.*help.*me|what.*teach.*in.*this.*class|what.*get.*out.*of.*class|how.*improve.*(writing|reading).*in.*this.*class/i.test(lowerQuestion)) {
        return "In this class, you'll learn how to read critically, write clearly, and think deeply. You'll practice crafting strong thesis-driven essays, analyzing complex texts, and conducting meaningful research. You'll develop your unique voice as a writer and gain tools to express your ideas with confidence, clarity, and purpose.";
    }
    if (/what.*hybrid/i.test(lowerQuestion)) {
        return "A hybrid class is a course that combines in-person classes with online learning.";
    }
    if (/(what('s| is)|define|explain|describe|tell me about).*(hybrid|mixed mode|blended).*(class|course)|how.*hybrid.*work|what.*mean.*hybrid|(hybrid|blended).*(mean|work)|(online|in-person).*and.*(in-person|online).*class|(both|combination).*(online|in-person)|(part|half).*(online|in-person)/i.test(lowerQuestion)) {
        return "This class moves much faster than high school English. You'll write longer papers (up to 8 pages), do real research with academic sources, and cite everything correctly. The readings are more challenging, and you're expected to analyze instead of just summarize. You'll spend 6-9 hours weekly outside class.";
    }
    if (/(how much|how many).*(reading|writing|pages|work)|(what|how).*(workload|time commitment|weekly work)|(how many|how much).*hours.*per week|(reading|writing).*requirements|(how|what).*much.*homework|(how|what).*many.*assignments|(what|how).*long.*papers|(how|what).*often.*write|(how|what).*many.*essays/i.test(lowerQuestion)) {
        return "You'll write three major papers and an in-class midterm essay exam. Each week, you can expect to spend ** hours outside of class reading and writing.";
    }
    if (/(what's|what is|tell me about).*(hardest|most difficult|biggest challenge|toughest part|most challenging)|(struggle|difficult|challenge|hard time).*in.*class|which.*part.*hardest|what.*should.*prepare.*for|what.*most.*students.*struggle|where.*people.*have.*trouble|what.*need.*most.*help|what.*biggest.*hurdle|what.*give.*most.*trouble/i.test(lowerQuestion)) {
        return "Most students struggle with the research paper - not the writing itself, but managing the timeline. Start early! The students who do well are the ones who come to office hours with drafts before the due date panic sets in.";
    }
    if (/(what|what kind|what types|tell me about|describe).*(assignments|work|papers|essays|projects|homework|workload)|(will|do) we (have|do).*(papers|essays|writing)|how many.*(papers|essays|assignments)|what.*writing.*required|what.*major.*projects|(assignments|work).*in.*class|course.*requirements|(what|how).*often.*write/i.test(lowerQuestion)) {
        return "We'll do: 1) A personal identity essay (4-5 pgs), 2) An analytical paper (5-6 pgs), 3) A research proposal (2-3 pgs), and 4) A big research paper (7-8 pgs). Plus weekly discussion posts, reading annotations, and peer reviews. No busywork - everything builds toward those major papers.";
    }
    if (/(where|what|which).*(classroom|room|meet|location|building|hss203|class|lecture).*(located|at|is)|how.*find.*(classroom|room|hss203)|where.*we.*meet|directions.*to.*class|location.*of.*(class|lecture)|(class|lecture).*address|(where|what).*is.*hss203/i.test(lowerQuestion)) {
        return "We meet in Room HSS203.";
    }
    
    // SCHEDULE & ATTENDANCE
    if (/(when|what time|where|what days).*(class|meet|lecture|session).*(schedule|time|location|room|hss203)|(class|lecture).*(schedule|time|meet|location)|(day|time).*of.*class|(hybrid|in-person).*schedule|when.*we.*meet|what.*are.*class.*hours|(where|when).*is.*(class|lecture)|how.*often.*we.*meet/i.test(lowerQuestion)) {
        return "Our class meets in person on Tuesdays from 11:15-1:35 in Room HSS203. This is a hybrid (part in-person and part online) class, so you'll also need to set aside 2.5 hours each week for online learning.";
    }
    if (/(attendance|absent|miss|late|tardy).*(policy|rule|requirement|grade|count|drop)|how many.*(absences|misses|lates).*allowed|what happens if.*(miss|absent|late)|(can|what if) I.*(miss|skip).*class|(number|amount) of.*(absences|misses)|(consequences|penalty).*for.*(missing|absence)|(will|does).*(missing|absence).*(affect|drop).*grade|show up.*required/i.test(lowerQuestion)) {
        return "You can miss two classes before your attendance grade starts to drop. If you miss a third class, you may be dropped from the course. Three tardies (more than ten minutes late) is equal to one absence. If you're more than thirty minutes late, you'll be marked absent.";
    }
    if (/(major|important|big|key).*(due dates|deadlines|assignments|papers|projects)|when.*(due|submit).*(essays|papers|assignments)|(what|which).*assignments.*due|(mark|write down).*dates|(upcoming|future).*deadlines|(assignment|paper).*schedule|(what|when).*are.*(midterm|final)|(research|analytical|identity).*due date|(course|class).*timeline|(what|when).*big.*projects/i.test(lowerQuestion)) {
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
    if (/(do|have to|need to|must|should|are we).*(buy|purchase|get|bring|need).*(textbook|book|materials|readings)|(is|are).*textbook.*(required|needed)|(what|which).*books.*(need|required)|(how much|cost).*textbook|(free|OER|open educational).*resources|(where|how).*get.*textbook|(do we|can I).*use.*(ebook|pdf)|(required|course).*materials/i.test(lowerQuestion)) {
        return "You don't need to buy a textbook! All our readings are free Open Educational Resources available as PDFs on Canvas. Just bring your laptop/tablet or print them if you prefer paper.";
    }
    
    // TECHNOLOGY
    if (/(what if|what happens if|help|what do i do if).*(computer|tech|laptop|device|internet).*(crashes|breaks|fails|problems|issues|dies)|(lost|delete|corrupt).*(work|file|document|assignment)|(backup|save|recover).*(work|assignment|file)|tech.*emergency|(computer|tech).*(trouble|problem|issue)|(submit|turn in).*(late|after).*(tech|computer)|(power|internet).*outage/i.test(lowerQuestion)) {
        return "Save constantly and use Google Docs as backup! If tech issues happen, email me immediately with details.";
    }

    if (/group chat|discord|class chat/i.test(lowerQuestion)) {
        return "There's no official class group chat, but you're welcome to organize a Discord server or study groups. Just remember: anything you submit must be your own work, even if you discussed it with classmates first.";
    }
    
    // OFFICE HOURS
    if (/(what('s| are)|explain|describe|tell me about|when are|how do).*(office hours|professor('s)? availability|meet with professor|ask questions outside class|get help outside class)|(can I|how to).*(meet|talk to|see).*(professor|instructor)|(where|when).*to.*get.*help|(extra|additional).*help.*times|(one-on-one|individual).*meetings/i.test(lowerQuestion)) {
        return "Office hours are dedicated times outside of class when professors are available to meet with students to discuss course material, ask questions, and get feedback on assignments.";
    }
    if (/(when|what time|what days|how often|how long|where).*(office hours|professor('s)? availability|meet with professor)|(can I|how to).*(meet|talk to|see).*(professor|instructor).*(outside class)|(schedule|set up|make).*appointment|(available|free).*to talk|(extra|additional).*help.*times|(one-on-one|individual).*meetings|(virtual|in-person).*office hours/i.test(lowerQuestion)) {
        return "Office hours take place online on Thursdays from 9:00 AM to 11:15 AM. If you need to meet in person or cannot make it during regular office hours, please send your professor an email to set up an appointment.";
    }
    if (/how.*(contact|reach|email|talk to|message|get in touch with).*(professor|teacher|instructor)|(professor|teacher|instructor).*(contact info|email|how to reach)|where.*office hours|when.*office hours|best way.*ask.*question/i.test(lowerQuestion)) {
        return "The best way to reach your professor is by email: desimone_liliana@smc.edu. For detailed questions, visit during office hours.";
    }

    // ASSIGNMENTS
    if (/how many.*essays|writing assignments/i.test(lowerQuestion)) {
        return "You'll write four major essays this semester: an Identity Essay, an Analytical Argument, a Midterm Essay, and a final Research Paper.";
    }
    if (/research paper|final paper|final research essay|final essay|last essay\research essay/i.test(lowerQuestion)) {
        return "The research paper is a significant 7-8 page project where you'll investigate a topic of your choice (within course themes) using academic sources. We'll break the process into manageable steps throughout the semester.";
    }
    if (/final|final exam/i.test(lowerQuestion)) {
        return "The final exam will be a comprehensive assessment of your writing skills. We'll go over specific details closer to the exam date.";
    }
    if (/midterm/i.test(lowerQuestion)) {
        return "We will have an in-class midterm exam. It will take place between December 16-December 23. We'll go over details in class as the exam approaches.";
    }
    if (/how many.*essays|number of papers|total writing assignments/i.test(lowerQuestion)) {
        return "You'll write four major essays this semester: an Identity Essay, an Analytical Argument, a Midterm Essay, and a final Research Paper.";
    }
    if (/how long.*essays|length.*papers|page requirements/i.test(lowerQuestion)) {
        return "The Identity Essay runs 4-5 pages, the Analytical Argument is 5-6 pages, the Midterm Essay is 2-3 pages, and the Research Paper is 7-8 pages. You'll write the midterm in class by hand, but all other essays should be double-spaced with standard MLA formatting.";
    }
    if (/types of essays|kinds of papers|what.*write.*(argumentative|narrative)/i.test(lowerQuestion)) {
        return "You'll write several types of essays: a personal narrative (Identity Essay), analytical arguments, and a research paper. Each type helps develop different writing skills you'll need in college and beyond.";
    }
    if (/research paper|final paper|big paper/i.test(lowerQuestion)) {
        return "Yes, there's a significant 7-8 page research paper due in Week 14. It's worth 21% of your grade and requires using academic sources with proper MLA citations. We'll break the process into manageable steps throughout the semester.";
    }
    if (/choose.*topics|pick.*own|select.*subjects/i.test(lowerQuestion)) {
        return "You'll have some flexibility with topics, especially for the research paper. The first two essays have guided prompts, while the research paper allows you to choose a topic within our course themes, subject to my approval. I'm happy to help brainstorm ideas during office hours.";
    }
    if (/submit.*essays|turn in.*papers|how.*upload/i.test(lowerQuestion)) {
        return "All essays must be submitted as PDFs through Canvas by 11:59pm on their due dates. Please name your files like this: LastName_AssignmentTitle.pdf. Email submissions won't be accepted, so make sure you're comfortable with Canvas uploads.";
    }
    if (/revise.*essays|rewrite.*grade|improve.*score/i.test(lowerQuestion)) {
        return "You can revise any of the first three essays within one week of receiving feedback. The maximum grade improvement is one letter grade. Just upload your revised version to Canvas with 'REVISED' in the filename. The research paper can't be revised after submission.";
    }
    if (/peer review|group editing|workshop.*papers/i.test(lowerQuestion)) {
        return "Yes, we'll do structured peer review sessions for each major essay. You'll exchange drafts with classmates, provide written feedback using guided worksheets, and use those comments to improve your own paper.";
    }

    // GRADING
    if (/grading scale|how.*graded/i.test(lowerQuestion)) {
        return "Grading scale:\nA: 90-100%\nB: 80-89%\nC: 70-79%\nD: 60-69%\nF: Below 60%\nRounded to nearest whole % at semester end";
    }
    if (/round.*|rounded.*/i.test(lowerQuestion)) {
        return "At the end of the semester, your grade will be rounded to the nearest whole percent. For example, if you have an 89.5, this will be rounded to a 90%. If you have an 89.4, it will not be rounded up to an A.";
    }
    if (/grade breakdown|grading breakdown|how much is.*worth|what percent of my grade is.*|weight.*assignments|grade.*based.*on|how.*get.*a|how.*pass.*class|how.*pass/i.test(lowerQuestion)) {
        return "Grade composition:\n- Participation (30%)\n  - Annotations (7.5%)\n  - Discussions (7.5%)\n  - Attendance (7.5%)\n  - In-class writing (7.5%)\n- Essays (60%)\n- Exams (10%)";
    }
    if (/fail.*assignment|0 on.*assignment|fail.*quiz|failed.*essay|failed.*quiz|failed.*assignment/i.test(lowerQuestion)) {
        return "If you're not happy with the grade you earned on an essay or assignment, visit office hours or speak with your professor.";
    }
    
    // POLICIES
    if (/late work|submit.*late|turn in.*late|hand in.*late|late.*turn.*in|late.*submit|late.*hand.*in/i.test(lowerQuestion)) {
        return "If you turn it in less than one week late, you'll lose 10%. If it's more than a week late, you'll lose 10% each week. I don't accept work that is more than 2 weeks late. If you know you'll need more time on an assignment, reach out early for an extension.";
    }
    if (/plagiarism|can i use AI|AI|academic integrity/i.test(lowerQuestion)) {
        return "Work that you submit is assumed to be original. Using the ideas or words of another person (or program) as if it were your own is plagiarism. Plagiarism or cheating, including the uncited use of AI, will result in a failing grade on the assignment.";
    }

    // RESOURCES
    if (/tutoring|help with writing|help.*writing|help.*assignment|help.*essay|help.*research/i.test(lowerQuestion)) {
        return "Writing support available in the writing center. See the 'Resources' section of the syllabus for locations/hours";
    }
    if (/where.*writing center|where.*tutoring/i.test(lowerQuestion)) {
        return "Visit the writing center here: https://www.smc.edu/student-support/academic-support/tutoring-centers/writing-humanities/";
    }
    if (/overwhelmed|falling behind|can't cope/i.test(lowerQuestion)) {
        return "If you're struggling to keep up, send me an email or come see me during office hours. I'll help you make a game plan and get you connected with resources. If you need immediate mental or emotional health support, call 800-691-6003. If it's an emergency, call SMC dispatch at 310-434-4300 or (if you're off campus) call 911";
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
