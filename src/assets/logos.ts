/**
 * School and Exam Board Logo generator/provider
 * Generates high-resolution base64 PNG images for both Web preview and DOCX embedding
 */

// Function to generate high-resolution PNG data URLs via HTML Canvas
export function createIcmLogoPng(width = 400, height = 120): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Transparent background
  ctx.clearRect(0, 0, width, height);

  // Draw ICM Star Emblem (Islamic 8-point geometric star)
  const cx = 55;
  const cy = 60;
  const outerR = 42;
  const innerR = 26;

  // Star points
  ctx.save();
  ctx.translate(cx, cy);

  // Gradient for star
  const starGrad = ctx.createLinearGradient(-outerR, -outerR, outerR, outerR);
  starGrad.addColorStop(0, '#105B8C'); // Deep blue
  starGrad.addColorStop(0.5, '#208B82'); // Teal
  starGrad.addColorStop(1, '#8AB833'); // Vibrant Green

  // Outer 8-pointed star
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = starGrad;
  ctx.fill();

  // Inner decorative ring
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Center motif
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fillStyle = '#208B82';
  ctx.fill();

  ctx.restore();

  // Text: "ICM"
  ctx.fillStyle = '#10558A';
  ctx.font = 'bold 54px Arial, Helvetica, sans-serif';
  ctx.fillText('ICM', 115, 78);

  // Vertical separator line
  ctx.strokeStyle = '#D0D5DD';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(242, 28);
  ctx.lineTo(242, 92);
  ctx.stroke();

  // Subtext: "INSAN", "CENDEKIA", "MADANI"
  ctx.fillStyle = '#1D2939';
  ctx.font = 'bold 15px Arial, Helvetica, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('INSAN', 256, 46);
  ctx.fillText('CENDEKIA', 256, 64);
  ctx.fillText('MADANI', 256, 82);

  return canvas.toDataURL('image/png');
}

export function createCambridgeLogoPng(width = 460, height = 120): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, width, height);

  // Shield Emblem
  const sx = 35;
  const sy = 28;
  const sw = 48;
  const sh = 62;

  // Red Shield background
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + sw, sy);
  ctx.lineTo(sx + sw, sy + sh * 0.65);
  ctx.bezierCurveTo(sx + sw, sy + sh, sx + sw * 0.5, sy + sh + 6, sx + sw * 0.5, sy + sh + 8);
  ctx.bezierCurveTo(sx + sw * 0.5, sy + sh + 6, sx, sy + sh, sx, sy + sh * 0.65);
  ctx.closePath();
  ctx.fillStyle = '#A31C24'; // Cambridge Crimson
  ctx.fill();

  // White heraldic cross on shield
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(sx + sw * 0.4, sy, sw * 0.2, sh * 0.8);
  ctx.fillRect(sx, sy + sh * 0.35, sw, sh * 0.18);

  // Lions / Fleur-de-lis dots in the 4 quadrants
  ctx.fillStyle = '#E5A93C'; // Gold
  ctx.beginPath();
  ctx.arc(sx + 12, sy + 14, 3.5, 0, Math.PI * 2);
  ctx.arc(sx + sw - 12, sy + 14, 3.5, 0, Math.PI * 2);
  ctx.arc(sx + 12, sy + sh - 18, 3.5, 0, Math.PI * 2);
  ctx.arc(sx + sw - 12, sy + sh - 18, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Text: "Cambridge Assessment"
  ctx.fillStyle = '#212B36';
  ctx.font = 'bold 22px Arial, Helvetica, sans-serif';
  ctx.fillText('Cambridge Assessment', 100, 52);

  // Text: "International Education"
  ctx.fillStyle = '#374151';
  ctx.font = 'normal 19px Arial, Helvetica, sans-serif';
  ctx.fillText('International Education', 100, 78);

  return canvas.toDataURL('image/png');
}
