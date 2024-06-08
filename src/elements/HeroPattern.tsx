import { useId } from 'react';

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
    width: number;
    height: number;
    x: number;
    y: number;
    squares?: [number, number][];
}

function GridPattern({ width, height, x, y, squares, ...props }: GridPatternProps) {
    const patternId = useId();

    return (
        <svg aria-hidden='true' {...props}>
            <defs>
                <pattern id={patternId} width={width} height={height} patternUnits='userSpaceOnUse' x={x} y={y}>
                    <path d={`M.5 ${height}V.5H${width}`} fill='none' />
                </pattern>
            </defs>
            <rect width='100%' height='100%' strokeWidth={0} fill={`url(#${patternId})`} />
            {squares && (
                <svg x={x} y={y} className='overflow-visible'>
                    {squares.map(([squareX, squareY]) => (
                        <rect
                            strokeWidth='0'
                            key={`${squareX}-${squareY}`}
                            width={width + 1}
                            height={height + 1}
                            x={squareX * width}
                            y={squareY * height}
                        />
                    ))}
                </svg>
            )}
        </svg>
    );
}

function HeroPattern() {
    return (
        <>
            <div className='absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden'>
                <div className='absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]'>
                    <div className='absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100'>
                        <GridPattern
                            width={72}
                            height={56}
                            x={-12}
                            y={4}
                            squares={[
                                [4, 3],
                                [2, 1],
                                [7, 3],
                                [10, 6],
                            ]}
                            className='absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5'
                        />
                    </div>
                    <svg
                        viewBox='0 0 1113 440'
                        aria-hidden='true'
                        className='absolute left-1/2 top-0 ml-[-19rem] w-[69.5625rem] fill-white blur-[26px] dark:hidden'
                    >
                        <path d='M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z' />
                    </svg>
                </div>
            </div>
        </>
    );
}

export default HeroPattern;
