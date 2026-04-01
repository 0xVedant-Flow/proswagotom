import { initTypewriter } from './utils.js';

export const injectPortfolioData = (data) => {
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = data.name.toUpperCase();
    
    const userTitleEl = document.getElementById('user-title');
    if (userTitleEl) userTitleEl.textContent = data.title.toUpperCase();

    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
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
    }

    const expContainer = document.getElementById('experience-container');
    if (expContainer) {
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
    }

    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
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
    }

    const eduContainer = document.getElementById('education-container');
    if (eduContainer) {
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
    }

    const socialContainer = document.getElementById('social-container');
    if (socialContainer) {
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
    }

    const postsContainer = document.getElementById('posts-container');
    if (postsContainer && data.posts) {
        data.posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'glass-card terminal-card hover-glow reveal-up';
            card.innerHTML = `
                <div class="card-header">
                    <span class="file-name">${post.id}.log</span>
                    <div class="window-controls">
                        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                    </div>
                </div>
                <div class="card-body">
                    <span class="post-date">${post.date}</span>
                    <h3>${post.title}</h3>
                    <p style="margin: 15px 0; color: var(--text-dim); font-size: 0.9rem;">
                        ${post.summary}
                    </p>
                    <a href="article.html?id=${post.id}" style="color: var(--neon-green); text-decoration: none; font-weight: bold; font-family: var(--terminal-font); font-size: 0.8rem;">> DECRYPT_LOG</a>
                </div>
            `;
            postsContainer.appendChild(card);
        });
    }

    const articleContainer = document.getElementById('article-container');
    if (articleContainer && data.posts) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        const post = data.posts.find(p => p.id === postId);

        if (post) {
            // Simple Markdown parser for Command Boxes and Code tags
            const parseMarkdown = (text) => {
                return text
                    .replace(/```([\s\S]+?)```/g, '<div class="command-box">$1</div>') // Code blocks to command boxes
                    .replace(/`([^`]+?)`/g, '<code>$1</code>') // Inline code
                    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>') // Bold
                    .replace(/> ([^\n]+)/g, '<blockquote>$1</blockquote>'); // Blockquotes
            };

            articleContainer.innerHTML = `
                <div class="article-header">
                    <h1>${post.title}</h1>
                    <div class="article-meta">
                        <span>> STATUS: <span style="color:var(--neon-cyan)">DECRYPTED</span></span>
                        <span>> TS: ${post.date}</span>
                    </div>
                </div>
                <div class="article-body">${parseMarkdown(post.content)}</div>
            `;
            const titleEl = document.querySelector('title');
            if (titleEl) titleEl.textContent = `${post.title} | Swagotom Portfolio`;
        } else {
            articleContainer.innerHTML = `
                <div class="article-header">
                    <h1 style="color:var(--neon-red)">404_NOT_FOUND</h1>
                </div>
                <div class="article-body">
                    <span style="color:var(--neon-red)">CRITICAL ERROR:</span> The requested log could not be decrypted or does not exist.
                </div>
            `;
        }
    }
};

export const initInteractions = () => {
};
