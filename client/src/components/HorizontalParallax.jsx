import React from 'react';

const HorizontalParallax = ({ children }) => {
  return (
    <section className="relative w-full bg-bg py-24 border-y border-border/30 overflow-hidden">
      
      {/* Background glow that stays fixed */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-30 z-0">
        <div className="w-[80vw] h-[50vh] bg-primary/10 blur-[150px] rounded-[100%]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-12 relative z-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">How Hermes Works</h2>
        <p className="text-muted">Swipe or scroll to explore the pipeline.</p>
      </div>

      {/* The scrolling track */}
      <div 
        className="flex overflow-x-auto gap-6 px-4 md:px-[10vw] pb-12 w-full relative z-10"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', // Hide scrollbar Firefox
          msOverflowStyle: 'none', // Hide scrollbar IE/Edge
        }}
      >
        {/* Hide scrollbar Webkit */}
        <style dangerouslySetInnerHTML={{__html: `
          .flex.overflow-x-auto::-webkit-scrollbar { display: none; }
        `}} />

        {React.Children.map(children, child => (
          <div 
            className="shrink-0 w-[85vw] max-w-[600px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalParallax;
