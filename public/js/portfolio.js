// public/js/portfolio.js
async function fetchText(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return ''; // Return empty string on error
    }
}

function renderPortfolio() {
    const portfolioContainer = document.getElementById('portfolio-container');
    if (!portfolioContainer) {
        console.error('Portfolio container not found');
        return;
    }    portfolioContainer.innerHTML = ''; // Clear existing content

    const portfolioHeader = document.createElement('h1');
    portfolioHeader.className = 'portfolio-header';
    // portfolioHeader.textContent = 'Portfolio';
    portfolioContainer.appendChild(portfolioHeader);

    // --- Hero Section ---
    const heroSection = document.createElement('section');
    heroSection.className = 'hero-section';
    heroSection.id = 'home';
    
    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';
    
    const heroTitle = document.createElement('h1');
    heroTitle.className = 'hero-title';
    heroTitle.textContent = 'Welcome to My Portfolio';
    
    const heroSubtitle = document.createElement('h2');
    heroSubtitle.className = 'hero-subtitle';
    heroSubtitle.textContent = 'Game Developer & Web Designer';
    
    const heroDescription = document.createElement('p');
    heroDescription.className = 'hero-description';
    heroDescription.textContent = 'Creating immersive experiences and innovative solutions through code and creativity.';
    
    const heroCTA = document.createElement('div');
    heroCTA.className = 'hero-cta';
    
    const viewWorkButton = document.createElement('a');
    viewWorkButton.className = 'hero-button primary';
    viewWorkButton.href = '#projects';
    viewWorkButton.textContent = 'View My Work';
    
    const contactButton = document.createElement('a');
    contactButton.className = 'hero-button secondary';
    contactButton.href = '#contact';
    contactButton.textContent = 'Get In Touch';
    
    heroCTA.appendChild(viewWorkButton);
    heroCTA.appendChild(contactButton);
    
    heroContent.appendChild(heroTitle);
    heroContent.appendChild(heroSubtitle);
    heroContent.appendChild(heroDescription);
    heroContent.appendChild(heroCTA);
    
    heroSection.appendChild(heroContent);
    portfolioContainer.appendChild(heroSection);

    // --- About Me Section ---
    const aboutSection = document.createElement('section');
    aboutSection.className = 'about-section'; // Changed class name
    aboutSection.id = 'about';
    const aboutTitle = document.createElement('h2');
    aboutTitle.className = 'section-title';
    aboutTitle.textContent = 'About Me';
    aboutSection.appendChild(aboutTitle);

    const aboutMeContent = document.createElement('div'); // New container for the text
    aboutMeContent.className = 'about-me-content';

    fetchText('assets/texts/texts.txt').then(text => {
        // Join lines into a single paragraph or process as needed
        // For now, let's assume the text is a single block.
        // If texts.txt has multiple paragraphs separated by blank lines,
        // we might need to split and create multiple <p> elements.
        // For simplicity, we'll treat it as one block for now.
        const p = document.createElement('p');
        // Replace newlines in the text file with <br> for HTML rendering,
        // or split into multiple paragraphs if that's the structure.
        // Current texts.txt seems to be a single block of text.
        p.innerHTML = text.trim().replace(/\r?\n/g, '<br>'); 
        aboutMeContent.appendChild(p);
    }).catch(error => { // Added catch block for robustness
        console.error("Failed to load about me text:", error);
        const pError = document.createElement('p');
        pError.textContent = 'Could not load about me information.';
        pError.style.color = 'var(--accent-color)';
        aboutMeContent.appendChild(pError);
    });
    aboutSection.appendChild(aboutMeContent); // Append the new content container
    portfolioContainer.appendChild(aboutSection);

    // --- Projects Section ---
    const projectsSection = document.createElement('section');
    projectsSection.className = 'projects-section';
    projectsSection.id = 'projects';
    const projectsTitle = document.createElement('h2');
    projectsTitle.className = 'section-title';
    projectsTitle.textContent = 'Projects';
    projectsSection.appendChild(projectsTitle);
    const projectsContent = document.createElement('div');
    projectsContent.className = 'projects-content';
    fetchText('assets/texts/projects.txt').then(text => {
        console.log("[DEBUG] Fetched projects.txt content:\n" + text); // Log raw content
        
        const projectEntries = text.split(/\r?\n\r?\n/).filter(entry => {
            const trimmedEntry = entry.trim();
            return trimmedEntry !== '' && !trimmedEntry.startsWith('/*');
        });
        console.log("[DEBUG] Parsed projectEntries:", projectEntries); // Log entries after split and filter

        if (projectEntries.length === 0 && text.trim() !== '' && !text.trim().startsWith('/*')) {
            console.warn("[DEBUG] No project entries were parsed. This might be due to incorrect formatting in projects.txt. Ensure projects are separated by one completely blank line.");
        }

        projectEntries.forEach((projectData, index) => {
            // console.log(`[DEBUG] Processing projectData ${index + 1}:\n${projectData}`); // Log each project block
            
            // Split projectData into lines, but stop if a line starts with '/*'
            const linesFromEntry = projectData.split(/\r?\n/);
            const effectiveContentLines = [];
            for (const line of linesFromEntry) {
                if (line.trim().startsWith('/*')) {
                    break; // Stop processing lines for this project if a comment block starts
                }
                effectiveContentLines.push(line);
            }
            
            // Now, map and filter these effective lines to get clean project lines
            const projectLines = effectiveContentLines.map(line => line.trim()).filter(line => line !== '');
            // console.log(`[DEBUG] Parsed projectLines for project ${index + 1}:`, projectLines); // Log lines for this project
            
            if (projectLines.length < 3) { // Need at least Title, Description, Image
                console.warn(`[DEBUG] Project entry ${index + 1} (Data after filtering comments and empty lines: "${projectLines.join(' | ')}") is incomplete. Expected at least 3 lines (Title, Description, Image), got ${projectLines.length}. Original data block was:\n${projectData}`);
                return;
            }

            const title = projectLines[0];
            // The last line is now a comma-separated string of image filenames
            const imageNamesString = projectLines[projectLines.length - 1];
            const imageFilenames = imageNamesString.split(',').map(name => name.trim()).filter(name => name !== '');
            
            let subtitle = '';
            let descriptionLines = [];

            // Assumes Title is line 0, Image string is last line.
            // Remaining lines are Subtitle (if present) and Description.
            // Adjust slice to account for imageFilenames being the last line.
            if (projectLines.length === 3) { // Title, Description, ImageFilenames
                descriptionLines = [projectLines[1]];
            } else if (projectLines.length > 3) { // Title, Subtitle, Description..., ImageFilenames
                subtitle = projectLines[1];
                descriptionLines = projectLines.slice(2, projectLines.length - 1);
            }
            const description = descriptionLines.join('\n');            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            
            console.log('Creating project item for:', title); // Keep debug log

            const h3 = document.createElement('h3');
            h3.textContent = title;
            projectItem.appendChild(h3);

            if (subtitle) {
                const h4 = document.createElement('h4');
                h4.textContent = subtitle;
                projectItem.appendChild(h4);
            }

            const p = document.createElement('p');
            // Convert newlines to spaces for the card display and prepare for truncation
            const cardDescriptionText = description.replace(/\n/g, ' '); 
            const maxCardDescriptionLength = 100; // Max characters for description on the card

            if (cardDescriptionText.length > maxCardDescriptionLength) {
                let snippet = cardDescriptionText.substring(0, maxCardDescriptionLength);
                // Try to break at the last space to avoid cutting words
                const lastSpaceIndex = snippet.lastIndexOf(' ');
                if (lastSpaceIndex > 0) {
                    snippet = snippet.substring(0, lastSpaceIndex);
                }
                p.textContent = snippet + '...';
            } else {
                p.textContent = cardDescriptionText;
            }
            projectItem.appendChild(p);

            // For the project card, we'll display the first image if available
            // The modal will receive all image filenames.
            let firstImageSrcForCard = null; 
            const allImageSourcesForModal = [];
            let imageElement = null; // Declare imageElement here to ensure it's in scope

            if (imageFilenames.length > 0) {
                const firstImageName = imageFilenames[0];
                firstImageSrcForCard = `assets/images/${firstImageName}`;

                imageFilenames.forEach(imageName => {
                    allImageSourcesForModal.push(`assets/images/${imageName}`);
                });

                imageElement = document.createElement('img'); // Assign here
                imageElement.src = firstImageSrcForCard;
                imageElement.alt = title + " - primary image";
                imageElement.className = 'project-image';
                imageElement.loading = 'lazy';
                imageElement.onerror = function() {
                    console.error(`Failed to load primary image for card: ${imageElement.src}.`);
                };
                
                // Add click event listener for image modal (for the first image on the card)
                imageElement.addEventListener('click', function(event) {
                    event.stopPropagation(); 
                    createImageModal(this.src, this.alt);
                });
                projectItem.appendChild(imageElement);            } else {
                const pNoImage = document.createElement('p');
                pNoImage.textContent = 'No images specified for this project.';
                projectItem.appendChild(pNoImage);
            }            // Add click listener to the entire project item for the project detail modal
            projectItem.addEventListener('click', (event) => {
                console.log('Project item clicked!', event.target); // Debug log
                // Check if the click target is the project image itself or a child of it.
                // If so, the image's own click listener (for createImageModal) should handle it.
                if (imageElement && (event.target === imageElement || imageElement.contains(event.target))) {
                    console.log('Image clicked, opening image modal'); // Debug log
                    return; // Do not open project detail modal if the project image was clicked.
                }
                console.log('Opening project detail modal for:', title); // Debug log
                createProjectDetailModal(title, subtitle, description, allImageSourcesForModal, title);
            });
            
            console.log('Added click listener to project:', title); // Debug log

            projectsContent.appendChild(projectItem);
        });
    });
    projectsSection.appendChild(projectsContent);
    portfolioContainer.appendChild(projectsSection);

    // --- Experience Section ---
    const experienceSection = document.createElement('section');
    experienceSection.className = 'experience-section';
    experienceSection.id = 'experience';
    const experienceTitle = document.createElement('h2');
    experienceTitle.className = 'section-title';
    experienceTitle.textContent = 'Work Experience';
    experienceSection.appendChild(experienceTitle);
    const experienceContent = document.createElement('div');
    experienceContent.className = 'experience-content';

    fetchText('assets/texts/experience.txt').then(text => {
        const experienceEntries = text.split(/\r?\n\r?\n/).filter(entry => {
            const trimmedEntry = entry.trim();
            return trimmedEntry !== '' && !trimmedEntry.startsWith('/*');
        });

        experienceEntries.forEach(entryData => {
            const lines = entryData.split(/\r?\n/).map(line => line.trim()).filter(line => line !== '' && !line.startsWith('//'));
            
            if (lines.length < 3) { // Title, Company | Location, Date are minimum
                return; // Silently skip incomplete entries
            }

            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';

            const jobTitle = document.createElement('h3');
            jobTitle.textContent = lines[0];
            experienceItem.appendChild(jobTitle);

            const companyInfo = document.createElement('h4');
            companyInfo.textContent = lines[1];
            experienceItem.appendChild(companyInfo);

            const dateInfo = document.createElement('p');
            dateInfo.className = 'date';
            dateInfo.textContent = lines[2];
            experienceItem.appendChild(dateInfo);

            if (lines.length > 3) {
                const responsibilitiesList = document.createElement('ul');
                for (let i = 3; i < lines.length; i++) {
                    const line = lines[i]; 
                    if (line.startsWith('-')) {
                        const currentLi = document.createElement('li');
                        let textForLi = line.substring(1).trim(); 

                        let j = i + 1;
                        while (j < lines.length && !lines[j].startsWith('-')) {
                            const continuationLine = lines[j].trim(); 
                            if (continuationLine) { 
                                textForLi += '<br>' + continuationLine;
                            }
                            j++;
                        }
                        currentLi.innerHTML = textForLi; 
                        responsibilitiesList.appendChild(currentLi);
                        i = j - 1; 
                    }
                }
                experienceItem.appendChild(responsibilitiesList);
            }
            experienceContent.appendChild(experienceItem);
        });
    }).catch(error => {
        console.error("Failed to load experience.txt:", error);
        const pError = document.createElement('p');
        pError.textContent = 'Could not load work experience.';
        pError.style.color = 'var(--accent-color)';
        experienceContent.appendChild(pError);
    });
    experienceSection.appendChild(experienceContent);
    portfolioContainer.appendChild(experienceSection); // Add before Skills


      // --- Images Section (Gallery) ---
    const imagesSection = document.createElement('section');
    imagesSection.className = 'images-section';
    imagesSection.id = 'gallery';
    const imagesTitle = document.createElement('h2');
    imagesTitle.className = 'section-title';
    imagesTitle.textContent = 'Gallery';
    imagesSection.appendChild(imagesTitle);

    const imagesPreviewContent = document.createElement('div');
    imagesPreviewContent.className = 'images-content-preview'; // Class for the preview area

    // Create a container for the preview images themselves
    const previewThumbnailsContainer = document.createElement('div');
    previewThumbnailsContainer.className = 'preview-thumbnails-container';
    imagesPreviewContent.appendChild(previewThumbnailsContainer);

    // Add a button to open the full gallery modal
    const openGalleryButton = document.createElement('button');
    openGalleryButton.className = 'open-gallery-button btn btn-primary'; 
    openGalleryButton.textContent = 'View Full Gallery';
    openGalleryButton.onclick = () => createFullGalleryModal();
    // Button will be appended after images or if no images, see below

    const galleryLoadingIndicator = document.createElement('p');
    galleryLoadingIndicator.className = 'loading-indicator';
    galleryLoadingIndicator.textContent = 'Loading gallery preview...';
    previewThumbnailsContainer.appendChild(galleryLoadingIndicator); // Show loading in the thumbnails area

    let allImageFilenames = [];
    
    fetchText('assets/texts/gallery.txt').then(text => {
        galleryLoadingIndicator.remove();
        allImageFilenames = text.split(/\r?\n/).map(name => name.trim()).filter(name => name !== '' && !name.startsWith('#'));
        const numberOfPreviewImages = 4; // Show up to 4 preview images
        const previewImageFilenames = allImageFilenames.slice(0, numberOfPreviewImages);

        if (previewImageFilenames.length > 0) {
            previewImageFilenames.forEach((filename, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'gallery-image-container preview-image-item'; // Added class for specific preview item styling

                const img = document.createElement('img');
                img.src = `assets/images/${filename}`;
                img.alt = `Gallery preview ${index + 1} - ${filename}`;
                img.className = 'portfolio-image gallery-image';
                img.loading = 'lazy';
                img.onerror = function() {
                    console.error(`Failed to load gallery preview image: ${img.src}.`);
                    imgContainer.innerHTML = `<p class="gallery-image-error">Error loading ${filename}</p>`;
                };

                img.addEventListener('click', function() {
                    const allGalleryImages = allImageFilenames.map(fn => `assets/images/${fn}`);
                    const imgIndex = allGalleryImages.indexOf(this.src);
                    createImageModal(this.src, this.alt, allGalleryImages, imgIndex >= 0 ? imgIndex : index);
                });

                imgContainer.appendChild(img);
                previewThumbnailsContainer.appendChild(imgContainer);
            });
            imagesPreviewContent.appendChild(openGalleryButton); // Add button after previews
        } else if (allImageFilenames.length > 0) {
            // This case means there are images in gallery.txt, but slice resulted in 0 (e.g. numberOfPreviewImages = 0)
            // Or simply, if there are images, always show the button
            imagesPreviewContent.appendChild(openGalleryButton);
            const pNoPreviews = document.createElement('p');
            pNoPreviews.textContent = 'Click "View Full Gallery" to see all images.';
            pNoPreviews.style.textAlign = 'center';
            previewThumbnailsContainer.appendChild(pNoPreviews); 
        } else {
            const pNoImages = document.createElement('p');
            pNoImages.textContent = 'No images in the gallery yet. Add images to assets/texts/gallery.txt.';
            pNoImages.style.textAlign = 'center';
            previewThumbnailsContainer.appendChild(pNoImages);
            // Optionally hide or disable the button if there are truly no images
            openGalleryButton.style.display = 'none'; 
        }
        // Ensure button is appended if not already (e.g. if previewImageFilenames was empty but allImageFilenames was not)
        if (!imagesPreviewContent.contains(openGalleryButton) && allImageFilenames.length > 0) {
             imagesPreviewContent.appendChild(openGalleryButton);
        }

    }).catch(error => {
        galleryLoadingIndicator.remove();
        console.error("Failed to load gallery.txt for preview:", error);
        const pError = document.createElement('p');
        pError.textContent = 'Could not load gallery preview.';
        pError.style.textAlign = 'center';
        pError.style.color = 'var(--accent-color)';
        previewThumbnailsContainer.appendChild(pError);
        openGalleryButton.style.display = 'none'; // Hide button on error
    });

    imagesSection.appendChild(imagesPreviewContent);
    portfolioContainer.appendChild(imagesSection);
    // --- Skills Section ---
    const skillsSection = document.createElement('section');
    skillsSection.className = 'skills-section';
    skillsSection.id = 'skills';
    const skillsTitle = document.createElement('h2');
    skillsTitle.className = 'section-title';
    skillsTitle.textContent = 'Skills';
    skillsSection.appendChild(skillsTitle);

    const skillsContentContainer = document.createElement('div');
    skillsContentContainer.className = 'skills-content-container';

    fetchText('assets/texts/skills.txt').then(text => {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '' && !line.startsWith('//'));

        let standaloneSkillsDiv = null;
        let standaloneSkillsList = null;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.includes(':')) {
                const parts = trimmedLine.split(':', 2);
                const categoryName = parts[0].trim();
                const subSkillsString = parts[1].trim();
                
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';

                const categoryTitleElement = document.createElement('h4');
                categoryTitleElement.className = 'skill-category-title';
                categoryTitleElement.textContent = categoryName;
                categoryDiv.appendChild(categoryTitleElement);

                const subSkillsUl = document.createElement('ul');
                subSkillsUl.className = 'skill-list skill-subcategory-list';
                
                subSkillsString.split(',').forEach(subSkill => {
                    const subSkillTrimmed = subSkill.trim();
                    if (subSkillTrimmed) {
                        const li = document.createElement('li');
                        li.className = 'skill-item';
                        li.textContent = subSkillTrimmed;
                        subSkillsUl.appendChild(li);
                    }
                });
                categoryDiv.appendChild(subSkillsUl);
                skillsContentContainer.appendChild(categoryDiv);
            } else {
                if (!standaloneSkillsDiv) {
                    standaloneSkillsDiv = document.createElement('div');
                    standaloneSkillsDiv.className = 'skill-category standalone-skills-category';

                    const standaloneCategoryTitle = document.createElement('h4');
                    standaloneCategoryTitle.className = 'skill-category-title';
                    standaloneCategoryTitle.textContent = 'Technical Proficiencies';
                    standaloneSkillsDiv.appendChild(standaloneCategoryTitle);

                    standaloneSkillsList = document.createElement('ul');
                    standaloneSkillsList.className = 'skill-list';
                    standaloneSkillsDiv.appendChild(standaloneSkillsList);
                    skillsContentContainer.appendChild(standaloneSkillsDiv);
                }
                const li = document.createElement('li');
                li.className = 'skill-item';
                li.textContent = trimmedLine;
                standaloneSkillsList.appendChild(li);
            }
        });
    }).catch(error => {
        console.error("Failed to load skills.txt:", error);
        const pError = document.createElement('p');
        pError.textContent = 'Could not load skills.';
        pError.style.color = 'var(--accent-color)';
        skillsContentContainer.appendChild(pError);
    });

    skillsSection.appendChild(skillsContentContainer);
    portfolioContainer.appendChild(skillsSection);

  

    // --- Contact Section ---
    const contactSection = document.createElement('section');
    contactSection.className = 'contact-section';
    contactSection.id = 'contact';
    const contactTitle = document.createElement('h2');
    contactTitle.className = 'section-title';
    contactTitle.textContent = 'Contact';
    contactSection.appendChild(contactTitle);
    const contactGrid = document.createElement('div');
    contactGrid.className = 'contact-grid';

    const iconMap = {
        email: 'fas fa-envelope',
        linkedin: 'fab fa-linkedin',
        github: 'fab fa-github',
        phone: 'fas fa-phone',
        itchio: 'fab fa-itch-io', 
        website: 'fas fa-globe',
        twitter: 'fab fa-twitter',
        instagram: 'fab fa-instagram',
        facebook: 'fab fa-facebook'
    };
    const defaultIcon = 'fas fa-info-circle';

    fetchText('assets/texts/contact.txt').then(text => {
        text.split(/\r?\n/).forEach(line => {
            if (line.trim() === '' || line.startsWith('//')) return;

            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';

            const iconSpan = document.createElement('span');
            iconSpan.className = 'contact-icon';

            let linkTextContent = line;
            let url = '#';
            let isLink = false;
            let contactType = 'unknown';

            if (line.includes(':')) {
                const parts = line.split(': ');
                contactType = parts[0].toLowerCase().replace(/[^a-z0-9]/gi, ''); 
                const value = parts.slice(1).join(': ');
                linkTextContent = value;

                iconSpan.innerHTML = `<i class="${iconMap[contactType] || defaultIcon}"></i>`;

                if (contactType === 'email') {
                    url = `mailto:${value}`; 
                    isLink = true;
                } else if (contactType === 'phone') {
                    url = `tel:${value.replace(/\s+/g, '')}`; 
                    isLink = true;
                } else if (value.startsWith('http') || value.startsWith('www')) {
                    url = value.startsWith('http') ? value : `https://${value}`;
                    isLink = true;
                } else {
                    linkTextContent = line; 
                    isLink = false; 
                }
            } else {
                iconSpan.innerHTML = `<i class="${defaultIcon}"></i>`;
            }

            contactItem.appendChild(iconSpan);

            if (isLink) {
                const a = document.createElement('a');
                a.href = url;
                a.textContent = linkTextContent;
                if (!url.startsWith('mailto:') && !url.startsWith('tel:')) {
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                }
                contactItem.appendChild(a);
            } else {
                const p = document.createElement('p');
                p.textContent = linkTextContent;
                contactItem.appendChild(p);
            }
            contactGrid.appendChild(contactItem);
        });
    });
    contactSection.appendChild(contactGrid);
    portfolioContainer.appendChild(contactSection);
}

