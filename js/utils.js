export const lerp = (a, b, n) => (1 - n) * a + n * b;

export const mapRange = (value, low1, high1, low2, high2) => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

export const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

export const initTypewriter = (elementId, text, speed = 50) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const chars = Array.from(text);
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < chars.length) {
            element.textContent += chars[i];
            i++;
            setTimeout(type, speed);
        }
    }

    type();
};
