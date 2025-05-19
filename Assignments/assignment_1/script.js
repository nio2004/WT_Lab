$(document).ready(function() {
    // Initialize the database
    initializeDatabase();
    
    // Load projects when tab is shown
    $('#course-tab').on('shown.bs.tab', function() {
        loadProjects('course');
    });
    
    $('#edi-tab').on('shown.bs.tab', function() {
        loadProjects('edi');
    });
    
    // Handle project form submission
    $('#projectForm').on('submit', function(e) {
        e.preventDefault();
        saveProject();
    });
});

// Initialize local storage database if it doesn't exist
function initializeDatabase() {
    if (!localStorage.getItem('projects')) {
        // Sample projects data
        const sampleProjects = [
            {
                id: 1,
                title: "Smart Campus Navigation System",
                description: "A web and mobile application that helps students navigate around VIT campus efficiently.",
                team: "John Doe, Jane Smith",
                category: "course",
                relevance: "Improves student experience by reducing time spent finding classes and facilities."
            },
            {
                id: 2,
                title: "IoT-based Smart Classroom",
                description: "An automated system to control lights, AC, and projectors based on class schedules.",
                team: "Alex Johnson, Lisa Parker",
                category: "edi",
                relevance: "Reduces energy consumption and improves classroom efficiency."
            },
            {
                id: 3,
                title: "Student Mental Health Platform",
                description: "A platform for students to access mental health resources and connect with counselors.",
                team: "Rajiv Kumar, Priya Sharma",
                category: "course",
                relevance: "Addresses growing mental health concerns among college students."
            }
        ];
        
        localStorage.setItem('projects', JSON.stringify(sampleProjects));
        localStorage.setItem('nextId', '4');
    }
}

// Load projects based on category
function loadProjects(category) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const filteredProjects = projects.filter(project => project.category === category);
    
    const container = category === 'course' ? $('#courseProjectsList') : $('#ediProjectsList');
    container.empty();
    
    if (filteredProjects.length === 0) {
        container.html('<div class="col-12"><p class="text-center">No projects found. Add some projects to see them here.</p></div>');
        return;
    }
    
    filteredProjects.forEach(project => {
        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card project-card">
                    <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-sm btn-primary view-details" data-id="${project.id}">View Details</button>
                    </div>
                </div>
            </div>
        `;
        
        container.append(card);
    });
    
    // Add event listeners to view-details buttons
    $('.view-details').on('click', function() {
        const projectId = $(this).data('id');
        showProjectDetails(projectId);
    });
}

// Save new project
function saveProject() {
    const title = $('#projectTitle').val();
    const description = $('#projectDescription').val();
    const team = $('#projectTeam').val();
    const category = $('#projectCategory').val();
    const relevance = $('#projectRelevance').val();
    
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    let nextId = parseInt(localStorage.getItem('nextId') || '1');
    
    const newProject = {
        id: nextId,
        title,
        description,
        team,
        category,
        relevance
    };
    
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('nextId', (nextId + 1).toString());
    
    // Clear form
    $('#projectForm')[0].reset();
    
    // Show success alert
    alert('Project saved successfully!');
    
    // Switch to the appropriate tab
    if (category === 'course') {
        $('#course-tab').tab('show');
    } else {
        $('#edi-tab').tab('show');
    }
}

// Show project details in modal
function showProjectDetails(projectId) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        $('#modalTitle').text(project.title);
        
        let modalContent = `
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Team Members:</strong> ${project.team || 'Not specified'}</p>
            <p><strong>Category:</strong> ${project.category === 'course' ? 'Course Project' : 'EDI Project'}</p>
            <p><strong>Relevance:</strong> ${project.relevance || 'Not specified'}</p>
        `;
        
        $('#modalBody').html(modalContent);
        
        // Show the modal
        const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
        projectModal.show();
    }
}