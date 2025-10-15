#!/usr/bin/env node

/**
 * Accessibility Verification Script
 * Verifies color contrast using both WCAG 2.1 and APCA algorithms
 */

// ============================================
// Color Definitions from Component Styles
// ============================================

const colors = {
  text: {
    black: '#292929', // hsl(0, 0%, 16%) - $button-text-dark
  },
  backgrounds: {
    idle: {
      blue: '#6EB8FF',    // $primary-blue (idle gradient start)
      orange: '#FF9E78',  // $primary-orange (idle gradient end)
    },
    hover: {
      blue: '#7FC5FF',    // $button-inner-hover-blue
      orange: '#FFAB8C',  // $button-inner-hover-orange
    },
  },
};

// ============================================
// WCAG 2.1 Contrast Algorithm
// Based on https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
// ============================================

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Calculate relative luminance per WCAG formula
 */
function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  // Convert to sRGB
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  // Apply gamma correction
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio
 */
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Evaluate WCAG compliance level
 */
function evaluateWCAG(ratio) {
  return {
    ratio: ratio.toFixed(2),
    AA_normal: ratio >= 4.5,      // Normal text (< 18pt or < 14pt bold)
    AA_large: ratio >= 3.0,        // Large text (>= 18pt or >= 14pt bold)
    AAA_normal: ratio >= 7.0,      // Enhanced normal text
    AAA_large: ratio >= 4.5,       // Enhanced large text
  };
}

// ============================================
// APCA (Accessible Perceptual Contrast Algorithm)
// Based on APCA 0.0.98G specification
// Simplified implementation of the core algorithm
// ============================================

/**
 * sRGB to Y (luminance) conversion for APCA
 */
function sRGBtoY(rgb) {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  // Linearization
  const r = rsRGB <= 0.04045 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.04045 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.04045 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate Y (luminance)
  return 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
}

/**
 * Calculate APCA contrast (Lc value)
 */
