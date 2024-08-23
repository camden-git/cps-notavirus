function Table({ title, description }: { title: string; description?: string }) {
    return (
        <>
            <h1 className='mb-2 text-2xl font-bold leading-8 text-white'>{title}</h1>
            {description && <p className='text-base text-zinc-400'>{description}</p>}
        </>
    );
}

export default Table;
