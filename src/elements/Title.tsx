function Table({ title, description }: { title: string; description?: string }) {
    return (
        <>
            <h1 className='text-white font-bold text-2xl leading-8 mb-2'>{title}</h1>
            {description && <p className='text-zinc-400 text-base'>{description}</p>}
        </>
    );
}

export default Table;
