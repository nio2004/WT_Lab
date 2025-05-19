$(document).ready(function() {
  // Load consumers
  loadConsumers();
  
  // Handle consumer selection change
  $("#consumer").change(function() {
    const consumerId = $(this).val();
    if (consumerId) {
      loadBillHistory(consumerId);
    } else {
      $("#billHistory").html('<p class="text-center text-muted">Select a consumer to view bill history</p>');
    }
  });
  
  // Handle bill calculation form submission
  $("#billCalculationForm").submit(function(e) {
    e.preventDefault();
    const consumerId = $("#consumer").val();
    const units = $("#units").val();
    
    if (!consumerId) {
      alert("Please select a consumer");
      return;
    }
    
    generateBill(consumerId, units);
  });
  
  // Handle consumer form submission
  $("#consumerForm").submit(function(e) {
    e.preventDefault();
    const name = $("#name").val();
    const address = $("#address").val();
    const phone = $("#phone").val();
    
    addConsumer(name, address, phone);
  });
});

// Load all consumers
function loadConsumers() {
  $.ajax({
    url: '/api/consumers',
    type: 'GET',
    success: function(data) {
      const select = $("#consumer");
      select.html('<option value="">Select consumer</option>');
      
      data.forEach(function(consumer) {
        select.append(`<option value="${consumer.id}">${consumer.name} - ${consumer.phone}</option>`);
      });
    },
    error: function(xhr) {
      console.error('Error loading consumers:', xhr);
      alert('Failed to load consumers. Please try again.');
    }
  });
}

// Add a new consumer
function addConsumer(name, address, phone) {
  $.ajax({
    url: '/api/consumers',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      name: name,
      address: address,
      phone: phone
    }),
    success: function(data) {
      alert('Consumer added successfully!');
      $("#name").val('');
      $("#address").val('');
      $("#phone").val('');
      
      // Reload consumers
      loadConsumers();
      
      // Switch to calculate tab
      $("#calculate-tab").tab('show');
    },
    error: function(xhr) {
      console.error('Error adding consumer:', xhr);
      alert('Failed to add consumer. Please try again.');
    }
  });
}

// Generate and save bill
function generateBill(consumerId, units) {
  $.ajax({
    url: '/api/billing',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      consumerId: consumerId,
      units: units
    }),
    success: function(data) {
      displayBillResult(data);
      loadBillHistory(consumerId);
    },
    error: function(xhr) {
      console.error('Error generating bill:', xhr);
      alert('Failed to generate bill. Please try again.');
    }
  });
}

// Display bill result
function displayBillResult(data) {
  const html = `
    <table class="table table-sm">
      <tr>
        <td><strong>Consumer Name:</strong></td>
        <td>${data.consumerName}</td>
      </tr>
      <tr>
        <td><strong>Units Consumed:</strong></td>
        <td>${data.unitsConsumed}</td>
      </tr>
      <tr>
        <td><strong>Bill Amount:</strong></td>
        <td>Rs. ${data.billAmount}</td>
      </tr>
      <tr>
        <td><strong>Bill Date:</strong></td>
        <td>${new Date(data.billingDate).toLocaleString()}</td>
      </tr>
    </table>
  `;
  
  $("#billDetails").html(html);
  $("#billResult").show();
}

// Load bill history for a consumer
function loadBillHistory(consumerId) {
  $.ajax({
    url: `/api/billing/history/${consumerId}`,
    type: 'GET',
    success: function(data) {
      if (data.length === 0) {
        $("#billHistory").html('<p class="text-center text-muted">No billing history found</p>');
        return;
      }
      
      let html = `
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Units</th>
                <th>Amount (Rs.)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      data.forEach(function(bill) {
        html += `
          <tr>
            <td>${bill.billId}</td>
            <td>${bill.unitsConsumed}</td>
            <td>${bill.billAmount}</td>
            <td>${new Date(bill.billingDate).toLocaleString()}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
      
      $("#billHistory").html(html);
    },
    error: function(xhr) {
      console.error('Error loading bill history:', xhr);
      $("#billHistory").html('<p class="text-center text-danger">Error loading bill history</p>');
    }
  });
}