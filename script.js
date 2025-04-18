// Global variables
let spectrumBar;
let currentShadingColor = {r: 138, g: 43, b: 226}; // Default portal color
let selectedColor = null;
let foundCounter = 0;
let totalSecrets = 7;

// Function to create a color preview without affecting background
function createColorPreview(color) {
    // Create a temporary display of the selected color
    const colorDisplay = document.createElement('div');
    colorDisplay.className = 'selected-color-display';
    colorDisplay.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    colorDisplay.style.boxShadow = `0 0 15px rgb(${color.r}, ${color.g}, ${color.b})`;
    
    document.body.appendChild(colorDisplay);
    
    // Animate it
    setTimeout(() => {
        colorDisplay.style.opacity = '1';
        colorDisplay.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after a few seconds
    setTimeout(() => {
        colorDisplay.style.opacity = '0';
        colorDisplay.style.transform = 'translateY(20px)';
        setTimeout(() => {
            colorDisplay.remove();
        }, 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Find all elements
    const portal = document.querySelector('.portal');
    const teleportBtn = document.querySelector('.teleport-btn');
    const hiddenContent = document.querySelector('.hidden-content');
    const returnBtn = document.querySelector('.return-btn');
    const hiddenIcons = document.querySelectorAll('.hidden-icon');
    const hiddenMessage = document.querySelector('.hidden-message');
    const socialIcons = document.querySelectorAll('.social-icons a');
    const cards = document.querySelectorAll('.card');
    const secretCounter = document.querySelector('.counter');
    const colorSliders = document.querySelectorAll('.color-slider input');
    const colorPreview = document.querySelector('.color-preview');
    const colorValues = document.querySelectorAll('.color-value');
    const submitPassword = document.querySelector('.submit-password');
    const colorCodeInput = document.querySelector('.color-code-input');
    const cryptexResult = document.querySelector('.cryptex-result');
    const shadingElements = document.querySelectorAll('.shading-element');
    spectrumBar = document.querySelector('.spectrum-bar');
    
    // Center the portal image
    if (portal) {
        const portalSection = document.querySelector('#portals');
        if (portalSection) {
            portalSection.style.textAlign = 'center';
        }
        portal.style.display = 'inline-block';
        portal.style.margin = '0 auto';
    }
    
    // Add delay to card animations
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add data-content attributes to social icons
    socialIcons[0].setAttribute('data-content', 'Hidden Tweet');
    socialIcons[1].setAttribute('data-content', 'Secret Gallery');
    socialIcons[2].setAttribute('data-content', 'Code Repository');
    
    // Add teleport functionality
    if (teleportBtn && hiddenContent) {
        teleportBtn.addEventListener('click', () => {
            document.body.classList.add('teleport-active');
            
            // Animate shading for teleport effect
            const portalColor = {r: 138, g: 43, b: 226};
            animateShading(portalColor, 2);
            
            setTimeout(() => {
                hiddenContent.classList.add('active');
                
                // Add a secret when using teleport for the first time
                if (!localStorage.getItem('teleport-used')) {
                    incrementSecretCounter();
                    localStorage.setItem('teleport-used', 'true');
                }
                
                setTimeout(() => {
                    document.body.classList.remove('teleport-active');
                }, 500);
            }, 1500);
        });
    }
    
    // Color sliders for mixer in the secret panel
    colorSliders.forEach((slider, index) => {
        slider.addEventListener('input', () => {
            updateColorPreview();
            colorValues[index].textContent = slider.value;
        });
    });
    
    function updateColorPreview() {
        const r = document.getElementById('red').value;
        const g = document.getElementById('green').value;
        const b = document.getElementById('blue').value;
        
        colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        
        // Don't update shading here since we want it to only be affected by the footer
        
        // Check for special RGB values
        if (r === '255' && g === '0' && b === '0') {
            revealColorSecret('red');
            // Only the preview is affected, not the background
            colorPreview.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';
        } else if (r === '0' && g === '255' && b === '0') {
            revealColorSecret('green');
            colorPreview.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.8)';
        } else if (r === '0' && g === '0' && b === '255') {
            revealColorSecret('blue');
            colorPreview.style.boxShadow = '0 0 15px rgba(0, 0, 255, 0.8)';
        } else {
            colorPreview.style.boxShadow = '';
        }
    }
    
    function revealColorSecret(color) {
        // Only count as a new secret if this specific color hasn't been found
        if (!localStorage.getItem(`color-secret-${color}`)) {
            incrementSecretCounter();
            localStorage.setItem(`color-secret-${color}`, 'true');
            showNotification(`You discovered the pure ${color} color!`);
        }
    }
    
    // Cryptex password submission
    if (submitPassword && colorCodeInput) {
        submitPassword.addEventListener('click', () => {
            checkPassword();
        });
        
        colorCodeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        // Update preview when typing in cryptex
        colorCodeInput.addEventListener('input', () => {
            let color = colorCodeInput.value;
            if (color.length === 7 && color.startsWith('#')) {
                try {
                    const rgb = hexToRgb(color);
                    createColorPreview(rgb);
                } catch (e) {
                    // Invalid hex, do nothing
                }
            }
        });
    }
    
    function checkPassword() {
        const enteredPassword = colorCodeInput.value.toLowerCase();
        const correctPassword = "#ff0000";
        
        if (enteredPassword === correctPassword) {
            if (!localStorage.getItem('cryptex-solved')) {
                incrementSecretCounter();
                localStorage.setItem('cryptex-solved', 'true');
            }
            
            cryptexResult.innerHTML = `
                <div class="success-message">
                    <p>Cryptex unlocked! The primary color of light reveals the path.</p>
                    <div class="color-result" style="background-color: ${correctPassword};"></div>
                </div>
            `;
            
            // Style the result
            const colorResult = document.querySelector('.color-result');
            if (colorResult) {
                colorResult.style.width = '50px';
                colorResult.style.height = '50px';
                colorResult.style.margin = '15px auto';
                colorResult.style.borderRadius = '5px';
                colorResult.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
            }
            
        } else if (enteredPassword === '#00ff00') {
            cryptexResult.innerHTML = `
                <div class="partial-message">
                    <p>Green is close, but not the first primary color...</p>
                </div>
            `;
        } else if (enteredPassword === '#0000ff') {
            cryptexResult.innerHTML = `
                <div class="partial-message">
                    <p>Blue is a primary color, but not the one to start with...</p>
                </div>
            `;
        } else {
            cryptexResult.innerHTML = `
                <div class="error-message">
                    <p>Incorrect color code. Try a primary RGB color.</p>
                </div>
            `;
        }
    }
    
    // Add portal hover effect
    if (portal) {
        portal.addEventListener('mousemove', (e) => {
            const bounds = portal.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const angleX = (mouseY - centerY) / 10;
            const angleY = (centerX - mouseX) / 10;
            
            portal.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
            
            // Subtle shading update based on mouse position
            const distanceFromCenter = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
            const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
            const intensity = 0.5 + (distanceFromCenter / maxDistance) * 0.5;
            
            // Adjust color based on position
            const hueShift = (mouseX / bounds.width) * 30 - 15; // -15 to +15 degree hue shift
            const adjustedColor = shiftHue(currentShadingColor, hueShift);
            
            animateShading(adjustedColor, intensity);
        });
    
        portal.addEventListener('mouseleave', () => {
            portal.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            
            // Reset shading
            animateShading(currentShadingColor, 0.5);
        });
        
        // Portal sections for hidden interaction
        portal.addEventListener('click', (e) => {
            const bounds = portal.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            const relativeX = mouseX / bounds.width;
            const relativeY = mouseY / bounds.height;
            
            // Check if clicking different regions of the portal
            if (relativeX < 0.33 && relativeY < 0.33) {
                // Top left section
                showPortalHint('Portal quadrant 1/9: The RGB system uses additive color mixing');
                animateShading({r: 255, g: 100, b: 100}, 0.7); // Red tint
            } else if (relativeX < 0.66 && relativeY < 0.33) {
                // Top middle section
                showPortalHint('Portal quadrant 2/9: In hexadecimal, FF represents 255');
                animateShading({r: 200, g: 200, b: 200}, 0.7); // White/gray tint
            } else if (relativeX >= 0.66 && relativeY < 0.33) {
                // Top right section
                showPortalHint('Portal quadrant 3/9: Red = #FF0000');
                animateShading({r: 255, g: 0, b: 0}, 0.7); // Pure red
            } else if (relativeX < 0.33 && relativeY < 0.66) {
                // Middle left section
                showPortalHint('Portal quadrant 4/9: Green = #00FF00');
                animateShading({r: 0, g: 255, b: 0}, 0.7); // Pure green
            } else if (relativeX < 0.66 && relativeY < 0.66) {
                // Center section - special
                if (!localStorage.getItem('portal-center-secret')) {
                    incrementSecretCounter();
                    localStorage.setItem('portal-center-secret', 'true');
                    showNotification('You found a secret at the heart of the portal!');
                }
                showPortalHint('Portal center: You found the core of the portal. The balance of all colors.');
                animateShading({r: 255, g: 255, b: 255}, 1.5); // White glow
                document.body.classList.add('color-activated');
                setTimeout(() => {
                    document.body.classList.remove('color-activated');
                }, 3000);
            } else if (relativeX >= 0.66 && relativeY < 0.66) {
                // Middle right section
                showPortalHint('Portal quadrant 6/9: Blue = #0000FF');
                animateShading({r: 0, g: 0, b: 255}, 0.7); // Pure blue
            } else if (relativeX < 0.33 && relativeY >= 0.66) {
                // Bottom left section
                showPortalHint('Portal quadrant 7/9: Complementary colors are opposite on the color wheel');
                const complementary = getComplementaryColor(currentShadingColor);
                animateShading(complementary, 0.7);
            } else if (relativeX < 0.66 && relativeY >= 0.66) {
                // Bottom middle section
                showPortalHint('Portal quadrant 8/9: The cryptex accepts hexadecimal color codes');
                animateShading({r: 88, g: 166, b: 255}, 0.7); // Accent color
            } else {
                // Bottom right section
                showPortalHint('Portal quadrant 9/9: Try using #FF0000 in the cryptex');
                animateShading({r: 127, g: 58, b: 206}, 0.7); // Highlight color
            }
        });
    }
    
    // Return button functionality
    if (returnBtn) {
        returnBtn.addEventListener('click', () => {
            hiddenContent.classList.remove('active');
        });
    }
    
    // Initialize shading on page load
    setTimeout(() => {
        animateShading(currentShadingColor, 0.5);
    }, 500);
    
    // Make the spectrum bar a color picker
    if (spectrumBar) {
        spectrumBar.setAttribute('data-is-colorpicker', 'true');
        setupSpectrumBarColorPicker();
    }
    
    // Hidden icons functionality
    if (hiddenIcons.length > 0) {
        hiddenIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                if (!icon.classList.contains('found')) {
                    icon.classList.add('found');
                    let foundIconCounter = 0;
                    hiddenIcons.forEach(i => {
                        if (i.classList.contains('found')) {
                            foundIconCounter++;
                        }
                    });
                    
                    playFoundAnimation(icon);
                    
                    // Track this specific icon being found
                    const iconId = icon.getAttribute('data-id');
                    localStorage.setItem(`icon-found-${iconId}`, 'true');
                    
                    // Only increment the secret counter if this is the first time finding all icons
                    if (foundIconCounter === hiddenIcons.length && !localStorage.getItem('all-icons-found')) {
                        incrementSecretCounter();
                        localStorage.setItem('all-icons-found', 'true');
                        
                        // Special effect for finding all icons but don't change background
                        document.body.classList.add('color-activated');
                        
                        setTimeout(() => {
                            document.body.classList.remove('color-activated');
                        }, 3000);
                        
                        setTimeout(() => {
                            hiddenMessage.classList.add('active');
                        }, 1000);
                    } else if (foundIconCounter === hiddenIcons.length) {
                        // Just show the message if already found before
                        setTimeout(() => {
                            hiddenMessage.classList.add('active');
                        }, 1000);
                    }
                }
            });
            
            // Restore found state from localStorage if previously found
            const iconId = icon.getAttribute('data-id');
            if (localStorage.getItem(`icon-found-${iconId}`)) {
                icon.classList.add('found');
            }
        });
    }
});

