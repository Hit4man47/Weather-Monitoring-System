import React, { useMemo } from 'react';

const AnimatedDroplet = ({ humidity = 0 }) => {
    
    const numberOfParticles = useMemo(() => Math.ceil((humidity / 8)), [humidity]);
    
    const particles = useMemo(() => {
        return [...Array(numberOfParticles)].map((_, i) => ({
            size: Math.random() * 0.6 + 0.4,     
            speed: Math.random() * 3 + 2,        
            delay: Math.random() * 5,            
            position: Math.random() * 100,       
            startY: Math.random() * 30 + 70      
        }));
    }, [numberOfParticles]);

    
    const condensationDrops = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            size: Math.random() * 6 + 3,         
            posX: Math.random() * 100,           
            posY: Math.random() * 70 + 10,       
            delay: Math.random() * 4,
            duration: Math.random() * 3 + 4
        }));
    }, []);

    const getVaporColor = () => {
        if (humidity < 30) return 'bg-blue-100';
        if (humidity < 60) return 'bg-blue-200';
        return 'bg-blue-300';
    };

    const getPoolColor = () => {
        if (humidity < 30) return 'bg-blue-300';
        if (humidity < 60) return 'bg-blue-400';
        return 'bg-blue-500';
    };

    return (
        <div className="relative w-full h-28 overflow-hidden">
            <div className="absolute inset-0">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${particle.position}%`,
                            bottom: `${particle.startY}%`,
                            animation: `float ${particle.speed}s ease-in-out infinite`,
                            animationDelay: `${particle.delay}s`,
                        }}
                    >
                        <div
                            className={`${getVaporColor()} rounded-full blur-md`}
                            style={{
                                width: `${8 * particle.size}px`,
                                height: `${8 * particle.size}px`,
                                opacity: 0.8,
                                transform: 'scale(1)',
                                animation: `pulse ${1.5 + particle.speed / 2}s ease-in-out infinite`,
                                animationDelay: `${particle.delay}s`
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute inset-0">
                {condensationDrops.map((drop, i) => (
                    <div
                        key={`drop-${i}`}
                        className="absolute"
                        style={{
                            left: `${drop.posX}%`,
                            top: `${drop.posY}%`,
                            animation: `droplet ${drop.duration}s ease-in-out infinite`,
                            animationDelay: `${drop.delay}s`
                        }}
                    >
                        <div
                            className={`${getPoolColor()} relative`}
                            style={{
                                width: `${drop.size}px`,
                                height: `${drop.size * 1.2}px`,
                                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                                transform: 'rotate(45deg)',
                                opacity: 0.7
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <div
                    className={`
                        relative w-[95%] mx-auto
                        transition-all duration-1000 ease-in-out
                        ${getPoolColor()}
                    `}
                    style={{
                        height: `${Math.min(28, humidity / 3.5)}px`,
                        borderRadius: '100% 100% 0 0 / 120% 120% 0 0',
                        transform: `scaleY(${humidity / 100})`,
                        opacity: 0.8,
                        boxShadow: `
                            inset 0 2px 6px rgba(0,0,0,0.3),
                            0 -2px 6px rgba(255,255,255,0.2)
                        `
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            borderRadius: 'inherit',
                            background: `
                                radial-gradient(
                                    circle at 30%,
                                    rgba(255,255,255,0.4) 0%,
                                    transparent 70%
                                ),
                                radial-gradient(
                                    circle at 70%,
                                    rgba(255,255,255,0.3) 0%,
                                    transparent 60%
                                )
                            `,
                            animation: 'wave 4s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0;
                    }
                    50% {
                        transform: translateY(-${30 + humidity / 4}px) scale(1.3);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-${50 + humidity / 3}px) scale(0.6);
                        opacity: 0;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(0.8);
                    }
                    50% {
                        transform: scale(1.4);
                    }
                }

                @keyframes droplet {
                    0%, 100% {
                        transform: translateY(0) scale(0.8);
                        opacity: 0.4;
                    }
                    50% {
                        transform: translateY(3px) scale(1.1);
                        opacity: 0.8;
                    }
                }

                @keyframes wave {
                    0%, 100% {
                        transform: translateY(0) scaleY(1);
                    }
                    50% {
                        transform: translateY(2px) scaleY(1.02);
                    }
                }
            `}</style>
        </div>
    );
};

export default AnimatedDroplet;