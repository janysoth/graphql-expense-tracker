const Greeting = () => {
  return (
    <div className='mb-2'>
      <h1 className='md:text-4xl text-8xl lg:text-6xl font-bold text-center  relative z-50 text-white pt-10'>
        Welcome to Expense Tracker
      </h1>
      <p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text p-5'>
        Spend wisely, track wisely
      </p>
    </div>
  );
};

export default Greeting;