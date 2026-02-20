import { initTypewriter } from './utils.js';

export const injectPortfolioData = (data) => {
    document.getElementById('user-name').textContent = data.name.toUpperCase().replace(' ', '_');
    document.getElementById('user-title').textContent = data.title.toUpperCase().replace(' ', '_');

    const skillsContainer = document.getElementById('skills-container');
    data.skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'glass-card skill-card reveal-up';
        card.innerHTML = `
            <div class="skill-header">
                <span>${skill.name}</span>
                <span class="skill-percent">${skill.level}%</span>
            </div>
            <div class="skill-bar-outer">
                <div class="skill-bar-inner" style="width: ${skill.level}%"></div>
            </div>
            <div class="skill-category-tag">${skill.category}</div>
        `;
        skillsContainer.appendChild(card);
    });

    const expContainer = document.getElementById('experience-container');
    data.experience.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'timeline-item reveal-up';
        item.innerHTML = `
            <div class="mission-title">${exp.title}</div>
            <div class="mission-company">${exp.company} | ${exp.period}</div>
            <ul class="achievement-list">
                ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        `;
        expContainer.appendChild(item);
    });

    const projectsContainer = document.getElementById('projects-container');
    data.projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'glass-card project-card reveal-up';
        card.innerHTML = `
            <div class="card-header">
                <span class="file-name">${project.name.toUpperCase().replace(' ', '_')}.exe</span>
            </div>
            <div class="card-body">
                <p>${project.description}</p>
                <div class="tech-tags">
                    ${project.tech.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="cyber-link">SOURCE_CODE</a>
                    <a href="${project.demo}" target="_blank" class="cyber-link">EXECUTE_LIVE</a>
                </div>
            </div>
        `;
        projectsContainer.appendChild(card);
    });

    const eduContainer = document.getElementById('education-container');
    data.education.forEach(edu => {
        const card = document.createElement('div');
        card.className = 'glass-card edu-card reveal-up';
        card.innerHTML = `
            <div class="card-body">
                <h3 class="edu-degree">${edu.degree}</h3>
                <div class="edu-uni">${edu.university}</div>
                <div class="edu-year">${edu.year}</div>
            </div>
        `;
        eduContainer.appendChild(card);
    });

    const socialContainer = document.getElementById('social-container');
    Object.entries(data.social_links).forEach(([platform, url]) => {
        if (url !== '#') {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.className = 'social-btn';
            link.textContent = platform.toUpperCase();
            socialContainer.appendChild(link);
        }
    });

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'UPLOADING_INTEL...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = 'TRANSMISSION_SUCCESS! [ACK]';
            form.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 3000);
        }, 2000);
    });
};

export const initInteractions = () => {
};