// Animation functions
function animateShading(color, intensity = 0.5) {
    currentShadingColor = color;
    
    const shadingElements = document.querySelectorAll('.shading-element');
    shadingElements.forEach((element, index) => {
        let shadingColor;
        
        if (index === 0) {
            shadingColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.1 * intensity})`;
        } else if (index === 1) {
            // Complementary color
            const compColor = getComplementaryColor(color);
            shadingColor = `rgba(${compColor.r}, ${compColor.g}, ${compColor.b}, ${0.1 * intensity})`;
        } else {
            // Mix of both
            const mixColor = {
                r: Math.floor((color.r + getComplementaryColor(color).r) / 2),
                g: Math.floor((color.g + getComplementaryColor(color).g) / 2),
                b: Math.floor((color.b + getComplementaryColor(color).b) / 2)
            };
            shadingColor = `rgba(${mixColor.r}, ${mixColor.g}, ${mixColor.b}, ${0.08 * intensity})`;
        }
        
        element.style.backgroundColor = shadingColor;
        
        // Create a subtle movement effect
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;
        const randomScale = 0.95 + Math.random() * 0.2;
        
        element.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
        if (index === 2) {
            element.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px)) scale(${randomScale})`;
        }
    });
}

// Helper functions
function getComplementaryColor(color) {
    return {
        r: 255 - color.r,
        g: 255 - color.g,
        b: 255 - color.b
    };
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return { h: h * 360, s, l };
}

