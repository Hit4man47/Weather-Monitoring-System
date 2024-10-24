import React, { useEffect, useRef } from 'react';
import StaticImg from './Static.png';
const gridSize = 70;

const AnimatedBackground = () => {
    const takenVerticalLines = useRef(new Set());
    const takenHorizontalLines = useRef(new Set());
    const speed = 3000; 

    useEffect(() => {
        takenVerticalLines.current.clear();
        takenHorizontalLines.current.clear();
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern
                        id="grid-pattern"
                        width={gridSize}
                        height={gridSize}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={`M ${gridSize} 0 L 0 0 0 ${gridSize} M 0 ${gridSize} L ${gridSize} ${gridSize}`}
                            fill="none"
                            stroke="rgba(150, 150, 150, 0.2)"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
            <svg className="absolute inset-0" width="100%" height="100%">
                <defs>
                    <radialGradient id="lightGradient">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
                {Array.from({ length: 12 }).map((_, index) => {
                    const isVertical = Math.random() > 0.5;
                    let pos;

                    if (isVertical) {
                        let xPos;
                        do {
                            xPos = Math.floor(Math.random() * window.innerWidth / gridSize) * gridSize;
                        } while (takenVerticalLines.current.has(xPos));
                        takenVerticalLines.current.add(xPos);
                        pos = { x: xPos, y: Math.random() * window.innerHeight };
                    } else {
                        let yPos;
                        do {
                            yPos = Math.floor(Math.random() * window.innerHeight / gridSize) * gridSize;
                        } while (takenHorizontalLines.current.has(yPos));
                        takenHorizontalLines.current.add(yPos);
                        pos = { x: Math.random() * window.innerWidth, y: yPos };
                    }

                    const delay = Math.random() * 5;
                    const direction = Math.random() > 0.5 ? gridSize * 6 : -gridSize * 6;

                    return (
                        <rect
                            key={`${isVertical ? 'v' : 'h'}-${index}`}
                            fill="url(#lightGradient)"
                            x={isVertical ? pos.x : pos.x - gridSize}
                            y={isVertical ? pos.y - gridSize : pos.y}
                            width={isVertical ? 2 : gridSize * 2}
                            height={isVertical ? gridSize * 2 : 2}
                        >
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                from={isVertical ? `0 ${direction}` : `${direction} 0`}
                                to={isVertical ? `0 ${-direction}` : `${-direction} 0`}
                                dur={`${speed}ms`}
                                begin={`${delay}s`}
                                repeatCount="indefinite"
                                additive="sum"
                            />
                            <animate
                                attributeName="opacity"
                                values="0;1;1;0"
                                dur={`${speed}ms`}
                                begin={`${delay}s`}
                                repeatCount="indefinite"
                            />
                        </rect>
                    );
                })}
            </svg>
            <div className="absolute inset-0" style={{ maskImage: 'radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)' }}>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none absolute -inset-[10px] overflow-hidden text-white blur-[15px] invert dark:text-black dark:invert-0 opacity-30 dark:opacity-10"
                        style={{
                            transform: 'translate3d(0, 0, 0)',
                            '--bg': 'currentcolor',
                            '--duration': '60s',
                            '--stripes': 'repeating-linear-gradient(110deg, var(--bg) 0%, var(--bg) 7%, transparent 10%, transparent 12%, var(--bg) 16%)',
                            '--rainbow': 'repeating-linear-gradient(110deg, #60a5fa 10%, #e879f9 15%, #60a5fa 20%, #5eead4 25%, #60a5fa 30%)',
                            backgroundImage: 'var(--stripes), var(--rainbow)',
                            backgroundSize: '120%, 200%',
                            backgroundPosition: '50% 50%, 50% 50%'
                        }}>
                        <div className="animate-god-rays absolute h-full w-[300%] mix-blend-difference"
                            style={{
                                backgroundImage: 'var(--stripes), var(--rainbow)',
                                backgroundSize: '100%, 100%',
                                backgroundPosition: '50% 50%'
                            }}></div>
                    </div>
                </div>
            </div>

            <div 
                className="fixed h-full w-full pointer-events-none"
                style={{
                    left: 'calc(50.00000000000002% - 100% / 2)',
                    top: 0,
                    zIndex: 4
                }}
            >
                <div 
                    className="w-full h-full"
                    style={{
                        backgroundSize: '64px',
                        backgroundRepeat: 'repeat',
                        backgroundImage: `url(${StaticImg})`,
                        opacity: 0.06,
                        borderRadius: '0px'
                    }}
                />
            </div>

        </div>
    );
};

export default AnimatedBackground;
