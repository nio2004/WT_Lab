$(document).ready(function() {
    // Initialize clubs in local storage if it doesn't exist
    if (!localStorage.getItem('vitClubs')) {
        // Sample data
        const sampleClubs = [
            {
                id: 1,
                name: "IEEE Student Branch",
                type: "technical",
                description: "A technical community dedicated to advancing technology for humanity.",
                relevance: "Provides students opportunities to engage in global technical discussions and develop technical skills through workshops and projects."
            },
            {
                id: 2,
                name: "Music Club",
                type: "cultural",
                description: "Platform for students to showcase their musical talents.",
                relevance: "Enhances cultural diversity on campus and helps students develop their artistic expression through performances and events."
            },
            {
                id: 3,
                name: "Cricket Club",
                type: "sports",
                description: "Promotes cricket at all levels in the university.",
                relevance: "Encourages physical fitness, teamwork, and sporting excellence among students."
            },
            {
                id: 4,
                name: "Coding Club",
                type: "technical",
                description: "Community of programmers focused on developing coding skills.",
                relevance: "Helps students improve problem-solving abilities and prepare for technical interviews and competitions."
            },
            {
                id: 5,
                name: "Dance Club",
                type: "cultural",
                description: "Platform for dance enthusiasts to learn and perform.",
                relevance: "Provides a creative outlet for students and represents VIT at cultural competitions."
            }
        ];
        
        localStorage.setItem('vitClubs', JSON.stringify(sampleClubs));
    }
    
    // Load clubs when page loads
    displayClubs();
    
    // Load clubs when tabs are clicked
    $('#all-tab').click(function() {
        displayClubs('all');
    });
    
    $('#technical-tab').click(function() {
        displayClubs('technical');
    });
    
    $('#cultural-tab').click(function() {
        displayClubs('cultural');
    });
    
    $('#sports-tab').click(function() {
        displayClubs('sports');
    });
    
    // Handle form submission
    $('#clubForm').submit(function(e) {
        e.preventDefault();
        
        // Get form values
        const name = $('#clubName').val();
        const type = $('#clubType').val();
        const description = $('#clubDescription').val();
        const relevance = $('#clubRelevance').val();
        
        // Get existing clubs
        let clubs = JSON.parse(localStorage.getItem('vitClubs')) || [];
        
        // Generate new ID (highest ID + 1)
        const maxId = Math.max(...clubs.map(club => club.id), 0);
        const newId = maxId + 1;
        
        // Create new club object
        const newClub = {
            id: newId,
            name: name,
            type: type,
            description: description,
            relevance: relevance
        };
        
        // Add to clubs array
        clubs.push(newClub);
        
        // Save to local storage
        localStorage.setItem('vitClubs', JSON.stringify(clubs));
        
        // Reset form
        $('#clubForm')[0].reset();
        
        // Show success message
        alert('Club added successfully!');
        
        // Switch to appropriate tab
        $(`#${type}-tab`).tab('show');
        
        // Refresh club display
        displayClubs(type);
    });
});

// Function to display clubs
function displayClubs(type = 'all') {
    // Get clubs from local storage
    const clubs = JSON.parse(localStorage.getItem('vitClubs')) || [];
    
    // Filter clubs by type if needed
    const filteredClubs = type === 'all' ? clubs : clubs.filter(club => club.type === type);
    
    // Clear containers
    $('#all-clubs-container').empty();
    $('#technical-clubs-container').empty();
    $('#cultural-clubs-container').empty();
    $('#sports-clubs-container').empty();
    
    // Get container to populate
    const container = type === 'all' ? $('#all-clubs-container') : 
                       type === 'technical' ? $('#technical-clubs-container') :
                       type === 'cultural' ? $('#cultural-clubs-container') :
                       $('#sports-clubs-container');
    
    // Show message if no clubs
    if (filteredClubs.length === 0) {
        container.html('<div class="col-12 text-center"><p>No clubs found in this category.</p></div>');
        return;
    }
    
    // Create card for each club
    filteredClubs.forEach(club => {
        const clubCard = `
            <div class="col-md-6 col-lg-4">
                <div class="card club-card">
                    <div class="card-header">
                        <h5 class="card-title">${club.name}</h5>
                        <span class="badge bg-${getBadgeColor(club.type)}">${capitalizeFirstLetter(club.type)}</span>
                    </div>
                    <div class="card-body">
                        <h6>Description:</h6>
                        <p>${club.description}</p>
                        <h6>Relevance:</h6>
                        <p>${club.relevance}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.append(clubCard);
        
        // Also add to all clubs container if we're not already on all clubs tab
        if (type !== 'all') {
            $('#all-clubs-container').append(clubCard);
        }
    });
}

// Helper function to get badge color based on club type
function getBadgeColor(type) {
    switch (type) {
        case 'technical':
            return 'primary';
        case 'cultural':
            return 'success';
        case 'sports':
            return 'danger';
        default:
            return 'secondary';
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}