function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function showNotification(text, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'discovery-notification';
    notification.textContent = text;
    
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'var(--accent-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Pulse the shading with notification
    const notificationColor = {r: 88, g: 166, b: 255}; // Accent color
    animateShading(notificationColor, 1.2);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        
        // Fade the shading back
        animateShading(currentShadingColor, 0.5);
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

function incrementSecretCounter() {
    foundCounter++;
    const secretCounter = document.querySelector('.counter');
    if (secretCounter) secretCounter.textContent = foundCounter.toString();
    
    // Subtle shading effect for each increment
    const intensity = 0.5 + (foundCounter / totalSecrets) * 0.5;
    animateShading(currentShadingColor, intensity);
    
    // Check if all secrets are found
    if (foundCounter >= totalSecrets) {
        setTimeout(() => {
            showNotification('Congratulations! You found all secrets!', 5000);
            
            // Grand finale effect
            document.body.classList.add('color-activated');
            animateAllShading();
        }, 1000);
    }
}

function animateAllShading() {
    // Create a rainbow cycle effect
    let hue = 0;
    const interval = setInterval(() => {
        hue = (hue + 5) % 360;
        const rgb = hslToRgb(hue, 1, 0.5);
        animateShading(rgb, 1.2);
    }, 100);
    
    // Stop after 5 seconds
    setTimeout(() => {
        clearInterval(interval);
        document.body.classList.remove('color-activated');
        // Reset to default
        animateShading(currentShadingColor, 0.5);
    }, 5000);
}

// Spectrum bar color picker functions
function setupSpectrumBarColorPicker() {
    if (!spectrumBar) return;
    
    // Create a gradient of colors for the spectrum bar
    const colors = [];
    for (let i = 0; i < 360; i += 30) {
        colors.push(`hsl(${i}, 100%, 50%)`);
    }
    
    spectrumBar.style.background = `linear-gradient(to right, ${colors.join(', ')})`;
    
    // Check if the spectrum bar is already wrapped
    if (!spectrumBar.parentNode.classList.contains('spectrum-picker-wrapper')) {
        // Create a wrapper with proper CSS class
        const wrapper = document.createElement('div');
        wrapper.className = 'spectrum-picker-wrapper';
        
        // Add a color picker indicator element with proper CSS class
        const colorPickerIndicator = document.createElement('div');
        colorPickerIndicator.className = 'spectrum-color-indicator';
        
        // Add a visual feedback element that shows the currently selected color
        
        // Make sure spectrumBar's parent has position relative
        spectrumBar.parentNode.insertBefore(wrapper, spectrumBar);
        wrapper.appendChild(spectrumBar);
        wrapper.appendChild(colorPickerIndicator);
        
        // Display initial color
        const initialColor = `hsl(180, 100%, 50%)`;
        
        // Add a mouse down event to start dragging
        let isDragging = false;
        
        spectrumBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            handleColorSelection(e);
            colorPickerIndicator.style.opacity = '1';
            document.body.style.cursor = 'grabbing'; // Change cursor while dragging
        });
        
        // Mouse move event for drag functionality
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                handleColorSelection(e);
            }
        });
        
        // Mouse up event to stop dragging
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = ''; // Reset cursor
            }
        });
        
        // Click event for simple click selection
        spectrumBar.addEventListener('click', (e) => {
            handleColorSelection(e);
            colorPickerIndicator.style.opacity = '1';
        });
        
        // Handle the color selection logic
        function handleColorSelection(e) {
            const rect = spectrumBar.getBoundingClientRect();
            let x = e.clientX - rect.left;
            
            // Constrain x to be within the spectrum bar
            x = Math.max(0, Math.min(x, rect.width));
            
            const percentPosition = x / rect.width;
            const hue = Math.floor(percentPosition * 360);
            const color = `hsl(${hue}, 100%, 50%)`;
            
            selectedColor = color;
            
            // Update the position of the color picker indicator
            colorPickerIndicator.style.left = `${x}px`;
            
            // Change the color of the indicator to match the selected color
            colorPickerIndicator.style.backgroundColor = color;
            colorPickerIndicator.style.borderColor = hue > 180 ? 'white' : 'black';
                        
            // Convert HSL to RGB for shading function
            const rgb = hslToRgb(hue, 1, 0.5);
            
            // Apply a subtle visual effect to show the user their color selection
            spectrumBar.style.boxShadow = `0 0 15px ${color}`;
            
            // Trigger color effect
            triggerColorEffect(rgb);
            
            // Reset the box shadow after a short delay
            setTimeout(() => {
                spectrumBar.style.boxShadow = '';
            }, 1000);
        }
        
        // Initialize with middle color
        setTimeout(() => {
            const middleEvent = new MouseEvent('click', {
                clientX: spectrumBar.getBoundingClientRect().left + spectrumBar.offsetWidth / 2,
                clientY: spectrumBar.getBoundingClientRect().top + spectrumBar.offsetHeight / 2
            });
            spectrumBar.dispatchEvent(middleEvent);
        }, 300);
    }
}

