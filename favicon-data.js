// Create a simple favicon using canvas
const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');

// Create blue background
const gradient = ctx.createLinearGradient(0, 0, 32, 32);
gradient.addColorStop(0, '#1e40af');
gradient.addColorStop(1, '#3b82f6');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 32, 32);

// Draw Bluetooth symbol
ctx.save();
ctx.translate(16, 16);
ctx.rotate(-Math.PI / 4);
ctx.fillStyle = 'white';
ctx.globalAlpha = 0.95;

// Triangle shape
ctx.beginPath();
ctx.moveTo(-6, -8);
ctx.lineTo(6, 0);
ctx.lineTo(0, 0);
ctx.lineTo(6, 8);
ctx.lineTo(-6, 0);
ctx.lineTo(0, 0);
ctx.closePath();
ctx.fill();

// Vertical line
ctx.fillRect(-1.5, -8, 3, 16);

ctx.restore();

// Draw decorative circle
ctx.strokeStyle = 'white';
ctx.globalAlpha = 0.3;
ctx.lineWidth = 0.5;
ctx.beginPath();
ctx.arc(16, 16, 12, 0, 2 * Math.PI);
ctx.stroke();

// Convert to base64
console.log(canvas.toDataURL());