import { Link } from 'react-router-dom';

const resources = [
    {
        href: '/districs',
        name: 'Districts',
        description: 'View payroll records by district (schools / networks / offices)',
    },
    {
        href: '/jobs',
        name: 'Jobs',
        description: 'View all filled jobs and their payroll records ',
    },
    {
        href: '/insights',
        name: 'Insights',
        description: 'See changes in hiring by job and district over time',
    },
    {
        href: '/api',
        name: 'API',
        description: 'Use our data in your app, available over HTTP and downloadable SQL',
    },
];

export function Resources() {
    return (
        <div className='my-16 hidden xl:block xl:max-w-none'>
            <h2>Resources</h2>
            <div className='mt-4 grid grid-cols-1 gap-8 border-t border-white/5 pt-10 sm:grid-cols-2 xl:grid-cols-4'>
                {resources.map((resource) => (
                    <div key={resource.href}>
                        <h3 className='text-sm font-semibold text-white'>{resource.name}</h3>
                        <p className='mt-1 text-sm text-zinc-400'>{resource.description}</p>
                        <p className='mt-4'>
                            <Link
                                to={resource.href}
                                className='inline-flex justify-center gap-0.5 overflow-hidden text-sm font-medium text-emerald-400 transition hover:text-emerald-500'
                            >
                                Read more
                                <svg
                                    viewBox='0 0 20 20'
                                    fill='none'
                                    aria-hidden='true'
                                    className='-mr-1 mt-0.5 h-5 w-5'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9'
                                    />
                                </svg>
                            </Link>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
