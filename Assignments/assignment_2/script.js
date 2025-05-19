$(document).ready(function() {
    // Initialize projects in local storage if not exists
    if (!localStorage.getItem('vitProjects')) {
        // Sample data
        const sampleProjects = [
            {
                id: 1,
                title: "Web Development Framework",
                description: "A responsive framework for creating modern websites",
                relevance: "Helps students learn modern web technologies",
                type: "course"
            },
            {
                id: 2,
                title: "Smart Campus App",
                description: "Mobile application to navigate campus facilities",
                relevance: "Improves student experience at VIT",
                type: "dt"
            }
        ];
        localStorage.setItem('vitProjects', JSON.stringify(sampleProjects));
    }
    
    // Load projects when tabs are clicked
    loadProjects('course');
    
    $('#course-tab').click(function() {
        loadProjects('course');
    });
    
    $('#dt-tab').click(function() {
        loadProjects('dt');
    });
    
    // Handle form submission
    $('#project-form').submit(function(e) {
        e.preventDefault();
        
        // Get form values
        const title = $('#project-title').val();
        const description = $('#project-desc').val();
        const relevance = $('#project-relevance').val();
        const type = $('#project-type').val();
        
        // Get existing projects
        let projects = JSON.parse(localStorage.getItem('vitProjects')) || [];
        
        // Create new project
        const newProject = {
            id: Date.now(), // Using timestamp as unique ID
            title: title,
            description: description,
            relevance: relevance,
            type: type
        };
        
        // Add to projects array
        projects.push(newProject);
        
        // Save to local storage
        localStorage.setItem('vitProjects', JSON.stringify(projects));
        
        // Reset form
        $('#project-form')[0].reset();
        
        // Show appropriate tab
        if (type === 'course') {
            $('#course-tab').tab('show');
            loadProjects('course');
        } else {
            $('#dt-tab').tab('show');
            loadProjects('dt');
        }
        
        alert('Project added successfully!');
    });
});

// Function to load projects by type
function loadProjects(type) {
    // Get projects from local storage
    const projects = JSON.parse(localStorage.getItem('vitProjects')) || [];
    
    // Filter by type
    const filteredProjects = projects.filter(project => project.type === type);
    
    // Get container element
    const container = type === 'course' ? $('#course-project-list') : $('#dt-project-list');
    
    // Clear container
    container.empty();
    
    // Display message if no projects
    if (filteredProjects.length === 0) {
        container.html('<p class="text-center">No projects available</p>');
        return;
    }
    
    // Add projects to container
    filteredProjects.forEach(project => {
        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card project-card">
                    <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text">${project.description}</p>
                        <h6>Relevance:</h6>
                        <p class="card-text">${project.relevance}</p>
                    </div>
                </div>
            </div>
        `;
        container.append(card);
    });
}