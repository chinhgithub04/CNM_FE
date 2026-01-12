export default function HomePage() {
  return (
    <div className='py-12'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl'>
          Welcome to Merxly
        </h1>
        <p className='max-w-175 text-lg text-muted-foreground sm:text-xl'>
          Discover amazing crowdfunding campaigns and exclusive products. Join
          our community and be part of something special.
        </p>
      </div>
    </div>
  );
}