function getAPCAContrast(textHex, bgHex) {
  const txtRgb = hexToRgb(textHex);
  const bgRgb = hexToRgb(bgHex);

  if (!txtRgb || !bgRgb) return 0;

  // Constants
  const blkThrs = 0.022;
  const blkClmp = 1.414;
  const scaleBoW = 1.14;
  const scaleWoB = 1.14;
  const loConThresh = 0.1;
  const loConFactor = 27.7;
  const loConOffset = 0.027;
  const loClip = 0.001;

  // Calculate Y values
  let Ybg = sRGBtoY(bgRgb);
  let Ytxt = sRGBtoY(txtRgb);

  // Soft clamp black levels
  Ybg = Ybg > blkThrs ? Ybg : Ybg + Math.pow(blkThrs - Ybg, blkClmp);
  Ytxt = Ytxt > blkThrs ? Ytxt : Ytxt + Math.pow(blkThrs - Ytxt, blkClmp);

  // Polarity and contrast calculation
  let SAPC = 0;

  if (Math.abs(Ybg - Ytxt) < loClip) {
    return 0; // Colors too similar
  }

  if (Ybg > Ytxt) {
    // Dark text on light background (standard polarity)
    SAPC = (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * scaleBoW;
  } else {
    // Light text on dark background (reverse polarity)
    SAPC = (Math.pow(Ybg, 0.65) - Math.pow(Ytxt, 0.62)) * scaleWoB;
  }

  // Low contrast smooth rollout
  if (Math.abs(SAPC) < loConThresh) {
    return 0;
  }

  // Calculate Lc (lightness contrast)
  const Lc = SAPC > 0
    ? SAPC - loConOffset
    : SAPC + loConOffset;

  return Lc * 100;
}

/**
 * Evaluate APCA compliance
 * Based on APCA readability criterion
 */
function evaluateAPCA(lc) {
  const absLc = Math.abs(lc);
  return {
    lc: lc.toFixed(1),
    absLc: absLc.toFixed(1),
    // APCA Bronze level requirements (minimum for body text)
    bodyText: absLc >= 75,       // Body text (16px+)
    largeText: absLc >= 60,      // Large text (24px+)
    UIComponents: absLc >= 45,   // UI components, placeholders
    nonText: absLc >= 30,        // Non-text (borders, disabled)
  };
}

// ============================================
// Report Generation
// ============================================

function generateReport() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║           AI BUTTON ACCESSIBILITY VERIFICATION REPORT          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log('📋 Testing Configuration:');
  console.log(`   Text Color: ${colors.text.black} (Dark Gray / Black)`);
  console.log('   Background: Gradient from Blue to Orange\n');

  const tests = [
    {
      name: 'Idle State - Blue End',
      textColor: colors.text.black,
      bgColor: colors.backgrounds.idle.blue,
      state: 'idle',
    },
    {
      name: 'Idle State - Orange End',
      textColor: colors.text.black,
      bgColor: colors.backgrounds.idle.orange,
      state: 'idle',
    },
    {
      name: 'Hover State - Blue End',
      textColor: colors.text.black,
      bgColor: colors.backgrounds.hover.blue,
      state: 'hover',
    },
    {
      name: 'Hover State - Orange End',
      textColor: colors.text.black,
      bgColor: colors.backgrounds.hover.orange,
      state: 'hover',
    },
  ];

  tests.forEach((test, index) => {
    console.log(`\n${'='.repeat(68)}`);
    console.log(`Test ${index + 1}: ${test.name}`);
    console.log(`${'='.repeat(68)}`);
    console.log(`Text:       ${test.textColor}`);
    console.log(`Background: ${test.bgColor}`);

    // WCAG 2.1 Analysis
    const wcagRatio = getContrastRatio(test.textColor, test.bgColor);
    const wcag = evaluateWCAG(wcagRatio);

    console.log('\n📊 WCAG 2.1 Contrast Ratio:');
    console.log(`   Ratio: ${wcag.ratio}:1`);
    console.log('\n   Compliance:');
    console.log(`   ✓ AA Normal Text (4.5:1):    ${wcag.AA_normal ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✓ AA Large Text (3.0:1):     ${wcag.AA_large ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✓ AAA Normal Text (7.0:1):   ${wcag.AAA_normal ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✓ AAA Large Text (4.5:1):    ${wcag.AAA_large ? '✅ PASS' : '❌ FAIL'}`);

    // APCA Analysis
    const apcaLc = getAPCAContrast(test.textColor, test.bgColor);
    const apca = evaluateAPCA(apcaLc);

    console.log('\n🎯 APCA (Accessible Perceptual Contrast Algorithm):');
    console.log(`   Lc Value: ${apca.lc}`);
    console.log(`   Absolute Lc: ${apca.absLc}`);
    console.log('\n   Readability:');
    console.log(`   ✓ Body Text (75+):          ${apca.bodyText ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✓ Large Text (60+):         ${apca.largeText ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✓ UI Components (45+):      ${apca.UIComponents ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   ✓ Non-Text (30+):           ${apca.nonText ? '✅ PASS' : '❌ FAIL'}`);
  });

  console.log('\n\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                         FINAL SUMMARY                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Calculate overall pass/fail
  const allTests = tests.map(test => {
    const wcagRatio = getContrastRatio(test.textColor, test.bgColor);
    const wcag = evaluateWCAG(wcagRatio);
    const apcaLc = getAPCAContrast(test.textColor, test.bgColor);
    const apca = evaluateAPCA(apcaLc);

    return {
      name: test.name,
      wcagAA: wcag.AA_normal,
      wcagAAA: wcag.AAA_normal,
      apcaBody: apca.bodyText,
      ratio: wcag.ratio,
      lc: apca.absLc,
    };
  });

  const allWCAGAA = allTests.every(t => t.wcagAA);
  const allWCAGAAA = allTests.every(t => t.wcagAAA);
  const allAPCABody = allTests.every(t => t.apcaBody);

  console.log('📈 Overall Results:\n');
  console.log(`   WCAG AA Compliance (4.5:1):   ${allWCAGAA ? '✅ ALL TESTS PASS' : '⚠️  SOME TESTS FAIL'}`);
  console.log(`   WCAG AAA Compliance (7.0:1):  ${allWCAGAAA ? '✅ ALL TESTS PASS' : '⚠️  SOME TESTS FAIL'}`);
  console.log(`   APCA Body Text (75+):         ${allAPCABody ? '✅ ALL TESTS PASS' : '⚠️  SOME TESTS FAIL'}`);

  console.log('\n📊 Contrast Ratios by State:\n');
  allTests.forEach(test => {
    console.log(`   ${test.name}:`);
    console.log(`      WCAG: ${test.ratio}:1 | APCA: Lc ${test.lc}`);
  });

  console.log('\n');
  console.log('═'.repeat(68));

  if (allWCAGAA) {
    console.log('✅ SUCCESS: All color combinations meet WCAG AA standards!');
  } else {
    console.log('⚠️  WARNING: Some combinations do not meet WCAG AA standards.');
  }

  console.log('═'.repeat(68));
  console.log('\n📚 References:');
  console.log('   • WCAG 2.1: https://www.w3.org/TR/WCAG21/');
  console.log('   • APCA: https://github.com/Myndex/SAPC-APCA');
  console.log('   • WCAG 3.0 Draft: https://www.w3.org/TR/wcag-3.0/\n');
}

// ============================================
// Run the report
// ============================================

generateReport();
