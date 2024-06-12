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
                </div>
            </div>
        </>
    );
}

export default Navigation;
