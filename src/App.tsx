import { Routes, Route, Link } from 'react-router-dom';
import Index from './Index';
import Navigation from './elements/Navigation';
import HeroPattern from './elements/HeroPattern';
import Footer from './elements/Footer';

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to='/'>Go to the home page</Link>
            </p>
        </div>
    );
}

export default function App() {
    return (
        <>
            <div className='lg:ml-72 xl:ml-80'>
                <Navigation />
                <div className='relative px-4 pt-14 sm:px-6 lg:px-8'>
                    <HeroPattern />
                    <div className='lg:mr-72 xl:mr-80'>
                        <main className='py-32 text-white'>
                            <Routes>
                                <Route index element={<Index />} />
                                <Route path='*' element={<NoMatch />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    );
}
