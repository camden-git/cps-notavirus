import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Search from './Search';

function TopLevelNavItem({ href, children }: { href: string; children: ReactNode }) {
    return (
        <li>
            <Link to={href} className='block py-1 text-sm transition text-zinc-400 hover:text-white'>
                {children}
            </Link>
        </li>
    );
}

function Navigation() {
    return (
        <>
            <div
                className={
                    'fixed inset-x-0 top-0 z-50 flex h-14 items-center px-4 transition sm:px-6 lg:z-30 backdrop-blur bg-zinc-900/5'
                }
            >
                <div className='absolute inset-x-0 top-full h-px bg-white opacity-10' />
                <Link to='/'>
                    <Logo />
                </Link>
                <div className='hidden lg:block lg:max-w-md lg:flex-auto'>
                    <Search />
                </div>
                <div className='flex items-center ml-auto'>
                    <nav className='hidden md:block'>
                        <ul role='list' className='flex items-center gap-8'>
                            {/*TODO: autogen?? */}
                            <TopLevelNavItem href='/'>API</TopLevelNavItem>
                            <TopLevelNavItem href='#'>Blog</TopLevelNavItem>
                            <TopLevelNavItem href='/about'>About</TopLevelNavItem>
                        </ul>
                    </nav>
                    <div className='hidden md:block md:h-5 md:w-px md:bg-white/15 md:mx-4' />
                    {/*TODO: what even */}
                    <a
                        className='inline-flex justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 hover:bg-zinc-700 bg-emerald-400/10 text-emerald-400 ring-1 ring-inset ring-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 hover:ring-emerald-300'
                        href='/#'
                    >
                        Sign in
                    </a>
                </div>
            </div>
        </>
    );
}

export default Navigation;
