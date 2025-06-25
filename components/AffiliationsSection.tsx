import React from 'react';

// --- Helper Data & SVG Icon ---
// In a real application, you might fetch this data from an API.
// Placeholder images are used here. Replace `src` with your actual logo paths.
const affiliations = [
  { name: 'ASTA - American Society of Travel Advisors', src: 'https://logodix.com/logo/2033692.png', alt: 'ASTA Logo' },
  { name: 'Africa Tour Operators', src: 'https://www.africatouroperators.org/wp-content/uploads/2019/07/ATO-Logo-Colour-e1562082728881.png', alt: 'Africa Tour Operators Logo' },
  { name: 'Travelife Partner', src: 'https://sustainability.travel/wp-content/uploads/2020/09/travelife-logo.png', alt: 'Travelife Partner Logo' },
  { name: 'TripAdvisor', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Tripadvisor_logo.svg/2560px-Tripadvisor_logo.svg.png', alt: 'TripAdvisor Logo' },
  { name: 'ATA - Africa Travel Association', src: 'https://pbs.twimg.com/profile_images/563364969/ata-logo-sample_400x400.jpg', alt: 'ATA Logo' },
  { name: 'SKAL International', src: 'https://skaldfw.org/wp-content/uploads/2017/09/skal-international-logo-e1505315802188.png', alt: 'SKAL International Logo' },
  { name: 'PCMA', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/PCMA_logo.svg/1280px-PCMA_logo.svg.png', alt: 'PCMA Logo' },
  { name: 'Cameroon Ministry of Tourism', src: 'https://mintour.gov.cm/wp-content/uploads/2022/12/logo-mintoul-2-1.png', alt: 'Cameroon Ministry of Tourism Logo' },
];

// A simple Handshake SVG icon for a decorative touch.
const HandshakeIcon = () => (
    <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 17a2 2 0 0 1-2 2H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M13 17a2 2 0 0 1 2 2h4.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M15 12.5c-1.5-1-3-2-4-2s-2.5-.5-4-.5-2.5.5-4 .5-2.5 1-4 1.5S2 16 2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2c0-1-1-1.5-2-2s-2-1.5-3-2-2-1-3-1.5-2-.5-3-.5-.5 0-1 .5"/>
    </svg>
);


// --- Single Logo Card Component ---
// Each logo is wrapped in a "card" for a more structured and modern look.
const AffiliationCard = ({ src, alt }) => (
  <div className="group bg-gray-50 rounded-xl p-6 flex justify-center items-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:bg-white">
    <img
      src={src}
      alt={alt}
      className="max-h-16 w-auto object-contain transition-all duration-300 ease-in-out filter grayscale group-hover:grayscale-0"
      // Fallback for broken image links
      onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/200x100/f0f0f0/999?text=Logo+Error'; 
      }}
    />
  </div>
);


// --- Main Affiliations Section Component (Enhanced) ---
// This is the primary component to be exported. It's designed to stand out on the page.
const AffiliationsSection = () => {
  return (
    // Assuming the parent body has a light background (e.g., bg-gray-100)
    <section className="bg-white w-full py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Section Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3">
             <HandshakeIcon />
             <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl uppercase">
                Our Affiliations
             </h2>
          </div>
           {/* Decorative Line */}
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full"></div>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            We are proud to be partnered with leading organizations in the travel and tourism industry.
          </p>
        </div>

        {/* Logo Cards Grid */}
        <div className="mt-16">
          {/* Responsive grid with increased gap for better visual separation */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {affiliations.map((logo) => (
              <AffiliationCard key={logo.name} src={logo.src} alt={logo.name} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// For this preview, we export the enhanced component as the default.
export default AffiliationsSection;