// Function to create and display the image modal with gallery navigation support
function createImageModal(src, alt, galleryImages = null, currentIndex = 0) {
    console.log('[createImageModal] Called with src:', src, 'galleryImages:', galleryImages, 'currentIndex:', currentIndex);

    // Check if a modal already exists and remove it
    const existingModal = document.getElementById('image-modal-overlay');
    if (existingModal) {
        console.log('[createImageModal] Found existing modal, attempting to remove.');
        if (typeof existingModal.closeModalCleanup === 'function') {
            existingModal.closeModalCleanup();
        } else {
            existingModal.remove();
        }
    }

    let currentScale = 1.0;
    const scaleStep = 0.2;
    const minScale = 0.5;
    const maxScale = 3.0;
    let translateX = 0;
    let translateY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let currentImageIndex = currentIndex;
    
    // Touch handling for swipe gestures
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoveX = 0;
    const swipeThreshold = 50;

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'image-modal-overlay';
    modalOverlay.className = 'image-modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'image-modal-content';

    const modalImage = document.createElement('img');
    modalImage.src = src;
    modalImage.alt = alt;
    modalImage.className = 'image-modal-image';
    modalImage.style.transformOrigin = 'center center';
    modalImage.style.cursor = 'grab';
    modalImage.draggable = false;    // Helper functions
    function updateZoomControls() {
        const zoomButtons = modalOverlay.querySelectorAll('.image-modal-zoom');
        if (currentScale > 1.0) {
            modalOverlay.classList.add('zoomed');
            zoomButtons.forEach(btn => btn.classList.add('visible'));
        } else {
            modalOverlay.classList.remove('zoomed');
            zoomButtons.forEach(btn => btn.classList.remove('visible'));
        }
    }
    
    function updateImageCounter() {
        if (galleryImages && galleryImages.length > 1) {
            const counter = modalOverlay.querySelector('.image-counter');
            if (counter) {
                counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
            }
        }
    }
    
    function updateNavigationButtons() {
        if (!galleryImages || galleryImages.length <= 1) return;
        
        const prevBtn = modalOverlay.querySelector('.gallery-nav-prev');
        const nextBtn = modalOverlay.querySelector('.gallery-nav-next');
        
        if (prevBtn) prevBtn.style.display = currentImageIndex > 0 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = currentImageIndex < galleryImages.length - 1 ? 'flex' : 'none';
    }
    
    function loadImage(index) {
        if (!galleryImages || index < 0 || index >= galleryImages.length) return;
        
        currentImageIndex = index;
        modalImage.style.opacity = '0';
        modalImage.style.transition = 'opacity 0.2s ease';
        
        setTimeout(() => {
            modalImage.src = galleryImages[index];
            modalImage.alt = `Gallery image ${index + 1}`;
            resetZoom();
            updateImageCounter();
            updateNavigationButtons();
            updateThumbnails();
            
            modalImage.onload = () => {
                modalImage.style.opacity = '1';
            };
        }, 200);
    }
    
    function navigatePrevious() {
        if (currentImageIndex > 0) {
            loadImage(currentImageIndex - 1);
        }
    }
    
    function navigateNext() {
        if (currentImageIndex < galleryImages.length - 1) {
            loadImage(currentImageIndex + 1);
        }
    }
    
    function updateThumbnails() {
        const thumbnails = modalOverlay.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    function applyTransform() {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        updateZoomControls();
    }

    function zoomIn() {
        if (currentScale < maxScale) {
            currentScale = Math.min(maxScale, currentScale + scaleStep);
            applyTransform();
        }
    }

    function zoomOut() {
        if (currentScale > minScale) {
            currentScale = Math.max(minScale, currentScale - scaleStep);
            applyTransform();
        }
    }

    function resetZoom() {
        currentScale = 1.0;
        translateX = 0;
        translateY = 0;
        modalImage.style.cursor = 'grab';
        applyTransform();
    }

    // Event handlers
    const wheelHandler = function(event) {
        event.preventDefault();
        const rect = modalImage.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - rect.width / 2;
        const mouseY = event.clientY - rect.top - rect.height / 2;
        
        const oldScale = currentScale;
        
        if (event.deltaY < 0) {
            currentScale = Math.min(maxScale, currentScale + scaleStep);
        } else {
            currentScale = Math.max(minScale, currentScale - scaleStep);
        }
        
        // Adjust position to zoom towards mouse cursor
        const scaleRatio = currentScale / oldScale;
        translateX = translateX * scaleRatio + mouseX * (1 - scaleRatio);
        translateY = translateY * scaleRatio + mouseY * (1 - scaleRatio);
        
        applyTransform();
    };

    const imageMouseDownHandler = function(event) {
        if (currentScale <= 1.0) return;
        event.preventDefault();
        isPanning = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
        modalImage.style.cursor = 'grabbing';
    };

    const documentMouseMoveHandler = function(event) {
        if (!isPanning) return;
        event.preventDefault();
        translateX = event.clientX - startX;
        translateY = event.clientY - startY;
        applyTransform();
    };

    const documentMouseUpHandler = function() {
        if (isPanning) {
            isPanning = false;
            modalImage.style.cursor = 'grab';
        }
    };

    // Cleanup function
    const closeModalCleanup = function() {
        modalImage.removeEventListener('wheel', wheelHandler);
        modalImage.removeEventListener('mousedown', imageMouseDownHandler);
        modalImage.removeEventListener('touchstart', touchStartHandler);
        modalImage.removeEventListener('touchmove', touchMoveHandler);
        modalImage.removeEventListener('touchend', touchEndHandler);
        document.removeEventListener('mousemove', documentMouseMoveHandler);
        document.removeEventListener('mouseup', documentMouseUpHandler);
        document.removeEventListener('keydown', keyHandler);

        if (modalOverlay.parentNode) {
            modalOverlay.remove();
        }
    };    // Keyboard handler
    const keyHandler = function(event) {
        switch(event.key) {
            case 'Escape':
                event.preventDefault();
                closeModalCleanup();
                break;
            case '+':
            case '=':
                event.preventDefault();
                zoomIn();
                break;
            case '-':
                event.preventDefault();
                zoomOut();
                break;
            case '0':
                event.preventDefault();
                resetZoom();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (currentScale > 1.0) {
                    translateX += 20;
                    applyTransform();
                } else if (galleryImages && galleryImages.length > 1) {
                    navigatePrevious();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentScale > 1.0) {
                    translateX -= 20;
                    applyTransform();
                } else if (galleryImages && galleryImages.length > 1) {
                    navigateNext();
                }
                break;
            case 'ArrowUp':
                if (currentScale > 1.0) {
                    event.preventDefault();
                    translateY += 20;
                    applyTransform();
                }
                break;
            case 'ArrowDown':
                if (currentScale > 1.0) {
                    event.preventDefault();
                    translateY -= 20;
                    applyTransform();
                }
                break;
        }
    };

    // Store cleanup function
    modalOverlay.closeModalCleanup = closeModalCleanup;    // Create controls
    const closeButton = document.createElement('button');
    closeButton.className = 'image-modal-close';
    closeButton.innerHTML = '✕';
    closeButton.setAttribute('aria-label', 'Close image');
    closeButton.onclick = closeModalCleanup;

    const zoomInButton = document.createElement('button');
    zoomInButton.className = 'image-modal-zoom image-modal-zoom-in';
    zoomInButton.innerHTML = '+';
    zoomInButton.title = 'Zoom In';
    zoomInButton.onclick = zoomIn;

    const zoomOutButton = document.createElement('button');
    zoomOutButton.className = 'image-modal-zoom image-modal-zoom-out';
    zoomOutButton.innerHTML = '−';
    zoomOutButton.title = 'Zoom Out';
    zoomOutButton.onclick = zoomOut;

    const resetZoomButton = document.createElement('button');
    resetZoomButton.className = 'image-modal-zoom image-modal-zoom-reset';
    resetZoomButton.innerHTML = '⌂';
    resetZoomButton.title = 'Reset Zoom (Fit to screen)';
    resetZoomButton.onclick = resetZoom;

    // Touch event handlers for swipe gestures
    const touchStartHandler = function(event) {
        if (currentScale > 1.0 || !galleryImages || galleryImages.length <= 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    };
    
    const touchMoveHandler = function(event) {
        if (currentScale > 1.0 || !galleryImages || galleryImages.length <= 1) return;
        touchMoveX = event.touches[0].clientX;
    };
    
    const touchEndHandler = function(event) {
        if (currentScale > 1.0 || !galleryImages || galleryImages.length <= 1) return;
        
        const diffX = touchStartX - touchMoveX;
        const diffY = Math.abs(touchStartY - (event.changedTouches[0].clientY));
        
        // Only trigger if horizontal swipe is dominant
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
            if (diffX > 0) {
                navigateNext();
            } else {
                navigatePrevious();
            }
        }
    };

    // Attach event listeners
    modalImage.addEventListener('wheel', wheelHandler);
    modalImage.addEventListener('mousedown', imageMouseDownHandler);
    modalImage.addEventListener('touchstart', touchStartHandler, { passive: true });
    modalImage.addEventListener('touchmove', touchMoveHandler, { passive: true });
    modalImage.addEventListener('touchend', touchEndHandler, { passive: true });
    document.addEventListener('mousemove', documentMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
    document.addEventListener('keydown', keyHandler);

    // Close modal on overlay click
    modalOverlay.onclick = function(event) {
        if (event.target === modalOverlay) {
            closeModalCleanup();
        }
    };

    // Create navigation buttons if gallery context exists
    if (galleryImages && galleryImages.length > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'gallery-nav-prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.title = 'Previous image (← arrow key)';
        prevButton.onclick = navigatePrevious;
        
        const nextButton = document.createElement('button');
        nextButton.className = 'gallery-nav-next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.title = 'Next image (→ arrow key)';
        nextButton.onclick = navigateNext;
        
        const imageCounter = document.createElement('div');
        imageCounter.className = 'image-counter';
        imageCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        
        // Create thumbnail strip
        const thumbnailStrip = document.createElement('div');
        thumbnailStrip.className = 'thumbnail-strip';
        
        galleryImages.forEach((imgSrc, index) => {
            const thumbContainer = document.createElement('div');
            thumbContainer.className = 'thumbnail-item' + (index === currentImageIndex ? ' active' : '');
            
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `Thumbnail ${index + 1}`;
            thumb.loading = 'lazy';
            thumb.onclick = () => loadImage(index);
            
            thumbContainer.appendChild(thumb);
            thumbnailStrip.appendChild(thumbContainer);
        });
        
        modalOverlay.appendChild(prevButton);
        modalOverlay.appendChild(nextButton);
        modalOverlay.appendChild(imageCounter);
        modalOverlay.appendChild(thumbnailStrip);
    }

    // Assemble modal
    modalContent.appendChild(modalImage);
    modalContent.appendChild(zoomInButton);
    modalContent.appendChild(zoomOutButton);
    modalContent.appendChild(resetZoomButton);

    modalOverlay.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    console.log('[createImageModal] Appending modalOverlay to body');
    document.body.appendChild(modalOverlay);

    // Show modal with animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
            console.log('[createImageModal] Modal activated');
        });
    });

    // Initialize transform
    applyTransform();
}