function triggerColorEffect(color) {
    // Animate shading with the selected color
    animateShading(color, 1.2);
    
    // Create a temporary display of the selected color
    createColorPreview(color);
    
    // Check for special color combinations
    checkForSpecialColors(color);
}

function checkForSpecialColors(color) {
    // Define special colors that trigger effects
    const specialColors = [
        { name: 'red', r: 255, g: 0, b: 0, threshold: 50 },
        { name: 'green', r: 0, g: 255, b: 0, threshold: 50 },
        { name: 'blue', r: 0, g: 0, b: 255, threshold: 50 },
        { name: 'yellow', r: 255, g: 255, b: 0, threshold: 50 },
        { name: 'purple', r: 128, g: 0, b: 128, threshold: 50 }
    ];
    
    // Check if the selected color is close to any special color
    for (const specialColor of specialColors) {
        const distance = Math.sqrt(
            Math.pow(color.r - specialColor.r, 2) +
            Math.pow(color.g - specialColor.g, 2) +
            Math.pow(color.b - specialColor.b, 2)
        );
        
        if (distance < specialColor.threshold) {
            triggerSpecialColorEffect(specialColor.name);
            break;
        }
    }
}

function triggerSpecialColorEffect(colorName) {
    console.log(`Triggered special effect for ${colorName}`);
    
    // Create special effects based on color
    let effectColor;
    let effectDuration = 3000;
    
    switch (colorName) {
        case 'red':
            effectColor = {r: 255, g: 0, b: 0};
            document.body.classList.add('pulse-effect');
            setTimeout(() => document.body.classList.remove('pulse-effect'), effectDuration);
            break;
            
        case 'green':
            effectColor = {r: 0, g: 255, b: 0};
            document.querySelectorAll('.grow-element').forEach(el => {
                el.classList.add('grow-animation');
                setTimeout(() => el.classList.remove('grow-animation'), effectDuration);
            });
            break;
            
        case 'blue':
            effectColor = {r: 0, g: 0, b: 255};
            createRippleEffect(effectColor);
            break;
            
        case 'yellow':
            effectColor = {r: 255, g: 255, b: 0};
            createLightBeam(effectColor);
            break;
            
        case 'purple':
            effectColor = {r: 128, g: 0, b: 128};
            // Show hidden elements temporarily
            document.querySelectorAll('.hidden-element').forEach(el => {
                el.classList.add('temporarily-visible');
                setTimeout(() => el.classList.remove('temporarily-visible'), effectDuration);
            });
            break;
    }
    
    // Add to found secrets if this is the first time finding this color
    if (localStorage && !localStorage.getItem(`color-effect-${colorName}`)) {
        incrementSecretCounter();
        localStorage.setItem(`color-effect-${colorName}`, 'true');
        showNotification(`You discovered the ${colorName} color effect!`);
    }
}

