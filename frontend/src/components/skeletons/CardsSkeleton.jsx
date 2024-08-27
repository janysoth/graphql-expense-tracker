const CardsSkeleton = () => {
  return (
    <div>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center gap-3'>
          <div className='h-6 w-1/3 bg-gray-200 rounded dark:bg-gray-700 animate-pulse'></div>
          <div className='w-6 h-6 ml-[10rem] bg-gray-200 rounded-full animate-pulse'></div>
          <div className='w-6 h-6 bg-gray-200 rounded-full animate-pulse'></div>
        </div>
        <div className='h-6 w-1/3 bg-gray-200 rounded dark:bg-gray-700 animate-pulse'></div>
        <div className='h-6 w-1/3 bg-gray-200 rounded dark:bg-gray-700 animate-pulse'></div>
        <div className='h-6 w-1/3 bg-gray-200 rounded dark:bg-gray-700 animate-pulse'></div>
        <div className='h-6 w-1/3 bg-gray-200 rounded dark:bg-gray-700 animate-pulse'></div>
        <div className='flex flex-row items-center gap-3'>
          <div className='h-4 w-1/4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse'></div>
          <div className='ml-[14rem] h-8 w-8 bg-gray-200 rounded-full animate-pulse'></div>
        </div>
      </div>
    </div>
  );
};

export default CardsSkeleton;