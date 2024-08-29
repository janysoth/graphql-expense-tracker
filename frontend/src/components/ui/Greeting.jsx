const Greeting = () => {
  return (
    <div className='mb-2 p-4 sm:p-6 md:p-8 lg:p-10'>
      <p className="text-3xl sm:text-4xl font-semibold mb-2 text-white text-center">
        Welcome to Expense Tracker
      </p>
      <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-center relative z-50 mb-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 text-transparent bg-clip-text p-2 sm:p-4 block'>
        Spend wisely, track wisely
      </p>
    </div>
  );
};

export default Greeting;