function createRippleEffect(color) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.position = 'fixed';
    ripple.style.top = '50%';
    ripple.style.left = '50%';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = `2px solid rgb(${color.r}, ${color.g}, ${color.b})`;
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.opacity = '0.8';
    ripple.style.transition = 'transform 2s, opacity 2s';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(20)';
        ripple.style.opacity = '0';
        
        setTimeout(() => {
            ripple.remove();
        }, 2000);
    }, 10);
}

function createLightBeam(color) {
    const beam = document.createElement('div');
    beam.className = 'light-beam';
    beam.style.position = 'fixed';
    beam.style.top = '0';
    beam.style.left = '50%';
    beam.style.transform = 'translateX(-50%)';
    beam.style.width = '5px';
    beam.style.height = '0';
    beam.style.opacity = '0';
    beam.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    beam.style.transition = 'height 1s, opacity 1s';
    beam.style.pointerEvents = 'none';
    beam.style.zIndex = '9999';
    
    document.body.appendChild(beam);
    
    setTimeout(() => {
        beam.style.height = '100vh';
        beam.style.opacity = '0.3';
        
        setTimeout(() => {
            beam.style.opacity = '0';
            setTimeout(() => {
                beam.remove();
            }, 1000);
        }, 1000);
    }, 10);
}

