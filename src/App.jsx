import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowFinished, setSlideshowFinished] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const memories = [
    { type: 'image', src: '/1.jpeg' },
    { type: 'image', src: '/2.jpeg' },
    { type: 'video', src: '/3.mp4' },
    { type: 'image', src: '/4.jpeg' },
    { type: 'image', src: '/5.jpeg' },
    { type: 'image', src: '/6.jpeg' },
    { type: 'image', src: '/7.jpeg' },
    { type: 'image', src: '/8.jpeg' },
    { type: 'video', src: '/9.mp4' },
    { type: 'image', src: '/10.jpeg' },
    { type: 'image', src: '/11.jpeg' },
    { type: 'image', src: '/12.jpeg' },
    { type: 'image', src: '/3d5727c6-27fa-4ba6-8249-b076b2cb56ac.jpeg' },
    { type: 'image', src: '/6c32d76a-6a08-4ca4-ad9e-733296a76c0a.jpeg' },
  ];

  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const letterRef = useRef(null);
  const envelopeRef = useRef(null);
  const audioRef = useRef(null);

  // SLIDESHOW LOGIC
  useEffect(() => {
    if (!showSlideshow) return;

    let interval;
    const currentMemory = memories[currentSlide];

    if (currentMemory.type === 'image') {
        interval = setInterval(() => {
            if (currentSlide === memories.length - 1) {
                finishSlideshow();
            } else {
                setCurrentSlide((prev) => prev + 1);
            }
        }, 4000); 
    }

    return () => clearInterval(interval);
  }, [showSlideshow, currentSlide]);

  const handleVideoEnded = () => {
      if (currentSlide === memories.length - 1) {
          finishSlideshow();
      } else {
          setCurrentSlide((prev) => prev + 1);
      }
  };

  const finishSlideshow = () => {
      setShowSlideshow(false);
      setSlideshowFinished(true);
      // Smooth scroll to letter area
      setTimeout(() => {
          // Scroll slightly past the hero to reveal the letter section
          const letterSection = document.querySelector('.letter-section');
          if (letterSection) {
            letterSection.scrollIntoView({ behavior: 'smooth' });
          } else {
             // Fallback if ref isn't ready immediately
             window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
      }, 500);
  };

  // TOGGLE MUSIC
  const toggleMusic = () => {
    if (isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // INTRO ANIMATION (Envelope Opening)
  const openEnvelope = () => {
    const tl = gsap.timeline({
      onComplete: () => setIsOpened(true)
    });

    // Play Music on first interaction
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(e => console.log("Audio play failed", e));
    }

    tl.to(".heart-seal", { scale: 1.5, opacity: 0, duration: 0.5, ease: "power2.in" })
      .to(".envelope-flap", { rotateX: 180, duration: 0.8, ease: "power2.inOut" })
      .to(".envelope-container", { y: 1000, opacity: 0, duration: 1, ease: "power3.in" })
      .to(envelopeRef.current, { display: "none" });
  };

  // LETTER REVEAL ANIMATION
  const revealLetter = () => {
    setIsLetterOpen(true);
    setTimeout(() => {
      gsap.fromTo(".real-letter-content", 
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out", stagger: 0.1 }
      );
    }, 100);
  };

  // KINTSUGI HEART REPAIR LOGIC
  const repairHeart = () => {
      const tl = gsap.timeline({
          onComplete: () => {
              setTimeout(() => setIsFinished(true), 1000);
          }
      });

      tl.to(".heart-piece-left", { x: 0, y: 0, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" })
      .to(".heart-piece-right", { x: 0, y: 0, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }, "<")
      .to(".kintsugi-glow", { opacity: 1, scale: 1.2, duration: 0.5, ease: "power2.out" })
      .to(".kintsugi-glow", { opacity: 0, duration: 0.5 })
      .to(".whole-heart", { opacity: 1, scale: 1.1, duration: 0.5 }, "-=0.5")
      .to(".whole-heart", { scale: 1, duration: 0.5, ease: "back.out(1.7)" });
  };
  
  // FINALE EFFECT
  useEffect(() => {
    if (isFinished) {
        gsap.set("body", { overflow: "hidden" });
        const tl = gsap.timeline();
        tl.to(".finale-overlay", { opacity: 1, duration: 1, pointerEvents: "auto" })
          .to(".finale-text", { opacity: 1, scale: 1, duration: 2, ease: "power3.out" }, "-=0.5")
          .fromTo(".firework", 
            { y: "100%", opacity: 0 },
            { 
                y: "random(20%, 50%)", 
                x: "random(10%, 90%)",
                opacity: 1, 
                duration: 1.5, 
                stagger: { amount: 2, from: "random", repeat: -1, yoyo: true },
                ease: "power1.out" 
            }, 
            "-=1.5"
          );
    }
  }, [isFinished]);

  useEffect(() => {
    if (!isOpened) return;
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".hero-text-1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" })
      .fromTo(".hero-text-2", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.3)" }, "-=1")
      .fromTo(".hero-date", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");

      gsap.to(".floating-particle", {
        y: -100, x: "random(-50, 50)", duration: "random(3, 6)", repeat: -1, yoyo: true, ease: "sine.inOut",
        stagger: { amount: 2, from: "random" }
      });
    }, mainRef);
    return () => ctx.revert();
  }, [isOpened]);

  return (
    <div ref={mainRef} className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient text-soft-white font-serif selection:bg-romantic-gold selection:text-romantic-dark relative overflow-x-hidden snap-y snap-mandatory h-screen overflow-y-scroll">
      
      <div className="fixed inset-0 bg-grain z-0"></div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
          <div key={i} className="floating-particle absolute text-romantic-gold/20 blur-[1px]" 
              style={{
                fontSize: Math.random() * 20 + 10 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
          >
              {['❤️', '✨', '💖', '⭐'][Math.floor(Math.random() * 4)]}
          </div>
          ))}
      </div>
      
      <div className={`finale-overlay fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${isFinished ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {[...Array(40)].map((_, i) => (
                <div key={i} className="firework absolute w-3 h-3 rounded-full blur-sm" 
                    style={{
                        backgroundColor: ['#ffd700', '#ff1493', '#00ffff', '#ffffff'][Math.floor(Math.random() * 4)],
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%'
                    }}
                />
            ))}
            <h1 className="finale-text text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-romantic-gold via-pink-500 to-romantic-gold opacity-0 transform scale-50 text-center p-4 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                I Love You<br/>and Im Sorry My Palangga
            </h1>
             <p className="finale-text opacity-0 text-gray-400 mt-12 text-sm uppercase tracking-[0.5em]">Happy Anniversary 2026</p>
      </div>

      {showSlideshow && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-fadeIn">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                {memories[currentSlide].type === 'image' ? (
                    <img key={currentSlide} src={memories[currentSlide].src} alt="Memory" className="w-full h-full object-contain animate-fadeIn" />
                ) : (
                    <video key={currentSlide} src={memories[currentSlide].src} className="w-full h-full object-contain" autoPlay muted controls onEnded={handleVideoEnded} />
                )}
                {/* Overlay Controls */}
                <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-4 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex gap-2">
                        {memories.map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-romantic-gold w-4' : 'bg-gray-500'}`} />
                        ))}
                    </div>
                    {/* Button removed for auto-finish flow */}
                </div>
            </div>
        </div>
      )}

      <button onClick={toggleMusic} className="fixed top-6 right-6 z-50 p-3 bg-black/30 backdrop-blur-md rounded-full text-romantic-gold hover:bg-romantic-gold hover:text-romantic-dark transition-all duration-300 border border-romantic-gold/30">
        {isPlaying ? (
            <svg className="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
        ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
        )}
      </button>

      <audio ref={audioRef} src="/palangga.mp3" loop />

      {!isOpened && (
        <div ref={envelopeRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md px-6">
          <div className="text-center mb-12 max-w-sm">
            <p className="text-romantic-gold text-lg md:text-xl font-light italic leading-relaxed animate-pulse">
              "I know we're not okay but please smile before you click the envelope thanks &lt;3"
            </p>
            <div className="mt-4 w-16 h-0.5 bg-romantic-gold/30 mx-auto"></div>
          </div>
          <div className="envelope-container relative w-80 h-60 bg-soft-white shadow-2xl flex items-center justify-center rounded-lg cursor-pointer group" onClick={openEnvelope}>
            <div className="envelope-flap absolute top-0 left-0 w-full h-1/2 bg-gray-200 origin-top z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-gray-100 rounded-b-lg z-10"></div>
            <div className="heart-seal absolute z-30 w-16 h-16 bg-red-800 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-red-900">
              <svg className="w-8 h-8 text-red-200 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <p className="absolute -bottom-12 text-romantic-gold tracking-widest text-sm animate-pulse">Tap the seal to open</p>
          </div>
        </div>
      )}

      <div className="fixed right-0 top-0 h-full w-1 z-40 bg-gray-800">
        <div className="progress-bar w-full bg-romantic-gold h-0"></div>
      </div>

      <section ref={heroRef} className="min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden z-10 snap-center">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?stars,night')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <h2 className="hero-text-1 text-xl md:text-2xl tracking-[0.2em] uppercase text-gray-400 mb-4 font-light">3 Beautiful Years</h2>
        <h1 className="hero-text-2 text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-romantic-gold via-yellow-200 to-romantic-gold mb-8 drop-shadow-2xl py-2">Happy Anniversary mylove Sanel</h1>
        <p className="hero-date text-lg md:text-xl text-romantic-gold/80 tracking-widest font-light border-t border-b border-romantic-gold/30 py-2 px-8 mb-12">02.04.2023</p>
        {!slideshowFinished ? (
            <button onClick={() => setShowSlideshow(true)} className="scroll-indicator absolute bottom-20 px-8 py-4 bg-romantic-gold text-romantic-dark font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)] animate-bounce">Watch Our Story →</button>
        ) : (
            <div className="scroll-indicator absolute bottom-10 flex flex-col items-center gap-4 text-sm text-gray-500 animate-bounce">
              <span className="tracking-widest uppercase text-xs">Scroll for Letter</span>
              <svg className="w-6 h-6 text-romantic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
        )}
      </section>

      {slideshowFinished && (
        <>
            <section ref={letterRef} className="letter-section min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-gradient-to-b from-romantic-dark via-romantic-purple/20 to-romantic-dark relative z-10 snap-center">
            {!isLetterOpen ? (
                <div className="text-center w-full max-w-md mx-auto">
                <button onClick={revealLetter} className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-romantic-dark transition-all duration-300 bg-romantic-gold font-serif rounded-full focus:outline-none hover:scale-105 shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.6)]">
                    <span className="mr-3 text-2xl animate-pulse">💌</span> 
                    <span className="tracking-widest uppercase">Open My Heart</span>
                    <div className="absolute -inset-1 rounded-full border border-romantic-gold opacity-30 animate-ping"></div>
                </button>
                <p className="mt-8 text-gray-500 text-xs tracking-[0.3em] uppercase opacity-70">A message for you</p>
                </div>
            ) : (
                <div className="w-full max-w-2xl text-center space-y-8 p-8 md:p-12 border border-romantic-gold/30 rounded-2xl bg-black/40 backdrop-blur-md shadow-2xl relative overflow-hidden mx-4">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-romantic-gold/40 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-romantic-gold/40 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-romantic-gold/40 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-romantic-gold/40 rounded-br-2xl"></div>
                <h3 className="real-letter-content text-3xl md:text-5xl text-romantic-gold mb-12 font-serif italic drop-shadow-md">My Dearest Jesanel,</h3>
                <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-200 font-light text-justify md:text-center">
                    <p className="real-letter-content">Happy 3rd Anniversary.</p>
                    <p className="real-letter-content">Writing this, I realize how much we've been through together. Three years is a long time, but with you, it feels like it went by in a heartbeat. You have been my rock, my joy, and my greatest blessing.</p>
                    <p className="real-letter-content">I know I haven't always been perfect. I’ve made mistakes, and I’ve hurt you in ways I never intended. For every moment I caused you pain, for every tear you shed because of my actions, and for the times I fell short of being the man you deserve—I am deeply, truly sorry.</p>
                    <p className="real-letter-content">Please forgive me for my shortcomings. I am constantly learning, growing, and trying to be better for you. You deserve the world, and I promise to spend every day trying to give it to you.</p>
                    <p className="real-letter-content">I love you more than words can say. Thank you for staying by my side.</p>
                </div>
                <p className="real-letter-content text-romantic-gold text-2xl pt-12 font-serif italic">Always yours,<br/>Elijah</p>
                </div>
            )}
            </section>

            {isLetterOpen && (
            <section className="min-h-screen flex flex-col items-center justify-center relative z-10 snap-center pb-20 overflow-hidden">
                <div className="text-center mb-16 opacity-80 z-20">
                    <h4 className="text-romantic-gold text-xl font-serif italic mb-2">Mend my heart, Palangga</h4>
                    <div className="w-12 h-0.5 bg-romantic-gold/50 mx-auto"></div>
                    <p className="mt-4 text-xs tracking-widest uppercase text-gray-500">Tap to Repair</p>
                </div>
                <div className="relative w-64 h-64 cursor-pointer group" onClick={repairHeart}>
                    <div className="whole-heart absolute inset-0 text-red-600 drop-shadow-[0_0_50px_rgba(255,0,0,0.5)] opacity-0 scale-50 transition-all duration-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
                    <div className="heart-piece-left absolute w-32 h-64 left-0 top-0 text-red-800 transform -translate-x-12 -translate-y-4 -rotate-12 transition-colors duration-1000">
                        <svg viewBox="0 0 12 24" fill="currentColor" className="w-full h-full overflow-visible"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C12 5.09 12 21.35 12 21.35z"/></svg>
                    </div>
                    <div className="heart-piece-right absolute w-32 h-64 right-0 top-0 text-red-800 transform translate-x-12 -translate-y-8 rotate-12 transition-colors duration-1000">
                        <svg viewBox="0 0 12 24" fill="currentColor" className="w-full h-full overflow-visible" style={{transform: "scaleX(-1)"}}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C12 5.09 12 21.35 12 21.35z"/></svg>
                    </div>
                    <div className="kintsugi-glow absolute inset-0 pointer-events-none opacity-0 flex items-center justify-center">
                        <div className="w-1 h-40 bg-romantic-gold blur-[2px] rotate-12"></div>
                        <div className="w-1 h-40 bg-romantic-gold blur-[2px] -rotate-12 absolute"></div>
                    </div>
                    <div className="mt-32 text-center w-full absolute top-full">
                        <button className="px-6 py-2 border border-romantic-gold/30 rounded-full text-romantic-gold/70 text-sm hover:bg-romantic-gold hover:text-romantic-dark transition-all duration-300">Repair</button>
                    </div>
                </div>
            </section>
            )}
        </>
    )}

    <footer className="py-10 text-center text-gray-600 text-xs tracking-widest uppercase relative z-10 snap-end">
      <p>Made with ❤️ for Jesanel</p>
      <p>02.04.2026</p>
    </footer>

  </div>
  );
}

export default App;