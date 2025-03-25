import React from 'react';
import ColorToken from '@/components/ColorToken';
import CodeBlock from '@/components/CodeBlock';
import {
  brandBlue,
  accentTeal,
  neutralDark,
  surface,
  error,
  success,
  brand300,
  brand400,
  brand500,
  brand600,
  brand700,
  accent300,
  accent400,
  accent500,
  accent600,
  accent700
} from '@/styles/colors';

const DesignTokensSection = () => {
  return (
    <section id="design-tokens" className="mb-16">
      {/* ... existing section structure ... */}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        <ColorToken name="Primary Blue" value={brandBlue} />
        <ColorToken name="Secondary Teal" value={accentTeal} />
        <ColorToken name="Neutral Dark" value={neutralDark} />
        <ColorToken name="Surface" value={surface} />
        <ColorToken name="Error" value={error} />
        <ColorToken name="Success" value={success} />
      </div>

      {/* Primary Shades grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        <ColorToken name="Brand 300" value={brand300} />
        <ColorToken name="Brand 400" value={brand400} />
        <ColorToken name="Brand 500" value={brand500} />
        <ColorToken name="Brand 600" value={brand600} />
        <ColorToken name="Brand 700" value={brand700} />
      </div>

      {/* Accent Shades grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        <ColorToken name="Accent 300" value={accent300} textColor="black" />
        <ColorToken name="Accent 400" value={accent400} textColor="black" />
        <ColorToken name="Accent 500" value={accent500} />
        <ColorToken name="Accent 600" value={accent600} />
        <ColorToken name="Accent 700" value={accent700} />
      </div>

      <CodeBlock 
        filename="colors.ts"
        code={`${Object.entries({
          brandBlue,
          accentTeal,
          neutralDark,
          surface,
          brand300,
          brand400,
          brand500,
          brand600,
          brand700,
          accent300,
          accent400,
          accent500,
          accent600,
          accent700,
          error,
          success
        }).map(([key, value]) => `export const ${key} = "${value}";`).join('\n')}`}
        language="typescript"
      />
    </section>
  );
};

export default DesignTokensSection;