// Add shiftHue function
function shiftHue(rgbColor, degrees) {
    // Convert RGB to HSL, shift hue, convert back to RGB
    const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
    hslColor.h = (hslColor.h + degrees) % 360;
    if (hslColor.h < 0) hslColor.h += 360;
    
    return hslToRgb(hslColor.h, hslColor.s, hslColor.l);
}

// Add showPortalHint function
function showPortalHint(text) {
    const hintElement = document.querySelector('.hint span');
    if (hintElement) {
        hintElement.textContent = text;
        hintElement.style.animation = 'none';
        
        // Trigger reflow
        void hintElement.offsetWidth;
        
        hintElement.style.animation = 'fadeIn 0.5s ease forwards';
    }
}

// Play found animation for icons
function playFoundAnimation(element) {
    // Create particles
    for (let i = 0; i < 10; i++) {
        createParticle(element);
    }
    
    // Extract color from the element or its parent
    let bgColor = window.getComputedStyle(element).backgroundColor;
    if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        bgColor = window.getComputedStyle(element.parentElement).backgroundColor;
    }
    
    // Only animate the icon locally without affecting background
    element.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Create particle function
function createParticle(element) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Position
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const speed = 2 + Math.random() * 2;
    
    // Style
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${4 + Math.random() * 6}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = 'var(--accent-color)';
    particle.style.borderRadius = '50%';
    particle.style.opacity = '0.8';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);
    
    // Animate
    const animation = particle.animate([
        {
            transform: 'translate(0, 0) scale(1)',
            opacity: 0.8
        },
        {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
            opacity: 0
        }
    ], {
        duration: speed * 500,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
    });
    
    animation.onfinish = () => {
        particle.remove();
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the hex components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return the RGB object
    return { r, g, b };
} 