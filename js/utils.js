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
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
};