// Function to create and display the project detail modal
function createProjectDetailModal(title, subtitle, description, imageSrcs, imageBaseAlt) { // Changed imageSrc to imageSrcs
    console.log('[createProjectDetailModal] Called with title:', title, 'imageSrcs:', imageSrcs); // Enhanced debug log

    // Check if a modal already exists and remove it
    const existingModal = document.getElementById('project-detail-modal-overlay');
    if (existingModal) {
        console.log('[createProjectDetailModal] Found existing project detail modal, removing.');
        existingModal.remove();
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'project-detail-modal-overlay'; // Unique ID for project modal
    modalOverlay.className = 'image-modal-overlay'; // Can reuse some styling

    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'project-detail-modal-content'; // Specific class for project content

    // Create title element
    const modalTitle = document.createElement('h3');
    modalTitle.className = 'project-detail-modal-title';
    modalTitle.textContent = title;
    modalContent.appendChild(modalTitle);

    // Create subtitle element (if subtitle exists)
    if (subtitle) {
        const modalSubtitle = document.createElement('h4');
        modalSubtitle.className = 'project-detail-modal-subtitle';
        modalSubtitle.textContent = subtitle;
        modalContent.appendChild(modalSubtitle);
    }

    // Create description element with Read More functionality
    const modalDescription = document.createElement('p');
    modalDescription.className = 'project-detail-modal-description';
    
    const fullDescriptionHtml = description.replace(/\n/g, '<br>');
    const shortDescriptionLength = 200; // Max characters for the snippet

    if (description.length > shortDescriptionLength) {
        // Create snippet. Find a space near shortDescriptionLength to avoid cutting words.
        let snippet = description.substring(0, shortDescriptionLength);
        const lastSpace = snippet.lastIndexOf(' ');
        if (lastSpace > 0) {
            snippet = snippet.substring(0, lastSpace);
        }        snippet += '...';
        modalDescription.innerHTML = snippet.replace(/\n/g, '<br>');

        const readMoreButton = document.createElement('button');
        readMoreButton.textContent = 'Read more';
        readMoreButton.className = 'read-more-button';
        readMoreButton.onclick = function(e) {
            e.preventDefault();
            modalDescription.innerHTML = fullDescriptionHtml;
            
            // Create "Read less" button
            const readLessButton = document.createElement('button');
            readLessButton.textContent = 'Read less';
            readLessButton.className = 'read-less-button';
            readLessButton.onclick = function() {
                modalDescription.innerHTML = snippet.replace(/\n/g, '<br>');
                this.remove();
                modalContent.insertBefore(readMoreButton, modalDescription.nextSibling);
            };
            this.remove();
            modalContent.insertBefore(readLessButton, modalDescription.nextSibling);
        };
        modalContent.appendChild(modalDescription);
        modalContent.appendChild(readMoreButton);
    } else {
        modalDescription.innerHTML = fullDescriptionHtml;
        modalContent.appendChild(modalDescription);
    }    // Create image elements for the modal (if imageSrcs exist and is an array)
    if (imageSrcs && Array.isArray(imageSrcs) && imageSrcs.length > 0) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'project-detail-modal-images';

        imageSrcs.forEach((src, index) => {
            const modalImage = document.createElement('img');
            modalImage.src = src;
            modalImage.alt = `${imageBaseAlt} - image ${index + 1}`;
            modalImage.className = 'project-detail-modal-image';
            modalImage.loading = 'lazy';
            modalImage.onerror = function() {
                console.error(`Failed to load project detail image: ${modalImage.src}`);
                // Optionally display a placeholder or error message for this specific image
            };
            // Make each image in the modal clickable to open the image zoom modal
            modalImage.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent modal from closing if image is part of content
                const imgIndex = imageSrcs.indexOf(this.src);\n                createImageModal(this.src, this.alt, imageSrcs, imgIndex >= 0 ? imgIndex : index);\n            });
            imageContainer.appendChild(modalImage);
        });
        modalContent.appendChild(imageContainer);
    }
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'project-detail-modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close modal');
    closeButton.onclick = function() {
        modalOverlay.remove();
    };

    // Close modal if overlay is clicked
    modalOverlay.onclick = function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.remove();
        }
    };

    modalContent.appendChild(closeButton); // Add close button to content
    modalOverlay.appendChild(modalContent);

    console.log('[createProjectDetailModal] Appending modalOverlay to body. ID:', modalOverlay.id, 'Class:', modalOverlay.className);
    document.body.appendChild(modalOverlay);
    console.log('[createProjectDetailModal] ModalOverlay parent after append:', modalOverlay.parentNode ? modalOverlay.parentNode.tagName : 'null');
     if (modalOverlay.parentNode !== document.body) {
        console.error("[createProjectDetailModal] Modal overlay was NOT successfully appended to document.body!");
    }
    console.log('[createProjectDetailModal] Computed style before active - display:', window.getComputedStyle(modalOverlay).display, 'opacity:', window.getComputedStyle(modalOverlay).opacity);

    // Trigger the display with a slight delay to allow CSS transition
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
            console.log('[createProjectDetailModal] Added "active" class. Current classes:', modalOverlay.classList.toString());
            console.log('[createProjectDetailModal] Computed style after active - display:', window.getComputedStyle(modalOverlay).display, 'opacity:', window.getComputedStyle(modalOverlay).opacity);
            if (modalOverlay.parentNode !== document.body) {
                console.error("[createProjectDetailModal] Modal overlay was removed from DOM before it could become active!");
            }
            if (window.getComputedStyle(modalOverlay).display === 'none' && modalOverlay.classList.contains('active')) {
                console.warn("[createProjectDetailModal] Modal overlay display is 'none' despite 'active' class. Check CSS for .image-modal-overlay and .image-modal-overlay.active (for project detail modal)");
            }
        });
    });
}

