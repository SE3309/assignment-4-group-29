// Search Jobs
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData).toString();
    const res = await fetch(`/jobs?${params}`);
    const jobs = await res.json();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = jobs.map(job => `
        <p><strong>${job.title}</strong> - ${job.location} - $${job.salary}</p>
    `).join('');
});

// Apply for a Job
document.getElementById('applyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    const result = await response.json();
    alert(result.message);
});

// Post a Job
document.getElementById('postJobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/post-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    const result = await response.json();
    alert(result.message);
});

// Update Job Status
document.getElementById('updateJobStatusForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/update-job-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    const result = await response.json();
    alert(result.message);
});

// View Applications
document.getElementById('viewApplicationsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jobId = formData.get('job_id');
    const response = await fetch(`/view-applications/${jobId}`);
    const applications = await response.json();
    const applicationsDiv = document.getElementById('applicationResults');
    applicationsDiv.innerHTML = applications.map(app => `
        <p>${app.applicant_name} - ${app.resume_link}</p>
    `).join('');
});

// Generate Reports
document.getElementById('generateReportsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const employerId = formData.get('employer_id');
    const response = await fetch(`/generate-reports/${employerId}`);
    const report = await response.json();
    const reportDiv = document.getElementById('reportResults');
    reportDiv.innerHTML = report.map(r => `
        <p>${r.title}: ${r.applications_count} applications</p>
    `).join('');
});