// NEW: Function to create and display the FULL gallery modal
function createFullGalleryModal() {
    console.log('[createFullGalleryModal] Called');

    const existingModal = document.getElementById('full-gallery-modal-overlay');
    if (existingModal) {
        existingModal.remove(); // Remove if already exists
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'full-gallery-modal-overlay';
    modalOverlay.className = 'full-gallery-modal-overlay image-modal-overlay'; // Re-use some styling

    const modalDialog = document.createElement('div');
    modalDialog.className = 'full-gallery-modal-dialog';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'full-gallery-modal-header';
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Photo Gallery';
    modalHeader.appendChild(modalTitle);

    const closeButton = document.createElement('span');
    closeButton.className = 'image-modal-close full-gallery-modal-close'; // Re-use styling
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => modalOverlay.remove();
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.className = 'full-gallery-modal-body images-content'; // Re-use .images-content for grid

    const loadingIndicator = document.createElement('p');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Loading all images...';
    modalBody.appendChild(loadingIndicator);

    let allImageSourcesForModal = [];
    
    fetchText('assets/texts/gallery.txt').then(text => {
        loadingIndicator.remove();
        const imageFilenames = text.split(/\r?\n/).map(name => name.trim()).filter(name => name !== '' && !name.startsWith('#'));
        
        // Build array of all image sources for modal
        allImageSourcesForModal = imageFilenames.map(filename => `assets/images/${filename}`);

        if (imageFilenames.length === 0) {
            const pNoImages = document.createElement('p');
            pNoImages.textContent = 'No images in the gallery.';
            modalBody.appendChild(pNoImages);
            return;
        }

        imageFilenames.forEach((filename, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-image-container';

            const img = document.createElement('img');
            img.src = `assets/images/${filename}`;
            img.alt = `Gallery image ${index + 1} - ${filename}`;
            img.className = 'portfolio-image gallery-image';
            img.loading = 'lazy';
            img.onerror = function() {
                console.error(`Failed to load gallery image in full modal: ${img.src}.`);
                imgContainer.innerHTML = `<p class="gallery-image-error">Error loading ${filename}</p>`;
            };

            img.addEventListener('click', function() {
                createImageModal(this.src, this.alt, allImageSourcesForModal, index); // Pass gallery context
            });

            imgContainer.appendChild(img);
            modalBody.appendChild(imgContainer);
        });
    }).catch(error => {
        loadingIndicator.remove();
        console.error("Failed to load gallery.txt for full gallery modal:", error);
        const pError = document.createElement('p');
        pError.textContent = 'Could not load gallery images.';
        pError.style.color = 'var(--accent-color)';
        modalBody.appendChild(pError);
    });

    modalDialog.appendChild(modalHeader);
    modalDialog.appendChild(modalBody);
    modalOverlay.appendChild(modalDialog);

    // Close modal if overlay backdrop is clicked
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.remove();
        }
    });

    document.body.appendChild(modalOverlay);
    requestAnimationFrame(() => {
        modalOverlay.classList.add('active');
    });
}

// Function to initialize the application (if you have one, e.g., app.js calls this)
// function initApp() { ... renderPortfolio(); ... }
// Make sure renderPortfolio is called, for example, on DOMContentLoaded
if (document.readyState === 'loading') {  // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', renderPortfolio);
} else {  // `DOMContentLoaded` has already fired
    renderPortfolio();
}
